import { observable, action, makeObservable, runInAction } from 'mobx';
import { SERVER_URI } from '../consts/consts'

export class TrackerStore {
  @observable counterfactualMode = false;
  @observable counterfactualAlert = false;
  @observable initialComponents = {
    "gpu" : {},
    "cpu" : {}
  };
  @observable initialState = "Georgia"
  @observable initialPUE = 1.58
  @observable hoveredState = null;

  startComponents = {
    "gpu" : {},
    "cpu" : {}
  };

  startState = "Georgia";
  startPUE = 1.58;

  constructor() {
    makeObservable(this);
    this.getInitialState();
  }

  async getInitialState () {
    fetch(SERVER_URI + "initial-setup").then((response) => response.json())
      .then((data) => {
        // bit hacky, find a better way to deepclone so the states aren't the same...
        runInAction(() => {
          this.startComponents = JSON.parse(JSON.stringify(data["component_names"]))
          this.initialComponents = JSON.parse(JSON.stringify(data["component_names"]))
  
          this.startState = JSON.parse(JSON.stringify(data["state"]))
          this.initialState = JSON.parse(JSON.stringify(data["state"]))
          
          this.counterfactualMode = JSON.parse(JSON.stringify(data["paused"]))
        })
    })    
  }

  @action resetTracker () {
    this.initialComponents = JSON.stringify(JSON.parse(this.startComponents));
    this.initialState = this.startState;
    this.initialPUE = this.startPUE
    this.counterfactualMode = false;
    this.counterfactualAlert = false;
  }

  // alternative mode actions

  @action promptAlternativeMode () {
    this.counterfactualAlert = true;
  }

  @action enterAlternativeMode () {
    this.counterfactualAlert = false;
    this.counterfactualMode = true;
  }

  // map actions

  @action setHoveredState (newState) {
    this.hoveredState = newState
  }

  // hardware actions

  @action setPUE (newPUE) {
    this.initialPUE = newPUE
  }

}

export default new TrackerStore();
