import React from 'react';
import USMap from '../EnergyMap/USMap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import HardwareItem from '../HardwareComponents/HardwareItem'
import HardwareAutoComplete from '../HardwareComponents/HardwareAutoComplete'
import SampleGraph from '../TrackerGraphs/SampleGraph'
import './TrackerPageStyles.css'

// import MathJax from 'react-mathjax2'
const tex = `p_{t}=\\frac{1.58 t\\left(p_{c}+p_{r}+g p_{g}\\right)}{1000}`

class TrackerPage extends React.Component {


  render() {

    const firstRowStyle = {height: "450px", marginTop: "2%", marginLeft: "2.5%", marginRight: '2.5%'}
    return (
        <div className="split-container">
          <div id="col-1">


            <Grid container>

                <Grid item xs>
                    <Paper style={{marginLeft: "2.5%", marginRight: '2.5%', marginTop: "2%", marginBottom: '2%'}}>
                        <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
                          Emissions Calculation
                        </Typography>
                        <Divider variant="middle" />
                    <div style={{paddingTop: "1%"}}>
                      <TeX block>{tex}</TeX>
                    </div>
                    <div style={{padding: "2%"}}>
                      <TeX block>{"\\mathrm{CO}_{2} \\mathrm{e}=0.954 p_{t}"}</TeX>
                    </div>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container>

              <Grid item xs>
                <SampleGraph />
              </Grid>
            </Grid>
          </div>

          <div id="col-2">

            <Grid container>
                {/* <Grid item xs>
                </Grid> */}
                <Grid item xs>
                    <Paper style={firstRowStyle}>
                        <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
                          Region
                        </Typography>
                        <Divider variant="middle" />
                        <USMap />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container>
              {/* <Grid item xs>
              </Grid> */}
              <Grid item xs>
                <Paper style={{marginLeft: "2.5%", marginRight: '2.5%', marginTop: "2%", marginBottom: '2%'}}>
                  <div>
                    <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
                      Add Hardware
                    </Typography>
                    <Divider variant="middle" />
                    <HardwareAutoComplete />
                    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
                      Detected Hardware
                    </Typography>
                    <Divider variant="middle" />
                    <List dense={true}>
                      <HardwareItem 
                        hardwareType={"CPU"} 
                        hardwareName={"Intel i7 2600K"} 
                        quantity={5} 
                      />
                      <HardwareItem 
                        hardwareType={"CPU"} 
                        hardwareName={"Intel i5 3500K"} 
                        quantity={2} 
                      />
                      <HardwareItem 
                        hardwareType={"GPU"} 
                        hardwareName={"NVIDIA RTX 2080 Ti"} 
                        quantity={2} 
                      />
                      <HardwareItem 
                        hardwareType={"GPU"} 
                        hardwareName={"NVIDIA V100"} 
                        quantity={2} 
                      />
                    </List>

                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
        // <div style={{flexGrow: 1}}>

          

        // </div>

        // <USMap />
    );
  }
}

export default TrackerPage