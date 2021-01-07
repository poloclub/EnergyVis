import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';

import NRELData from '../../NRELData.json'

const upDownStyles = {
  display: "inline-block",
  fontSize: "6px",
  lineHeight: "6px",
  verticalAlign: "middle",
  paddingLeft: '3.5px'
}

const colors = ["#7200ac", "#2db15d", "#fb001d", "#126ed5", "#ffa06d", "#db4e9e", "#00A5CF", "#926C4F", "#596157"]
/*global katex*/

@observer
class ExplainableEquation extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      "eq1": false,
      "eq2": false,
      "eq3": false
    }
  }

  handleClick (key) {
    this.setState({ [key]: !this.state[key] })
  }

  render() {
    return (
      <div>
        <Typography style={{paddingLeft: '16px', paddingTop: '1%'}} variant="h6" gutterBottom>
          How Your CO<sub>2</sub> Emissions are Calculated
        </Typography>
        <Divider variant="middle" />

        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          style={{width: '100%'}}
        >
          <ListItem button onClick={() => this.handleClick("eq1")}>
          <ListItemText>
              1. Total Instantaneous Power
            </ListItemText>
            <ListItemText>
              <BlockMath>{String.raw`\textcolor{${colors[0]}}{p_{i}} = (\textcolor{${colors[3]}}{p_{chipset}} + \textcolor{${colors[2]}}{\sum_{g=1}^{G} p_{g}} \thinspace ) \cdot \textcolor{${colors[6]}}{${TrackerStore.initialPUE.toFixed(2)}} \hspace{3pt}`}</BlockMath>
            </ListItemText>
            {this.state["eq1"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state["eq1"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText>
                  <Typography variant="body1">
                    {/* First, we take measurements of <span style={{fontWeight: 600, color: colors[0]}}>instantaneous power usage</span>, in watts, from our hardware at a fixed interval (10s).
                    <span style={{fontWeight: 600, color: colors[0]}}> These measurments</span> are the sum of of our <span style={{fontWeight: 600, color: colors[3]}}>chipset (CPU and DRAM)</span> and <span style={{fontWeight: 600, color: colors[2]}}>our graphics card</span> instantaneous power usages.
                    Then, we multiply by a <span style={{fontWeight: 600, color: colors[6]}}>PUE coefficient</span>: this factor adjusts for electricity used by other infrastructure, like cooling and lighting at a datacenter.
                    We use a <span style={{fontWeight: 600, color: colors[6]}}>default value of 1.59</span> from The Uptime Institute Annual Data Center Survey (Ascierto, 2020). */}

                    Every 10 seconds, the <span style={{fontWeight: 600, color: colors[0]}}>total instantaneous power usage p<sub>i</sub></span>, in watts, is computed as the sum of those of your 
                    <span style={{fontWeight: 600, color: colors[3]}}> chipset p<sub>chipset</sub></span> (CPU and DRAM) and <span style={{fontWeight: 600, color: colors[2]}}>graphics cards p<sub>g</sub></span>, multiplied by <span style={{fontWeight: 600, color: colors[6]}}>a PUE coefficient 
                    (default value at<div style={upDownStyles}>
                      <IconButton 
                      onClick={() => {
                        TrackerStore.setPUE(TrackerStore.initialPUE + .01)
                      }}
                      style={{padding: '0', width: '12px', height: '12px'}}>
                        <ArrowDropUpIcon  />
                      </IconButton>
                      <br />
                      <IconButton onClick={() => {
                          TrackerStore.setPUE(TrackerStore.initialPUE - .01)
                        }} 
                        style={{padding: '0', width: '12px', height: '12px'}} >
                        <ArrowDropDownIcon />
                      </IconButton>
                      </div> <u contentEditable="true">{TrackerStore.initialPUE.toFixed(2)}</u> [Ascierto 2020])</span> that adjusts for electricity used by other resources like cooling and lighting.

                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => this.handleClick("eq2")}>
            {/* <ListItemIcon>
              <InboxIcon />
            </ListItemIcon> */}
            <ListItemText>
              2. Epoch Power Consumption
            </ListItemText>
            <ListItemText>
              <BlockMath>{String.raw`\textcolor{${colors[5]}}{\overline{p_{epoch}}} = \frac{\textcolor{${colors[7]}}{\sum_{i=1}^{I}} \textcolor{${colors[0]}}{p_{i}}}{\textcolor{${colors[7]}}{I}} \cdot \frac{t_{epoch}}{1000}`}</BlockMath>
            </ListItemText>
            {this.state["eq2"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state["eq2"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText>
                <Typography variant="body1">
                  To find the <span style={{fontWeight: 600, color: colors[5]}}>power consumed over an epoch</span> in kilowatt hours, 
                  we take the <span style={{fontWeight: 600, color: colors[7]}}>average of all</span> our <span style={{fontWeight: 600, color: colors[0]}}>instantaneous measurements </span> 
                  during this epoch, multiply by the <span style={{fontWeight: 600}}>duration of the epoch in hours</span>, and divide by <span style={{fontWeight: 600}}>1000</span>.
                </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => this.handleClick("eq3")}>
            <ListItemText>
              3. CO<sub>2</sub> Emissions
            </ListItemText>
            <ListItemText>
              <BlockMath>{String.raw`\textcolor{${colors[1]}}{\mathrm{CO}_{2} \mathrm{e}}= \textcolor{${colors[4]}}{${NRELData[(TrackerStore.hoveredState || TrackerStore.initialState)]["co2_lb_kwh"].toFixed(2)}} \cdot \textcolor{${colors[5]}}{\overline{p_{epoch}}}`}</BlockMath>
            </ListItemText>
            {this.state["eq3"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state["eq3"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText>
                <Typography style={{paddingBottom: '2%'}} variant="body1">
                  Finally, to convert to <span style={{fontWeight: 600, color: colors[1]}}>CO<sub>2</sub> emissions</span>, in pounds, we multiply <span style={{fontWeight: 600, color: colors[5]}}>power consumed during an epoch</span> by a <span style={{fontWeight: 600, color: colors[4]}}>state-wide coefficient for lb of CO<sub>2</sub></span> produced per kilowatt hour consumed. 
                  This coefficient is provided by projections from NREL. 
                </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    );    
  }

}

export default ExplainableEquation;