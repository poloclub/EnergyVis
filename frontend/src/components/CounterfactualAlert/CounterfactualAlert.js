import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function CounterfactualAlert(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {props.handleClose(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Entering 'What-If' Mode"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You're trying to explore an alternative! This will change your carbon output and your projections, 
            so we're going to have to <b>pause your training.</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {props.handleClose(false)}} color="primary">
            No, don't do that
          </Button>
          <Button onClick={() => {props.handleClose(true)}} color="primary">
            Yes, pause my training
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}