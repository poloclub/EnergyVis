
/*global d3*/

import React from 'react';
import { Line } from 'react-chartjs-2';
import { SERVER_URI } from '../../consts/consts' 
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const labelGenerator = (length, interval) => {
  const arr = []
  for (var i = 0; i < length; i++) {
    arr.push(i * interval)
  }
  return arr;
}


const getDataScaffold = (serverData, graphType) => {

  if (!serverData) return {"data": {}, "options": {}};
  // debugger;
  const graphKey = graphType == 0 ? "interval" : "epoch"
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
            labelString: 'Kilowatt Hours (kWH)'
          }        
        },
        // {
        //   type: 'linear',
        //   display: true,
        //   position: 'right',
        //   id: 'y-axis-2',
        //   gridLines: {
        //     drawOnArea: false,
        //   },
        // },
      ],
      xAxes: [ {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Interval (seconds)'
        },
      }]
    }
  }

  return {options, data}
}

class SampleGraph extends React.Component {

  constructor(props) {
    super();
    this.state = {
      serverData: null,
      graphType: 0
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
    this.setState({graphType: value})
  }

  render() {
    const dataScaffold = getDataScaffold(this.state.serverData, this.state.graphType)
    return (
      <div style={{marginLeft: '2.5%', marginRight: '2.5%'}}>
        <Paper square>
          <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
            Consumption Graph
          </Typography>
          <Divider variant="middle" />
          <Tabs
            value={this.state.graphType}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleGraphChange}
            centered
          >
            <Tab label="Interval" />
            <Tab label="Epoch" />
          </Tabs>

          <div style={{margin: '2.5%'}}>
            <Line data={dataScaffold["data"]} options={dataScaffold["options"]}/>
          </div>
        </Paper>
      </div>
    );
  }

}


export default SampleGraph

