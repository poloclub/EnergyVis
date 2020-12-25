import React from 'react';
import USMap from '../EnergyMap/USMap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CounterfactualAlert from '../CounterfactualAlert/CounterfactualAlert'
import HardwareView from  '../HardwareComponents/HardwareView'
import ExplainableEquation from  '../ExplainableEquation/ExplainableEquation'
import DataSourceView from '../DataSourceView/DataSourceView'

import SampleGraph from '../TrackerGraphs/SampleGraph'
import './TrackerPageStyles.css'

class TrackerPage extends React.Component {

  constructor(props) {
    super();    
  }

  render() {
    const firstRowStyle = {height: "500px", marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%', marginBottom: '2%'}
    return (
      <div>

        <CounterfactualAlert />
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
                <ExplainableEquation />
              </Grid>
            </Grid>
            </Paper>
          </div>

          <div id="col-2">
            <Grid container>
              <Grid item xs>
                <Paper style={firstRowStyle}>
                  <USMap />                  
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Paper style={{marginLeft: "2.5%", marginRight: '2.5%', marginTop: "2%", marginBottom: '2%'}}>
                  <HardwareView />
                    {
                    // updateQuantityHandler={(region, component, quantity) => {
                    //   var copiedState = {...this.state.initialComponents}
                    //   copiedState[region][component] = quantity
                    //   if (!this.state.counterfactualMode) this.setState({counterfactualAlert: true});
                    //   this.setState({initialComponents: copiedState})
                    // }}
                  }
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