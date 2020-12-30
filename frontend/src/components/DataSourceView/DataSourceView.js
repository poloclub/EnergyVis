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


@observer
class DataSourceView extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      view: 'list',
    }
  }

  handleChange(event, nextView) {
    this.setState({ view: nextView })
  };

  render() {
    return (
      
      <Grid style={{width: 'calc(100% + 8px)'}} container justify="center" spacing={2}>
        <StyledToggleButtonGroup
          size="small"
          value={TrackerStore.modelIdx}
          exclusive
          onChange={(event, newPaper) => { TrackerStore.setModelSource(newPaper) }}
          aria-label="text alignment"
        >
        {this.state.view == 'list' && MODEL_DATA.map((value, idx) => (

          <ToggleButton style={{
              textTransform: 'none', display: 'block', textAlign: 'left', 
              border: idx == TrackerStore.alternativeModelIdx ? '2px dashed rgb(245, 176, 66)' : '1px solid rgba(0, 0, 0, 0.12)'
            }}
              onContextMenu={(e) => {
                if (e.type === 'contextmenu') {
                  e.preventDefault();
                  TrackerStore.setAlternativeModel(idx)
                }
              }}
              value={idx}>
            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
              { value.author }
            </Typography>
            <Typography variant="h5" component="h2">
              { value.name }
            </Typography>
          </ToggleButton>
        ))}
        </StyledToggleButtonGroup>

        { this.state.view == 'list' && 
          <Button
            variant="outlined"
            color="primary"
            type="file"
            style={{marginTop: '8px', marginBottom: '8px'}}
            startIcon={<PublishIcon />}
          >
            Import
          </Button>
        }

        { this.state.view != 'list' &&
          <Grid xs={8} item>
            <TextField
              style={{width: '100%'}}
              id="outlined-helperText"
              label="https://"
              helperText="Enter the training URL here!"
              variant="outlined"
            />
          </Grid>
        }

        { this.state.view != "list" && 
          <Button
            variant="outlined"
            color="primary"
            style={{marginTop: '8px', marginBottom: '8px'}}
            startIcon={<GetAppIcon />}
          >
            export
          </Button>
        }

        <Grid item>
          <ToggleButtonGroup style={{backgroundColor: 'white'}} orientation="vertical" value={this.state.view} exclusive onChange={this.handleChange.bind(this)}>
            <ToggleButton value="list" aria-label="list">
              <FindInPageIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <HttpIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    ); 
  }

}

export default DataSourceView;