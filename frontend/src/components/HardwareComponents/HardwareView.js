import React from 'react';
import List from '@material-ui/core/List';
import HardwareItem from './HardwareItem'
import HardwareAutoComplete from './HardwareAutoComplete'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'

export default observer(() => {
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
        value={TrackerStore.initialPUE}
        onChange={(event) => { 
          if (event.target.value >= 0) TrackerStore.setPUE(event.target.value)
        }}
      />
    </div>

    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
        Your Hardware
    </Typography>

    <Divider variant="middle" />
    <List dense={true}>
      {TrackerStore.initialComponents && 
        Object.keys(TrackerStore.initialComponents["cpu"]).map((component, i) => 
        <HardwareItem 
        hardwareType={"CPU"} 
        key={i}
        hardwareName={component} 
        quantity={TrackerStore.initialComponents["cpu"][component]} 
        updateQuantityHandler={(val) => {
          // props.updateQuantityHandler("cpu", component, val)
        }}
        />
      )}

      {TrackerStore.initialComponents && 
        Object.keys(TrackerStore.initialComponents["gpu"]).map((component, i) => 
        <HardwareItem 
        hardwareType={"GPU"} 
        key={i}
        hardwareName={component} 
        quantity={TrackerStore.initialComponents["gpu"][component]} 
        updateQuantityHandler={(val) => {
          // props.updateQuantityHandler("gpu", component, val)
        }}
        />
      )}
    </List>
    <Typography style={{paddingLeft: '16px'}} variant="h6" gutterBottom>
        Add Alternative Hardware
    </Typography>
    <Divider variant="middle" />
    <div style={{paddingBottom: '1%'}}><HardwareAutoComplete /></div>
  </div>)
})
