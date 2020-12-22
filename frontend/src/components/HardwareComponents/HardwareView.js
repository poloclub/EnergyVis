import React from 'react';
import List from '@material-ui/core/List';
import HardwareItem from './HardwareItem'
import HardwareAutoComplete from './HardwareAutoComplete'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

export default function HardwareView(props) {
  return (<div>

    <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
      Your PUE Coefficient
    </Typography>
    <Divider variant="middle" />

    <div style={{padding: '2.5%'}}>
      <TextField
        id="outlined-number"
        label="Number"
        type="number"
        style={{width: '100%'}}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        value={props.initialPUE}
        onChange={props.updatePUEHandler}
      />
    </div>

    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
        Your Hardware
    </Typography>

    <Divider variant="middle" />
    <List dense={true}>
      {props.components && Object.keys(props.components["cpu"]).map((component, i) => 
        <HardwareItem 
        hardwareType={"CPU"} 
        key={i}
        hardwareName={component} 
        quantity={props.components["cpu"][component]} 
        updateQuantityHandler={(val) => {props.updateQuantityHandler("cpu", component, val)}}
        />
      )}

      {props.components && Object.keys(props.components["gpu"]).map((component, i) => 
        <HardwareItem 
        hardwareType={"GPU"} 
        key={i}
        hardwareName={component} 
        quantity={props.components["gpu"][component]} 
        updateQuantityHandler={(val) => {props.updateQuantityHandler("gpu", component, val)}}
        />
      )}
    </List>
    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
        Add Alternative Hardware
    </Typography>
    <Divider variant="middle" />
    <div style={{paddingBottom: '1%'}}><HardwareAutoComplete /></div>
  </div>)
}
