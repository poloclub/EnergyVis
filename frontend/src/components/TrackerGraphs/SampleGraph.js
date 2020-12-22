
/*global d3*/

import React from 'react';
import { Line } from 'react-chartjs-2';
import { SERVER_URI } from '../../consts/consts' 
import { linearRegression } from '../../utils/regression'
import Slider from '@material-ui/core/Slider';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

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


const getDataScaffold = (serverData, graphType, intervalType, cumulative, extrapolation) => {

  if (!serverData) return {"data": {}, "options": {}};

  if (!extrapolation) extrapolation = 0;

  const graphKey = intervalType == 0 ? "interval" : "epoch"
  let labels = labelGenerator(serverData["cpu"][graphKey].length + extrapolation, graphKey == "epoch" ? 1 : 10);
  let func = cumulative ? (sum => value => sum += value)(0) : x => x;

  let mappedCpu = serverData["cpu"][graphKey].map(func)
  let mappedGpu = serverData["gpu"][graphKey].map(func)

  let datasets = [
    {
      label: 'CPU and DRAM Consumption (kWH)',
      data: mappedCpu,
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.5)',
      pointRadius: 1.5,
      yAxisID: 'y-axis-1',
    },
    {
      label: 'GPU Consumption (kWH)',
      data: mappedGpu,
      fill: false,
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgba(54, 162, 235, 0.5)',
      pointRadius: 1.5,
      yAxisID: 'y-axis-1',
    },
  ]

  let extrapolator = (data, extrapolation) => {
    let regression = linearRegression(data)
    var extrapolated_data = []


    for (var i = 0; i < data.length - 1; i++) {
      extrapolated_data.push(null)
    }
    
    for (var i = data.length - 1; i < data.length + extrapolation; i++) {
      extrapolated_data.push(regression["slope"] * i + regression["intercept"])
    }

    return extrapolated_data
  }

  if (extrapolation) {
    datasets.push(
      {
        label: 'Extrapolated CPU Consumption',
        data: extrapolator(mappedCpu, extrapolation),
        borderDash: [10,5],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 1.5,
        yAxisID: 'y-axis-1',
      }
    )

    datasets.push(
      {
        label: 'Extrapolated GPU Consumption',
        data: extrapolator(mappedGpu, extrapolation),
        borderDash: [10,5],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.5)',
        pointRadius: 1.5,
        yAxisID: 'y-axis-1',
      },
    )

  }

  const data = {
    labels,
    datasets
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

class SampleGraph extends React.PureComponent {

  constructor(props) {
    super();
    this.state = {
      serverData: null,
      graphType: 0,
      intervalType: 1,
      sliderMax: 20,
      sliderVal: 0,
      cumulative: false
    };
    this.updateInterval = null;
  }
  
  fetchGraphData = () => {
    fetch(SERVER_URI + "energy-stats").then((response) => response.json())
      .then((data) => {
        this.setState({serverData: data})
        setTimeout(this.fetchGraphData, 5000);
      })
  }

  componentDidMount() {
    this.updateInterval = this.fetchGraphData();
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

  handleCumulativeSwitch = (event) => {
    this.setState({cumulative: event.target.checked})
  }

  render() {
    const dataScaffold = getDataScaffold(this.state.serverData, 
      this.state.graphType, this.state.intervalType, this.state.cumulative, this.state.sliderVal)
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
              <FormLabel component="legend">Extrapolated Points</FormLabel>

              {/* <Slider
                min={0}
                max={this.state.sliderMax}
                value={this.state.sliderVal}
                onChange={(e, val) => { this.setState({sliderVal: val}) }}
                onChangeCommitted={(e, val) => { this.setState({sliderMax: val * 2 + 20}) }}
                valueLabelDisplay="auto"
              /> */}
             
               <div style={{paddingTop: "5px", display: "flex", justifyContent: "center"}}>
                <Pagination renderItem={(item) => { 
                  item.page--;
                  return <PaginationItem {...item} />
                }} page={this.state.sliderVal + 1} count={this.state.sliderMax} 
                onChange={(e, val) => { this.setState({sliderVal: val - 1, sliderMax: val * 2 + 20}) }}
                size="large" showFirstButton showLastButton />
               </div>


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
            {/* <Grid item sm={4}>
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

            </Grid> */}
            <Grid item sm={4}>
              <div>
                <FormLabel style={{paddingBottom: '1.5%'}} component="legend">Cumulative Consumption</FormLabel>
                <Grid style={{paddingTop: "6%", paddingLeft: "13.5%"}} component="label" container alignItems="center" spacing={1}>
                  <Grid item>Off</Grid>
                  <Grid item>
                    <Switch checked={this.state.cumulative} onChange={this.handleCumulativeSwitch} name="checkedC" />
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

