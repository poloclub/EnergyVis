import React from 'react';
/*global d3*/
import './USMap.css';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';

class USMap extends React.Component {

  drawMap = () => {

    //Width and height of map
    // d3.select('#energymap').selectAll("*").remove();

    d3.selectAll('#energymap > *')
      .remove();

    var width = document.getElementById("energymap").offsetWidth;
    var height = 400;

    var lowColor = '#f9f9f9'
    var highColor = '#298A48'

    var clicked = null;

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
    var svg = d3.select("#energymap")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    function handleClick(d, i) {
      svg.selectAll("path")
        .style("stroke", "#fff")
        .style("stroke-width", "1")
      clicked = d["properties"]["name"] == clicked ? null : d["properties"]["name"]
      d3.select(this)
        .style("stroke-width", "3")
        .style("stroke", "#f5b042").raise()
    }

    function handleMouseOver(d, i) {
      d3.select(this)
        .style("stroke-width", "3")
        .style("stroke", "#f5b042").raise()
      d3.select(this).style("cursor", "pointer"); 
      _this.setState({selectedState: d['properties']['name'], selectedCoeff: parseFloat(d['properties']['value']).toFixed(2)})
    }

    function handleMouseOut(d, i) {
      d3.select(this)
        .style("stroke-width", "1")
        .style("stroke", "#fff")
      
      if (clicked != null) {
        svg.selectAll("path").filter((d, local) => {
          return d["properties"]["name"] == clicked
        }).style("stroke-width", "3")
          .style("stroke", "#f5b042").raise()
      }

      _this.setState({selectedState: clicked, selectedCoeff: parseFloat(d['properties']['value']).toFixed(2)})
      d3.select(this).style("cursor", "default"); 
    }

    // Load in my states data!
    d3.csv("statesdata.csv", function(data) {
      var dataArray = [];
      for (var d = 0; d < data.length; d++) {
        dataArray.push(parseFloat(data[d].value))
      }
      var minVal = d3.min(dataArray)
      var maxVal = d3.max(dataArray)
      var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
      
      // Load GeoJSON data and merge with states data
      d3.json("us-states.json", (json) => {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

          // Grab State Name
          var dataState = data[i].state;

          // Grab data value 
          var dataValue = data[i].value;

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
        

        // add a legend
        var w = 140, h = 200;
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
          .attr("width", w - 100)
          .attr("height", h)
          .style("fill", "url(#gradient)")
          .attr("transform", "translate(0,3)");

        var y = d3.scaleLinear()
          .range([h, 0])
          .domain([minVal, maxVal]);

        var yAxis = d3.axisRight(y);

        key.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(41,3)")
          .call(yAxis)
        
      });
    });
  }

  constructor(props) {
    super();
    this.state = {
      selectedState: null,
      selectedCoeff: null
    };
  }

  resizeUpdate() {
    // this.drawMap();
    this.drawMap()
  }

  componentDidMount() {
    this.drawMap()

    window.addEventListener("resize", this.resizeUpdate.bind(this));
    // this.drawMap();
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
            Your Region
          </Typography>
        </Grid>
        <Grid item sm={6}>
        <IconButton style={{float: "right", paddingRight: "16px"}} color="primary" component="span">
          <HelpOutlineIcon />
        </IconButton>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Grid style={{paddingTop: '1%'}} container>
        <Grid item sm={6}>
          <FormLabel style={{paddingTop: '1%', paddingLeft: '16px'}} component="legend">CO<sub>2</sub> lb / MWh - higher is worse</FormLabel>
        </Grid>
        <Grid item sm={6}>
        <div style={{float: "right", paddingRight: "16px"}}>
          {this.state.selectedState && (this.state.selectedState + " - " + this.state.selectedCoeff)} CO<sub>2</sub> lb / MWh 
        </div>
        </Grid>
      </Grid>
      <div id="energymap"></div>
    </div>)
  }
}

export default USMap