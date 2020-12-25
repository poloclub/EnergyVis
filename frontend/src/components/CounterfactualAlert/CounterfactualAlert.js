import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'

// import Button from '@material-ui/core/Button';

// handleClose={(enableCounterfactual) => {
//   this.setState({counterfactualAlert: false, counterfactualMode: enableCounterfactual})
//   if (enableCounterfactual == false) {
//     this.setState({initialComponents: JSON.parse(JSON.stringify(this.startComponents))})
//     // fetch(SERVER_URI + "pause?" + new URLSearchParams({status: "false"}))
//     //   .then((response) => response.json())
//     //   .then((data) => {
//     //   })
//   } else {
//     // fetch(SERVER_URI + "pause?" + new URLSearchParams({status: "true"}))
//     //   .then((response) => response.json())
//     //   .then((data) => {
//     //   })
//   }
// }}

export default observer(() => {
  return (
    <div>
      <Dialog
        open={TrackerStore.counterfactualAlert}
        onClose={() => { TrackerStore.resetTracker() }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Entering 'What-If' Mode"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You're trying to explore an alternative! This will change your carbon output and your projections.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { TrackerStore.resetTracker() }} color="primary">
            No, don't do that
          </Button>
          <Button onClick={() => { TrackerStore.enterAlternativeMode() }} color="primary">
            Yes, explore alternatives
          </Button>
        </DialogActions>
      </Dialog>
      { TrackerStore.counterfactualMode && <Alert
        style={{marginTop: '-8px', marginBottom: '5px'}}
        severity="info"
        action={
          <Button onClick={() => { TrackerStore.resetTracker() }} variant="contained" color="primary">
            Reset
          </Button>
        }
      > 
        Your training has been paused because you're exploring alternatives! Click reset to reset alternatives with default values.
      </Alert> }
    </div>
  );
})