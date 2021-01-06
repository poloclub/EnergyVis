/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function HardwareAutoComplete() {
  return (
    <Grid container>

        <Grid item xs={9}>

          <Autocomplete
            id="highlights-demo"
            options={top100Films}
            style={{paddingLeft: '16px', paddingRight: '16px', paddingTop: '0px'}}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Hardware" variant="outlined" margin="normal" />
            )}
            renderOption={(option, { inputValue }) => {
              const matches = match(option.title, inputValue);
              const parts = parse(option.title, matches);

              return (
                <div>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
              );
            }}
          />
        </Grid>
        <Grid item xs={3}>
          
          <Button color="primary" style={{marginTop: "16px",width: "90%", height: "68.5%"}} variant="contained">Add</Button>

        </Grid>
    </Grid>
    // <div>

    // </div>


  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

const curr_gpus = ["Titan RTX",
"RTX 2080 Ti",
"RTX 2080 Super",
"RTX 2080",
"RTX 2070 Super",
"RTX 2070",
"RTX 2060 Super",
"RTX 2060",
"GTX 1660 Ti",
"GTX 1660",
"GTX 1650"]

const top100Films  = curr_gpus.map((curr) => {
  return {title: curr, year: 2020}
})

