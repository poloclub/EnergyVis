import React from 'react';
import List from '@material-ui/core/List';
import HardwareItem from './HardwareItem'
import HardwareAutoComplete from './HardwareAutoComplete'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'

function union(setA, setB) {
  let _union = new Set(setA)
  for (let elem of setB) {
      _union.add(elem)
  }
  return _union
}

// TODO: better way to do this...
const jointMap = (original, alternative) => {
  const joint = {}
  const originalKeys = new Set(Object.keys(original))
  const alternativeKeys = new Set(Object.keys(alternative))
  const allKeys = union(originalKeys, alternativeKeys)
  for (var k of allKeys) {
    joint[k] = {original: original[k], alternative: alternative[k]} 
  }
  return joint
}


@observer
class HardwareView extends React.PureComponent {
  render () {
    let cpuMap = {}
    let gpuMap = {}
    
    if (TrackerStore.initialComponents) {
      cpuMap = jointMap(TrackerStore.startComponents["cpu"], TrackerStore.initialComponents["cpu"]);
      gpuMap = jointMap(TrackerStore.startComponents["gpu"], TrackerStore.initialComponents["gpu"]);
    }

    console.log("RENDERING")

    return (<div>
      {/* <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
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
      </div> */}
  
      <Typography style={{paddingTop: '2%', paddingLeft: '16px'}} variant="h6" gutterBottom>
          Your Hardware
      </Typography>
  
      <Divider variant="middle" />
      <List dense={true}>
        {TrackerStore.initialComponents && 
          Object.keys(cpuMap).map((component, i) => 
          <HardwareItem 
          hardwareType={"CPU"} 
          key={i}
          hardwareName={component} 
          quantity={cpuMap[component].alternative} 
          original={cpuMap[component].original}
          updateQuantityHandler={(val) => {
            // props.updateQuantityHandler("cpu", component, val)
            TrackerStore.updateHardware("cpu", component, val)
          }}
          />
        )}
  
        {TrackerStore.initialComponents && 
          Object.keys(gpuMap).map((component, i) => 
          <HardwareItem 
          hardwareType={"GPU"} 
          key={i}
          hardwareName={component} 
          quantity={gpuMap[component].alternative} 
          original={gpuMap[component].original}
          updateQuantityHandler={(val) => {
            // props.updateQuantityHandler("gpu", component, val)
            TrackerStore.updateHardware("gpu", component, val)
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
  }
}

export default HardwareView