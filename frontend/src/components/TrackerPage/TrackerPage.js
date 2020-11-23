import React from 'react';
import USMap from '../EnergyMap/USMap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CounterfactualAlert from '../CounterfactualAlert/CounterfactualAlert'
import HardwareView from  '../HardwareComponents/HardwareView'
import SampleGraph from '../TrackerGraphs/SampleGraph'
import './TrackerPageStyles.css'

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';


// import MathJax from 'react-mathjax2'
const tex = `p_{t}=\\frac{1.58 t\\left(p_{c}+p_{r}+g p_{g}\\right)}{1000}`

class TrackerPage extends React.Component {

  constructor(props) {
    super();
    this.state = {
      counterfactualMode: false,
      counterfactualAlert: true
    }
  }

  render() {

    const firstRowStyle = {height: "500px", marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%'}
    return (
      <div>

        <CounterfactualAlert open={this.state.counterfactualAlert} handleClose={(enableCounterfactual) => {
          this.setState({counterfactualAlert: false, counterfactualMode: enableCounterfactual})
        }} />

        { this.state.counterfactualMode && 
          <Alert
            severity="info"
            action={
              <Button onClick={() => {this.setState({counterfactualMode: false})}} variant="contained" color="primary">
                Resume
              </Button>
            }
          >
            Your training has been paused because you're exploring alternatives! Click resume to continue training.
          </Alert>
        }
        <div className="split-container">
          <div id="col-1">
            <Paper style={{marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%'}}>
            <Grid container>
              <Grid item xs>
                <SampleGraph />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <div>
                    <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
                      Calculating Your Emissions
                    </Typography>
                    <Divider variant="middle" />
                  <div style={{paddingTop: "1%"}}>
                    <TeX block>{tex}</TeX>
                  </div>
                  <div style={{padding: "2%"}}>
                    <TeX block>{"\\mathrm{CO}_{2} \\mathrm{e}=0.954 p_{t}"}</TeX>
                  </div>
                </div>
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