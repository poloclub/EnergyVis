import React from 'react';
import USMap from '../EnergyMap/USMap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { SERVER_URI } from '../../consts/consts' 

import CounterfactualAlert from '../CounterfactualAlert/CounterfactualAlert'
import HardwareView from  '../HardwareComponents/HardwareView'
import ExplainableEquation from  '../ExplainableEquation/ExplainableEquation'
import DataSourceView from '../DataSourceView/DataSourceView'

import SampleGraph from '../TrackerGraphs/SampleGraph'
import './TrackerPageStyles.css'

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';


class TrackerPage extends React.Component {

  constructor(props) {
    super();
    this.state = {
      counterfactualMode: false,
      counterfactualAlert: false,
      initialComponents: null,
      initialState: "Texas", // todo, change to Georgia
      initialPUE: 1.53,
      hoveredState: null
    }

    this.startPUE = 1.53
    this.startComponents = null
    
  }

  componentDidMount() {
    fetch(SERVER_URI + "initial-setup").then((response) => response.json())
      .then((data) => {
        // bit hacky, find a better way to deepclone so the states aren't the same...
        this.startComponents = JSON.parse(JSON.stringify(data["component_names"]))
        this.setState({
          initialComponents: JSON.parse(JSON.stringify(data["component_names"])),
          initialState: JSON.parse(JSON.stringify(data["state"])),
          counterfactualMode: JSON.parse(JSON.stringify(data["paused"]))
        })
      })
  }

  render() {
    const firstRowStyle = {height: "500px", marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%', marginBottom: '2%'}
    return (
      <div>

        <CounterfactualAlert open={this.state.counterfactualAlert} handleClose={(enableCounterfactual) => {
          this.setState({counterfactualAlert: false, counterfactualMode: enableCounterfactual})
          if (enableCounterfactual == false) {
            this.setState({initialComponents: JSON.parse(JSON.stringify(this.startComponents))})
            // fetch(SERVER_URI + "pause?" + new URLSearchParams({status: "false"}))
            //   .then((response) => response.json())
            //   .then((data) => {
            //   })
          } else {
            // fetch(SERVER_URI + "pause?" + new URLSearchParams({status: "true"}))
            //   .then((response) => response.json())
            //   .then((data) => {
            //   })
          }
        }} />

        { this.state.counterfactualMode && 
          <Alert
            severity="info"
            action={
              <Button onClick={() => {
                this.setState({
                  initialComponents: JSON.parse(JSON.stringify(this.startComponents)), 
                  counterfactualMode: false
                })
              }} variant="contained" color="primary">
                Reset
              </Button>
            }
          >
            Your training has been paused because you're exploring alternatives! Click reset to reset alternatives with default values.
          </Alert>
        }

        <DataSourceView />

        <div className="split-container">
          <div id="col-1">
            <Paper style={{marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%', marginBottom: '2%'}}>
            <Grid container>
              <Grid item xs>
                <SampleGraph />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <ExplainableEquation hoveredState={this.state.hoveredState} initialPUE={this.state.initialPUE} />
              </Grid>
            </Grid>
            </Paper>
          </div>

          <div id="col-2">
            <Grid container>
              <Grid item xs>
                <Paper style={firstRowStyle}>
                  <USMap alternativeHandle={() => {
                    if (!this.state.counterfactualMode) this.setState({counterfactualAlert: true});
                  }} 
                  selectedStateHandler={(newState) => { this.setState({hoveredState: newState}) }}
                  initialState={this.state.initialState} 
                  counterfactualMode={this.state.counterfactualMode} 
                  open={this.state.counterfactualAlert} 
                  />
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Paper style={{marginLeft: "2.5%", marginRight: '2.5%', marginTop: "2%", marginBottom: '2%'}}>
                  <HardwareView 
                    initialPUE={this.state.initialPUE}
                    components={this.state.initialComponents}
                    updatePUEHandler={(event) => {
                      if (event.target.value >= 0) this.setState({initialPUE: event.target.value});
                    }}
                    updateQuantityHandler={(region, component, quantity) => {
                      var copiedState = {...this.state.initialComponents}
                      copiedState[region][component] = quantity
                      if (!this.state.counterfactualMode) this.setState({counterfactualAlert: true});
                      this.setState({initialComponents: copiedState})
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackerPage