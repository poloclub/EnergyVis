import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import HttpIcon from '@material-ui/icons/Http';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';

const modelData = [
  {
    name: 'Transfomer Base',
    author: 'Vaswani et al. 2017'
  },
  {
    name: 'BERT base',
    author: 'Devlin et al. 2018'
  }
]

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
        {this.state.view == 'list' && modelData.map((value) => (
          <Grid item>
            {/* <Paper style={{height: 140, width: 100}} /> */}
            <Card style={{maxWidth: 275}}>
              <CardActionArea>
                <CardContent>
                  <Typography className={{fontSize: 14}} color="textSecondary" gutterBottom>
                    { value.author }
                  </Typography>
                  <Typography variant="h5" component="h2">
                    { value.name }
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

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


{/* <Card className={classes.root}>
<CardContent>
  <Typography className={classes.title} color="textSecondary" gutterBottom>
    Word of the Day
  </Typography>
  <Typography variant="h5" component="h2">
    be{bull}nev{bull}o{bull}lent
  </Typography>
  <Typography className={classes.pos} color="textSecondary">
    adjective
  </Typography>
  <Typography variant="body2" component="p">
    well meaning and kindly.
    <br />
    {'"a benevolent smile"'}
  </Typography>
</CardContent>
<CardActions>
  <Button size="small">Learn More</Button>
</CardActions>
</Card> */}

export default DataSourceView;