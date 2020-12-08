import React from 'react';
import USMap from '../EnergyMap/USMap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { SERVER_URI } from '../../consts/consts' 

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
import { createNull } from 'typescript';


// import MathJax from 'react-mathjax2'
const tex = `p_{t}=\\frac{1.58 t\\left(p_{c}+p_{r}+g p_{g}\\right)}{1000}`

class TrackerPage extends React.Component {

  constructor(props) {
    super();
    this.state = {
      counterfactualMode: false,
      counterfactualAlert: false,
      initialComponents: null,
      initialState: null
    }
    this.startComponents = null
  }

  componentDidMount() {
    fetch(SERVER_URI + "initial-setup").then((response) => response.json())
      .then((data) => {
        // bit hacky, find a better way to deepclone so the states aren't the same...
        this.startComponents = JSON.parse(JSON.stringify(data["component_names"]))
        this.setState({
          initialComponents: JSON.parse(JSON.stringify(data["component_names"])),
          initialState: JSON.parse(JSON.stringify(data["state"]))
        })
      })
  }

  render() {
    const firstRowStyle = {height: "500px", marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%'}
    return (
      <div>

        <CounterfactualAlert open={this.state.counterfactualAlert} handleClose={(enableCounterfactual) => {
          this.setState({counterfactualAlert: false, counterfactualMode: enableCounterfactual})
          if (enableCounterfactual == false) {
            this.setState({initialComponents: JSON.parse(JSON.stringify(this.startComponents))})
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
                Resume
              </Button>
            }
          >
            Your training has been paused because you're exploring alternatives! Click resume to reset alternatives and continue training.
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
                  <USMap alternativeHandle={() => {
                    if (!this.state.counterfactualMode) this.setState({counterfactualAlert: true});
                  }} 
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
                  components={this.state.initialComponents}
                  updateQuantityHandler={(region, component, quantity) => {
                    var copiedState = {...this.state.initialComponents}
                    copiedState[region][component] = quantity
                    if (!this.state.counterfactualMode) this.setState({counterfactualAlert: true});
                    this.setState({initialComponents: copiedState})
                  }}/>
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