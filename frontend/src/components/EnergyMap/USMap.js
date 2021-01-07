import React from 'react';
/*global d3*/
import './USMap.css';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import NRELData from '../../NRELData.json'

import { observer } from "mobx-react"
import { reaction } from "mobx"
import TrackerStore from '../../stores/TrackerStore'
import { SERVER_URI, MODEL_DATA } from '../../consts/consts'

let avg = 0;
for (var state in NRELData) {
  avg += NRELData[state]["co2_lb_kwh"]
}
avg /= Object.keys(NRELData).length

@observer
class USMap extends React.PureComponent {

  drawMap = (initialState) => {

    //Width and height of map
    // d3.select('#energymap').selectAll("*").remove();

    d3.selectAll('#energymap > *')
      .remove();

    var width = document.getElementById("energymap").offsetWidth;
    var height = 400;

    var lowColor = '#f9f9f9'
    var highColor = '#298A48'

    // good ol' js days
    var _this = this;

    // D3 Projection
    var projection = d3.geoAlbersUsa()
      .translate([width / 2 + 50, height / 2]) // translate to center of screen
      .scale([width]); // scale things down so see entire US

    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(projection); // tell path generator to use albersUsa projection

    //Create SVG element and append map to the SVG
    _this.svg = d3.select("#energymap")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    // TODO: change all references to point to _this.svg
    var svg = _this.svg

    function handleClick(d, i) {
      if (d['properties']['name'] == TrackerStore.initialState) return;
      svg.selectAll("path")
        .style("stroke", "#fff")
        .style("stroke-dasharray", "none")
        .style("stroke-width", "1")
      
      if (d["properties"]["name"] == _this.state.clicked) {
        _this.setState({clicked: null})
      } else {
        _this.setState({clicked: d["properties"]["name"]})
        if (!TrackerStore.counterfactualMode) TrackerStore.promptAlternativeMode();
      }

      d3.select(this)
        .style("stroke-width", "4")
        .style("stroke-dasharray", "5")
        .style("stroke", "#f5b042").raise()

      _this.initialStateSVG.style("stroke-width", "4")
        .style("stroke", "#f5b042").raise()

    }

    function handleMouseOver(d, i) {
      if (d['properties']['name'] == TrackerStore.initialState) return;
      d3.select(this)
        .style("stroke-width", "4")
        .style("stroke-dasharray", "5")
        .style("stroke", "#f5b042").raise()
      d3.select(this).style("cursor", "pointer"); 
      // _this.props.selectedStateHandler(NRELData[d['properties']['name']]["co2_lb_kwh"])
      // _this.setState({selectedState: d['properties']['name']})
      TrackerStore.setHoveredState(d['properties']['name'])
      _this.initialStateSVG.style("stroke-width", "4")
        .style("stroke", "#f5b042").raise()
    }

    function handleMouseOut(d, i) {
      if (d['properties']['name'] == TrackerStore.initialState) return;
      d3.select(this)
        .style("stroke-width", "1")
        .style("stroke-dasharray", "none")
        .style("stroke", "#fff")
      
      if (_this.state.clicked != null) {
        svg.selectAll("path").filter((d, local) => {
          return d["properties"]["name"] == _this.state.clicked
        }).style("stroke-width", "4")
          .style("stroke-dasharray", "5")
          .style("stroke", "#f5b042").raise()

        
      }

      TrackerStore.setHoveredState(_this.state.clicked)
      d3.select(this).style("cursor", "default"); 
      _this.initialStateSVG.style("stroke-width", "4")
        .style("stroke", "#f5b042").raise()

    }

    var dataArray = [];
    for (var k in NRELData) {
      dataArray.push(parseFloat(NRELData[k]["co2_lb_kwh"]))
    }

    var minVal = d3.min(dataArray)
    var maxVal = d3.max(dataArray)
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
    
    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", (json) => {

      // Loop through each state data value in the .csv file
      for (var dataState in NRELData) {

        // Grab data value 
        var dataValue = NRELData[dataState]["co2_lb_kwh"]

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;

          if (dataState == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.value = dataValue;

            // Stop looking through the JSON
            break;
          }
        }
      }

