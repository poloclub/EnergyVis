import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HttpIcon from '@material-ui/icons/Http';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ToggleButton from '@material-ui/lab/ToggleButton';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import LinkIcon from '@material-ui/icons/Link';

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import { MODEL_DATA } from '../../consts/consts'

import { observer } from "mobx-react"
import TrackerStore from '../../stores/TrackerStore'
import { withStyles } from '@material-ui/core/styles';

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: '8px',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    }
  }
}))(ToggleButtonGroup);


const getButtonStyling = (idx, alternativeIdx, modelIdx) => {
  const styling = {
    textTransform: 'none', display: 'block', textAlign: 'center', 
    color: idx == modelIdx ? 'white' : '#673ab7',
    backgroundColor: idx == modelIdx ? '#673ab7' : 'white',
    border: idx == alternativeIdx ? '2px dashed rgb(245, 176, 66)' : '1px solid #673ab7'
  }
  return styling
}

@observer
class DataSourceView extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      view: 'loaded',
    }
  }

  handleChange(event, nextView) {
    this.setState({ view: nextView })
  };

  render() {
    return (
      
      <Grid style={{paddingLeft: '12px', width: 'calc(100% + 8px)'}} justify="space-between" container spacing={2}>
        <Grid item style={{paddingBottom: '1px'}} xs={12}>
          <span style={{color: '#3b444b'}}>Energy Profiles</span>
        </Grid>
        <Grid xs={8} item style={{padding: '0px'}}>

        {this.state.view != 'link' && <StyledToggleButtonGroup
          size="small"
          value={TrackerStore.modelIdx}
          exclusive
          onChange={(event, newPaper) => { TrackerStore.setModelSource(newPaper) }}
          aria-label="text alignment"
        >
        {this.state.view != 'link' && MODEL_DATA.map((value, idx) => (

          <ToggleButton style={getButtonStyling(idx, TrackerStore.alternativeModelIdx, TrackerStore.modelIdx)}
              onContextMenu={(e) => {
                if (e.type === 'contextmenu') {
                  e.preventDefault();
                  TrackerStore.setAlternativeModel(idx)
                }
              }}
              value={idx}>
            {/* <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
              { value.author }
            </Typography> */}
            <Typography variant="h5" component="h2">
              { value.name }
            </Typography>
          </ToggleButton>
        ))}
        </StyledToggleButtonGroup> }

        { this.state.view == 'link' &&
          <Grid container>
            <Grid item style={{marginRight: '8px', marginTop: '8px', marginLeft: '8px'}} xs={7}>
              <TextField
                style={{width: '100%'}}
                id="outlined-helperText"
                label="Enter Live Energy Profile URL"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                style={{height: 'calc(100% - 8px)', marginTop: '8px'}}
                startIcon={<GetAppIcon />}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        }

        { this.state.view != 'link' && 
          <div style={{display: 'inline'}}>
            <input
              accept=".json"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="raised" 
              style={{height: "calc(100% - 16px)", marginBottom: '8px'}} 
              startIcon={<PublishIcon />} 
              variant="outlined"
              color="primary"
              component="span">
                Import
              </Button>
            </label> 
          </div>
        }


        </Grid>

        <Grid item>
          <ToggleButtonGroup style={{backgroundColor: 'white'}} value={this.state.view} exclusive onChange={this.handleChange.bind(this)}>
            <ToggleButton value="link" aria-label="module">
              <LinkIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    ); 
  }

}

export default DataSourceView;