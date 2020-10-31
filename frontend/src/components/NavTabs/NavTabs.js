import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TrackerPage from '../TrackerPage/TrackerPage'

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function TabPanel(props) {
  const {children, value, index, classes, ...other} = props;

  return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>

            {children}

          </div>
        )}
      </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (!Number.isInteger(newValue)) return;
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Tracker" href="/tracker" {...a11yProps(0)} />
          <LinkTab label="Editor" href="/editor" {...a11yProps(1)} />
          <LinkTab label="About" href="/article" {...a11yProps(2)} />
          <FormControlLabel
            control={<Switch />}
            label="Counterfactual Mode"
          />
        </Tabs>


      </AppBar>
      <TabPanel value={value} index={0}>
          <TrackerPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Editor */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* About */}
      </TabPanel>
    </div>
  );
}