      // Bind the data to the SVG and create one path per GeoJSON feature
      svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) { return ramp(d.properties.value) })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)


      _this.initialStateSVG = svg.selectAll("path")
        .filter((d, local) => {
          return d["properties"]["name"] == TrackerStore.initialState
        }).style("stroke-width", (d) => {
          return "4"
        })
        .style("stroke", "#f5b042").raise()

      if (_this.state.clicked) {
        _this.svg.selectAll('path')
          .filter((d, local) => {
            return d["properties"]["name"] == _this.state.clicked
          })
          .style("stroke-width", "4")
          .style("stroke-dasharray", "5")
          .style("stroke", "#f5b042").raise()
      }

      // add a legend
      var w = 70, h = 200;
      d3.selectAll('#legend').remove();
      var key = d3.select("#energymap")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "legend");

      var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1);
        
      legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1);

      key.append("rect")
        .attr("width", 20)
        .attr("height", h)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,3)");

      var y = d3.scaleLinear()
        .range([h, 0])
        .domain([minVal, maxVal]);

      var yAxis = d3.axisRight(y);

      key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(21, 3)")
        .call(yAxis)

      key.attr("height", h + 20)
      
    });


  }

  constructor() {
    super();
    this.state = {
      clicked: null
    };
    this.initialStateSVG = null
    this.svg = null
  }

  resizeUpdate() {
    this.drawMap(TrackerStore.initialState)
  }

  componentDidMount() {
    this.drawMap(TrackerStore.initialState)
    window.addEventListener("resize", this.resizeUpdate.bind(this));
    
    reaction(
      () => TrackerStore.initialState,
      (newState) => {
        // this.drawMap(newState)
        this.svg.selectAll("path")
          .style("stroke", "#fff")
          .style("stroke-dasharray", "none")
          .style("stroke-width", "1")

        this.initialStateSVG = this.svg.selectAll("path")
        .filter((d, local) => {
          return d["properties"]["name"] == newState
        })

        this.initialStateSVG.style("stroke-width", "4")
          .style("stroke", "#f5b042").raise()

        this.setState({clicked: null})
      }
    )

    reaction(
      () => TrackerStore.alternativeModelIdx,
      (newIdx) => {
        // this.drawMap(newState)
        if (!this.svg) return;

        this.svg.selectAll("path")
          .filter((d, local) => d["properties"]["name"] != TrackerStore.initialState)
          .style("stroke", "#fff")
          .style("stroke-dasharray", "none")
          .style("stroke-width", "1")

        if (!Number.isFinite(newIdx)) return;

        this.svg.selectAll('path')
          .filter((d, local) => {
            return d["properties"]["name"] == MODEL_DATA[newIdx].location
          })
          .style("stroke-width", "4")
          .style("stroke-dasharray", "5")
          .style("stroke", "#f5b042").raise()

        this.setState({clicked: MODEL_DATA[newIdx].location})
        
      }
    )

    reaction(
      () => TrackerStore.counterfactualMode,
      (newMode) => {
        if (newMode) return
        if (this.svg) {
          this.svg.selectAll("path")
            .style("stroke", "#fff")
            .style("stroke-dasharray", "none")
            .style("stroke-width", "1")
        }
        if (this.initialStateSVG) {
          this.initialStateSVG
            .style("stroke-width", "4")
            .style("stroke", "#f5b042").raise()
        }

        TrackerStore.setHoveredState(null)
        this.setState({
          clicked: null,
        })         
      }
    )

    reaction(
      () => TrackerStore.counterfactualAlert,
      (newAlert, prevAlert) => {
        // must be in alert state
        if (!prevAlert) return;
        // the new alert must be dismissed, and the user must not be in counterfacutal mode
        if (newAlert || TrackerStore.counterfactualMode) return;
        if (this.svg) {
          this.svg.selectAll("path")
            .filter((d, local) => d["properties"]["name"] == this.state.clicked)
            .style("stroke", "#fff")
            .style("stroke-dasharray", "none")
            .style("stroke-width", "1")
        }
        if (this.initialStateSVG) {
          this.initialStateSVG
            .style("stroke-width", "4")
            .style("stroke", "#f5b042").raise()
        }
        TrackerStore.setHoveredState(null)
        this.setState({
          clicked: null,
          selectedState: null,
        })     
      }
    )
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeUpdate.bind(this));
    d3.select('#energymap').selectAll("*").remove();
  }

  render() {
    return (<div>
      <Grid container>
        <Grid item sm={6}>
          <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
            Your Region's Carbon to Energy Production
          </Typography>
        </Grid>
        {/* <Grid item sm={6}>
        <IconButton style={{float: "right", paddingRight: "16px"}} color="primary" component="span">
          <HelpOutlineIcon />
        </IconButton>
        </Grid> */}
      </Grid>
      <Divider variant="middle" />
      <Grid style={{paddingTop: '1%'}} container>
        <Grid item sm={6}>
        </Grid>
        <Grid item sm={6}>
        <div style={{float: "right", paddingRight: "16px"}}>
          {TrackerStore.hoveredState ? (TrackerStore.hoveredState + " - " + NRELData[TrackerStore.hoveredState]["co2_lb_kwh"].toFixed(2)) : "Alternative"} CO<sub>2</sub> lb / kWh 
        </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={6}>
          <FormLabel style={{paddingTop: '1%', paddingLeft: '16px'}} component="legend">CO<sub>2</sub> lb / kWh - lower is better</FormLabel>
        </Grid>
        <Grid item sm={6}>
        <div style={{float: "right", paddingRight: "16px"}}>
          {TrackerStore.initialState && (TrackerStore.initialState + " - " + NRELData[TrackerStore.initialState]["co2_lb_kwh"].toFixed(2))} CO<sub>2</sub> lb / kWh
        </div>
        </Grid>
      </Grid>
      <div id="energymap"></div>
    </div>)
  }
}

export default USMap
