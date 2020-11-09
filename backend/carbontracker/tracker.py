import os
import sys
import time
import traceback
import psutil
import math
from threading import Thread, Event
from flask import jsonify
from flask_cors import CORS

import numpy as np

from carbontracker import constants
from carbontracker import loggerutil
from carbontracker import predictor
from carbontracker import exceptions
from carbontracker.components import component

import time
from flask import Flask                                                         

class CarbonTrackerThread(Thread):
    """Thread to fetch consumptions"""
    def __init__(self,
                 components,
                 logger,
                 ignore_errors,
                 delete,
                 flask_server,
                 update_interval=10):
        super(CarbonTrackerThread, self).__init__()
        self.name = "CarbonTrackerThread"
        self.delete = delete
        self.components = components
        self.update_interval = update_interval
        self.ignore_errors = ignore_errors
        self.logger = logger
        self.flask_server = flask_server
        self.epoch_times = []
        self.running = True
        self.measuring = False
        self.epoch_counter = 0
        self.daemon = True

        self.start()

    def run(self):
        """Thread's activity."""
        try:
            self.begin()
            while self.running:
                self.component_energy_per_epoch()
                if not self.measuring:
                    continue
                self._collect_measurements()
                time.sleep(self.update_interval)

            # Shutdown in thread's activity instead of epoch_end() to ensure
            # that we only shutdown after last measurement.
            self._components_shutdown()
        except Exception as e:
            self._handle_error(e)

    def begin(self):
        self._components_remove_unavailable()
        self._components_init()
        self._log_components_info()
        self.logger.info("Monitoring thread started.")

    def stop(self):
        if not self.running:
            return

        self.measuring = False
        self.running = False
        self.logger.info("Monitoring thread ended.")
        self.logger.output("Finished monitoring.", verbose_level=1)

    def epoch_start(self):
        self.epoch_counter += 1
        self.measuring = True
        self.cur_epoch_time = time.time()

    def epoch_end(self):
        self.measuring = False
        self.epoch_times.append(time.time() - self.cur_epoch_time)
        self._log_epoch_measurements()

    def _log_components_info(self):
        log = ["The following components were found:"]
        for comp in self.components:
            name = comp.name.upper()
            devices = ", ".join(comp.devices())
            log.append(f"{name} with device(s) {devices}.")
        log_str = " ".join(log)
        self.logger.info(log_str)
        self.logger.output(log_str, verbose_level=1)

    def _log_epoch_measurements(self):
        self.logger.info(f"Epoch {self.epoch_counter}:")
        duration = self.epoch_times[-1]
        self.logger.info(
            f"Duration: {loggerutil.convert_to_timestring(duration, True)}")
        for comp in self.components:
            if comp.power_usages and comp.power_usages[-1]:
                power_avg = np.mean(comp.power_usages[-1], axis=0)
                # If np.mean is calculated during a measurement, it will get an
                # empty list and return nan, if this is the case we take the previous measurement.
                # TODO: Use semaphores to wait for measurement to finish.
                if np.isnan(power_avg).all():
                    power_avg = np.mean(
                        comp.power_usages[-2],
                        axis=0) if len(comp.power_usages) >= 2 else None
            else:
                self.logger.err_warn(
                    "Epoch duration is too short for a measurement to be "
                    "collected.")
                power_avg = None

            self.logger.info(
                f"Average power usage (W) for {comp.name}: {power_avg}")

    def _components_remove_unavailable(self):
        self.components = [cmp for cmp in self.components if cmp.available()]
        if not self.components:
            raise exceptions.NoComponentsAvailableError()

    def _components_init(self):
        for comp in self.components:
            comp.init()

    def _components_shutdown(self):
        for comp in self.components:
            comp.shutdown()

    def _collect_measurements(self):
        """Collect one round of measurements."""
        for comp in self.components:
            comp.collect_power_usage(self.epoch_counter)

    def total_energy_per_epoch(self):
        """Retrieves total energy (kWh) per epoch used by all components"""
        total_energy = np.zeros(len(self.epoch_times))
        for comp in self.components:
            energy_usage = comp.energy_usage(self.epoch_times)
            total_energy += energy_usage
        return total_energy
    
    def component_energy_per_epoch(self):
        energy_names = {}
        for comp in self.components:
            energy_names[comp.name] = comp.energy_usage(self.epoch_times, expanded_interval=self.update_interval)
        self.flask_server.energy_stats = energy_names
        return energy_names
    
    def _handle_error(self, error):
        err_str = traceback.format_exc()
        if self.ignore_errors:
            err_str = (f"Ignored error: {err_str}Continued training without "
                       "monitoring...")

        self.logger.err_critical(err_str)
        self.logger.output(err_str)

        if self.ignore_errors:
            # Stop monitoring but continue training.
            self.delete()
        else:
            os._exit(70)

            
class FlaskServerThread(Thread):
    def __init__(self):
        super(FlaskServerThread, self).__init__()
        self.training_paused = False
        self.energy_stats = None
        self.start()
        
    def run(self):
        app = Flask(__name__)
        CORS(app)
        @app.route("/")
        def main():
            return "EnergyVis backend is tracking..."
        
        @app.route("/pause")
        def pause():
            self.training_paused = not self.training_paused
            return {"training_paused": self.training_paused}
        
        @app.route("/energy-stats")
        def get_energy_statistics():
            return self.energy_stats
        
        app.run()

