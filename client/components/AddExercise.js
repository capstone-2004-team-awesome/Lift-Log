import React, {useState, useEffect} from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  IconButton,
  Snackbar,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import axios from 'axios'

const useStyles = makeStyles(() => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 150,
    paddingLeft: '-1rem'
  }
}))

const AddExercise = props => {
  const classes = useStyles()
  const {newSet, handleFormChange, handleFormSubmit} = props
  const {exerciseName, reps, weight} = newSet

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel>Exercise</InputLabel>
            <Select
              id="exerciseName"
              name="exerciseName"
              value={exerciseName}
              onChange={handleFormChange}
            >
              <MenuItem value="">
                <em>Select Exercise</em>
              </MenuItem>
              <MenuItem value="Squat">Squat</MenuItem>
              <MenuItem value="Bicep Curl">Bicep Curl</MenuItem>
              <MenuItem value="Glute Bridge">Glute Bridge</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <TextField
              required
              type="number"
              id="reps"
              name="reps"
              label="# of Reps"
              value={reps}
              onChange={handleFormChange}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <TextField
              required
              type="number"
              id="weight"
              name="weight"
              label="Weight (lbs)"
              value={weight}
              onChange={handleFormChange}
            />
          </FormControl>
        </Grid>
        <Button type="submit">Submit</Button>
      </Grid>
    </form>
  )
}

export default AddExercise
