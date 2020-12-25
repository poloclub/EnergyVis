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

import NRELData from '../../NRELData.json'

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
        <Typography style={{paddingLeft: '16px', paddingTop: '3%'}} variant="h6" gutterBottom>
          Calculating Your Emissions
        </Typography>
        <Divider variant="middle" />

        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          style={{width: '100%'}}
        >
          <ListItem button onClick={() => this.handleClick("eq1")}>
            {/* <ListItemIcon>
              <InboxIcon />
            </ListItemIcon> */}
            <ListItemText>
              <BlockMath>{String.raw`\bm{y = \textcolor{${colors[0]}}{p_{i}} = (\textcolor{${colors[3]}}{p_{chipset}} + \textcolor{${colors[2]}}{\sum_{g=1}^{G} p_{g}} \thinspace ) \cdot \textcolor{${colors[6]}}{${TrackerStore.initialPUE}} \hspace{3pt}} [=] \hspace{3pt} \text{watts}`}</BlockMath>
            </ListItemText>
            {this.state["eq1"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state["eq1"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText>
                  <Typography variant="body1">
                    First, we take measurements of <span style={{fontWeight: 600, color: colors[0]}}>instantaneous power usage</span>, in watts, from our hardware at a fixed interval (10s).
                    Instantaneous power measurments are the sum of of our <span style={{fontWeight: 600, color: colors[3]}}>chipset (CPU and DRAM)</span> and <span style={{fontWeight: 600, color: colors[2]}}>our graphics cards</span>.
                    Finally, we multiply by a <span style={{fontWeight: 600, color: colors[6]}}>PUE coefficient</span>: this factor adjusts for electricity used by other infrastructure, like cooling and lighting at a datacenter.
                    We use a default value of 1.53, from et al.
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
              <BlockMath>{String.raw`\bm{x = \textcolor{${colors[5]}}{\overline{p_{epoch}}} = \frac{\textcolor{${colors[7]}}{\sum_{i=1}^{I}} \textcolor{${colors[0]}}{p_{i}}}{\textcolor{${colors[7]}}{I}} \cdot \frac{t_{epoch}}{1000}} \hspace{3pt} [=] \hspace{3pt} \text{kilo-watt hours}`}</BlockMath>
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
              <BlockMath>{String.raw`\bm{z = \textcolor{${colors[1]}}{\mathrm{CO}_{2} \mathrm{e}}= \textcolor{${colors[4]}}{${NRELData[(TrackerStore.hoveredState || TrackerStore.initialState)]["co2_lb_kwh"].toFixed(2)}} \cdot \textcolor{${colors[5]}}{\overline{p_{epoch}}}} \hspace{3pt} [=] \hspace{3pt} \text{pounds}`}</BlockMath>
            </ListItemText>
            {this.state["eq3"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state["eq3"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText>
                <Typography style={{paddingBottom: '2%'}} variant="body1">
                  Finally, to convert to <span style={{fontWeight: 600, color: colors[1]}}>CO<sub>2</sub> emissions</span>, we multiply <span style={{fontWeight: 600, color: colors[5]}}>power consumed during an epoch</span> by a <span style={{fontWeight: 600, color: colors[4]}}>state-wide coefficient for lb of CO<sub>2</sub></span> produced per kilowatt hour consumed. 
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