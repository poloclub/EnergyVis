import React from 'react';
import List from '@material-ui/core/List';
import HardwareItem from './HardwareItem'
import HardwareAutoComplete from './HardwareAutoComplete'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

export default function HardwareView(props) {
  return (<div>
    <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
        Your Detected Hardware
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
    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
        Add Undetected Hardware
    </Typography>
    <Divider variant="middle" />
    <div style={{paddingBottom: '1%'}}><HardwareAutoComplete /></div>
  </div>)
}