class CarbonTracker:
    def __init__(self,
                 epochs,
                 epochs_before_pred=1,
                 monitor_epochs=1,
                 update_interval=10,
                 stop_and_confirm=False,
                 ignore_errors=False,
                 components="all",
                 devices_by_pid=False,
                 log_dir=None,
                 verbose=1,
                 decimal_precision=6):
        self.epochs = epochs
        self.epochs_before_pred = (epochs if epochs_before_pred < 0 else
                                   epochs_before_pred)
        self.monitor_epochs = (epochs
                               if monitor_epochs < 0 else monitor_epochs)
        if (self.monitor_epochs == 0
                or self.monitor_epochs < self.epochs_before_pred):
            raise ValueError(
                "Argument monitor_epochs expected a value in "
                f"{{-1, >0, >=epochs_before_pred}}, got {monitor_epochs}.")
        self.stop_and_confirm = stop_and_confirm
        self.ignore_errors = ignore_errors
        self.epoch_counter = 0
        self.decimal_precision = decimal_precision
        self.deleted = False
        self.flask_server = FlaskServerThread()
        
        try:
            pids = self._get_pids()
            self.logger = loggerutil.Logger(log_dir=log_dir, verbose=verbose)
            self.tracker = CarbonTrackerThread(
                delete=self._delete,
                components=component.create_components(
                    components=components,
                    pids=pids,
                    devices_by_pid=devices_by_pid),
                logger=self.logger,
                ignore_errors=ignore_errors,
                flask_server=self.flask_server,
                update_interval=update_interval,
            )

        except Exception as e:
            self._handle_error(e)
            

    def epoch_start(self):
        if self.deleted:
            return

        try:
            while self.flask_server.training_paused:
                time.sleep(2)
            
            self.tracker.epoch_start()
            self.epoch_counter += 1
        except Exception as e:
            self._handle_error(e)

    def epoch_end(self):
        if self.deleted:
            return

        try:
            self.tracker.epoch_end()

            if self.epoch_counter == self.monitor_epochs:
                self._output_actual()
                            
            if self.epoch_counter == self.epochs_before_pred:
                self._output_pred()
                if self.stop_and_confirm:
                    self._user_query()

            if self.epoch_counter == self.monitor_epochs:
                self._delete()
                            
        except Exception as e:
            self._handle_error(e)

    def stop(self):
        """Ensure that tracker is stopped and deleted. E.g. use with early
        stopping, where not all monitor_epochs have been run."""
        if self.deleted:
            return
        self.logger.info(
            f"Training was interrupted before all {self.monitor_epochs} epochs"
            " were monitored.")
        # Decrement epoch_counter with 1 since measurements for ultimate epoch
        # was interrupted and is not accounted for.
        self.epoch_counter -= 1
        self._output_actual()
        self._delete()


    def _handle_error(self, error):
        err_str = traceback.format_exc()
        if self.ignore_errors:
            err_str = (f"Ignored error: {err_str}Continued training without "
                       "monitoring...")

        self.logger.err_critical(err_str)
        self.logger.output(err_str)

        if self.ignore_errors:
            # Stop monitoring but continue training.
            self._delete()
        else:
            sys.exit(70)

    def _output_energy(self, description, time, energy):
        precision = self.decimal_precision
        output = (f"\n{description}\n"
                  f"\tTime:\t{loggerutil.convert_to_timestring(time)}\n"
                  f"\tEnergy:\t{energy:.{precision}f} kWh\n")

        self.logger.output(output, verbose_level=1)

    def _output_actual(self):
        """Output actual usage so far."""
        energy_usages = self.tracker.total_energy_per_epoch()
        energy = energy_usages.sum()
        times = self.tracker.epoch_times
        time = np.sum(times)
    
        self._output_energy(
            f"Actual consumption for {self.epoch_counter} epoch(s):", time,
            energy)


    def _output_pred(self):
        """Output predicted usage for full training epochs."""
        epoch_energy_usages = self.tracker.total_energy_per_epoch()
        epoch_times = self.tracker.epoch_times
        pred_energy = predictor.predict_energy(self.epochs,
                                               epoch_energy_usages)
        pred_time = predictor.predict_time(self.epochs, epoch_times)

        self._output_energy(
            f"Predicted consumption for {self.epochs} epoch(s):", pred_time,
            pred_energy)


    def _user_query(self):
        self.logger.output("Continue training (y/n)?")
        user_input = input().lower()
        self._check_input(user_input)

    def _check_input(self, user_input):
        if user_input == "y":
            self.logger.output("Continuing...")
            return
        elif user_input == "n":
            self.logger.info("Session ended by user.")
            self.logger.output("Quitting...")
            sys.exit(0)
        else:
            self.logger.output("Input not recognized. Try again (y/n):")
            user_input = input().lower()
            self._check_input(user_input)

    def _delete(self):
        self.tracker.stop()
        del self.logger
        del self.tracker
        self.deleted = True

    def _get_pids(self):
        """Get current process id and all children process ids."""
        process = psutil.Process()
        pids = [process.pid
                ] + [child.pid for child in process.children(recursive=True)]
        return pids
