
/*global d3*/

import React from 'react';
import { Line } from 'react-chartjs-2';
import { SERVER_URI } from '../../consts/consts' 
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Switch from '@material-ui/core/Switch';

import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormLabel from '@material-ui/core/FormLabel';

import Timer10Icon from '@material-ui/icons/Timer10';
import TimelapseIcon from '@material-ui/icons/Timelapse';

const labelGenerator = (length, interval) => {
  const arr = []
  for (var i = 0; i < length; i++) {
    arr.push(i * interval)
  }
  return arr;
}


const getDataScaffold = (serverData, graphType, intervalType) => {

  if (!serverData) return {"data": {}, "options": {}};
  // debugger;
  const graphKey = intervalType == 0 ? "interval" : "epoch"
  let labels = labelGenerator(serverData["cpu"][graphKey].length, graphKey == "epoch" ? 1 : 10);

  const data = {
    labels,
    datasets: [
      {
        label: 'CPU and DRAM Consumption (kWH)',
        data: serverData["cpu"][graphKey],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1',
      },
      {
        label: 'GPU Consumption (kWH)',
        data: serverData["gpu"][graphKey],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y-axis-1',
      },
    ],
  }
  
  const options = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          scaleLabel: {
            display: true,
            labelString: graphType == 0 ? 'Carbon (CO2)' : 'Kilowatt Hours (kWH)'
          }        
        },
      ],
      xAxes: [ 
        {
          display: true,
          id: 'x-axis-1',
          scaleLabel: {
            display: true,
            labelString: intervalType == 0 ? 'Interval (seconds)' : 'Epoch'
          },
        },
    ]
    }
  }

  return {options, data}
}

class SampleGraph extends React.Component {

  constructor(props) {
    super();
    this.state = {
      serverData: null,
      graphType: 0,
      intervalType: 0,
      sliderMax: 100,
      sliderVal: 0
    };
    this.updateInterval = null;
  }
  
  fetchGraphData = () => {
    fetch(SERVER_URI + "energy-stats").then((response) => response.json())
      .then((data) => {
        this.setState({serverData: data})
      })
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.fetchGraphData, 5000);
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  handleGraphChange = (event, value) => {
    if (value != null) this.setState({graphType: value})
  }

  handleIntervalChange = (event, value) => {
    if (value != null) this.setState({intervalType: value})
  }

  render() {
    const dataScaffold = getDataScaffold(this.state.serverData, this.state.intervalType, this.state.graphType)

    return (
      <div>
          <Grid container>
            <Grid item sm={6}>
              <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
                Experiment Consumption Graph
              </Typography>
            </Grid>
            <Grid item sm={6}>
            <IconButton style={{float: "right", paddingRight: "16px"}} color="primary" component="span">
              <HelpOutlineIcon />
            </IconButton>
            </Grid>
          </Grid>

          <Divider variant="middle" />

          <div style={{margin: '2.5%'}}>
            <Line data={dataScaffold["data"]} options={dataScaffold["options"]}/>
          </div>


          <Grid style={{paddingLeft: "3%", paddingRight: "3%"}} container spacing={2}>
            <Grid item sm={12}>
              <FormLabel component="legend">Extrapolate consumption</FormLabel>

              <Slider
                min={0}
                max={this.state.sliderMax}
                value={this.state.sliderVal}
                onChange={(e, val) => { this.setState({sliderVal: val}) }}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item sm={4}>
              <div>
                <FormLabel style={{paddingBottom: '1.5%'}} component="legend">Measuring Unit (Y-Axis)</FormLabel>
                <ToggleButtonGroup
                  value={this.state.graphType}
                  exclusive
                  onChange={this.handleGraphChange}
                  size="small"
                >
                  <ToggleButton style={{textTransform: "none"}} value={0}>
                    <PublicOutlinedIcon />
                    <span style={{paddingLeft: '.2em'}}>Carbon (CO<sub>2</sub>)</span>
                  </ToggleButton>
                  <ToggleButton style={{textTransform: "none"}} value={1}>
                    <OfflineBoltOutlinedIcon />
                    <span style={{paddingLeft: '.2em'}}>Electricity (kWH)</span>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Grid>
            <Grid item sm={4}>
              <div>
                <FormLabel style={{paddingBottom: '1.5%'}} component="legend">Measuring Interval (X-Axis)</FormLabel>
                <ToggleButtonGroup
                  value={this.state.intervalType}
                  exclusive
                  onChange={this.handleIntervalChange}
                  size="small"
                >
                  <ToggleButton style={{textTransform: "none"}} value={0}>
                    <Timer10Icon />
                    <span style={{paddingLeft: '.2em'}}>Every 10s</span>
                  </ToggleButton>
                  <ToggleButton style={{textTransform: "none"}} value={1}>
                    <TimelapseIcon />
                    <span style={{paddingLeft: '.2em'}}>Every Epoch</span>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

            </Grid>
            <Grid item sm={4}>
              <div>
                <FormLabel style={{paddingBottom: '1.5%'}} component="legend">Cumulative Consumption</FormLabel>
                <Grid style={{paddingTop: "6%", paddingLeft: "13.5%"}} component="label" container alignItems="center" spacing={1}>
                  <Grid item>Off</Grid>
                  <Grid item>
                    <Switch name="checkedC" />
                  </Grid>
                  <Grid item>On</Grid>
                </Grid>
              </div>

            </Grid>
          </Grid>
      </div>
    );
  }

}


export default SampleGraph

