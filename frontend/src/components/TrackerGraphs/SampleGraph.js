
/*global d3*/

import React from 'react';
import { Line } from 'react-chartjs-2';
import { SERVER_URI, MODEL_DATA } from '../../consts/consts' 
import NRELData from '../../NRELData.json' 

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

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'

const labelGenerator = (length, interval) => {
  const arr = []
  for (var i = 0; i < length; i++) {
    arr.push(i * interval)
  }
  return arr;
}

// TODO: Move a lot of this to another utils.js file, import from there.

const co2Converter = (PUE, co2Factor, graphType) => graphType == 0 ? (kwh) => kwh * PUE * co2Factor : x => x;
const cumulativeMap = (start, cumulative) => cumulative ? (sum => value => sum += value)(start) : x => x

const sumDatasetEnergy = (serverData, graphKey, cumulative) => {
  let mappedCpu = serverData["cpu"][graphKey]
    .map(cumulativeMap(0, cumulative))

  let mappedGpu = serverData["gpu"][graphKey]
    .map(cumulativeMap(0, cumulative))

  return mappedGpu.map(function (num, idx) {
    return num + mappedCpu[idx];
  })
}


const extrapolator = (data, extrapolation) => {
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

const getDataScaffold = (modelIdx, alternativeIdx, graphType, intervalType, 
                        PUE, hoveredState, cumulative, extrapolation) => {

  const emptyGraph =  {"data": {}, "options": {}}
  if (!Number.isFinite(modelIdx)) return emptyGraph;
  const serverData = MODEL_DATA[modelIdx].serverData;
  if (!serverData) return emptyGraph;
  if (!extrapolation) extrapolation = 0;

  const originalCo2Converter = 
    co2Converter(TrackerStore.startPUE, NRELData[TrackerStore.initialState]["co2_lb_kwh"], graphType)

  const plotAlternatives = hoveredState || Number.isFinite(alternativeIdx);

  const alternativeConverter = 
    plotAlternatives && co2Converter(TrackerStore.startPUE, NRELData[TrackerStore.hoveredState]["co2_lb_kwh"], graphType)
  
  const graphKey = intervalType == 0 ? "interval" : "epoch"
  let labels = labelGenerator(serverData["cpu"][graphKey].length + extrapolation, graphKey == "epoch" ? 1 : 10);

  let originalSummedEnergy = sumDatasetEnergy(serverData, graphKey, cumulative);
  let alternativeSummedEnergy = Number.isFinite(alternativeIdx) ? 
    sumDatasetEnergy(MODEL_DATA[alternativeIdx].serverData, graphKey, cumulative) : originalSummedEnergy;

  let datasets = [
    {
      label: 'Consumption ' + (graphType == 0 ? '(CO2)' : '(kWH)'),
      data: originalSummedEnergy.map(originalCo2Converter),
      fill: false,
      backgroundColor: graphType == 0 ? 'rgb(45, 177, 93)' : 'rgb(255, 99, 132)',
      borderColor: graphType == 0 ? 'rgba(45, 177, 93, 0.5)' : 'rgba(255, 99, 132, 0.5)',
      pointRadius: 1.5,
      yAxisID: 'y-axis-1',
    },
  ]

  if (plotAlternatives) {
    datasets.push(
      {
        label: 'Alternative Consumption',
        data: alternativeSummedEnergy.map(alternativeConverter),
        fill: false,
        backgroundColor: 'rgb(245, 176, 66)',
        borderColor: 'rgba(245, 176, 66, 0.5)',
        pointRadius: 1.5,
        yAxisID: 'y-axis-1',
      }
    )
  }

  if (extrapolation) {
    datasets.push(
      {
        label: 'Extrapolated Consumption',
        data: extrapolator(originalSummedEnergy.map(originalCo2Converter), extrapolation),
        borderDash: [10,5],
        fill: false,
        backgroundColor: graphType == 0 ? 'rgb(45, 177, 93)' : 'rgb(255, 99, 132)',
        borderColor: graphType == 0 ? 'rgba(45, 177, 93, 0.5)' : 'rgba(255, 99, 132, 0.5)',
        pointRadius: 1.5,
        yAxisID: 'y-axis-1',
      }
    )

    
    if (plotAlternatives) {
      datasets.push(
        {
          label: 'Extrapolated Alternative Consumption',
          data: extrapolator(alternativeSummedEnergy.map(alternativeConverter), extrapolation),
          borderDash: [10,5],
          fill: false,
          backgroundColor: 'rgb(245, 176, 66)',
          borderColor: 'rgba(245, 176, 66, 0.5)',
          pointRadius: 1.5,
          yAxisID: 'y-axis-1',
        }
      )
    }
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

@observer
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
    const dataScaffold = getDataScaffold(TrackerStore.modelIdx, TrackerStore.alternativeModelIdx,
      this.state.graphType, this.state.intervalType, TrackerStore.initialPUE, 
      TrackerStore.hoveredState, 
      this.state.cumulative, this.state.sliderVal)
    
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

              <Slider
                min={0}
                max={this.state.sliderMax}
                value={this.state.sliderVal}
                onChange={(e, val) => { this.setState({sliderVal: val}) }}
                onChangeCommitted={(e, val) => { this.setState({sliderMax: val * 2 + 20}) }}
                valueLabelDisplay="auto"
              />
             
               {/* <div style={{paddingTop: "5px", display: "flex", justifyContent: "center"}}>
                <Pagination renderItem={(item) => { 
                  item.page--;
                  return <PaginationItem {...item} />
                }} page={this.state.sliderVal + 1} count={this.state.sliderMax} 
                onChange={(e, val) => { this.setState({sliderVal: val - 1, sliderMax: val * 2 + 20}) }}
                size="large" showFirstButton showLastButton />
               </div> */}


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

