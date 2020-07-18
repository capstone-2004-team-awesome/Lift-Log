import React from 'react'
import {
  Grid,
  TextField,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  formControl: {
    [theme.breakpoints.up('md')]: {
      width: '15rem'
    },
    [theme.breakpoints.down('md')]: {
      width: '10rem'
    }
  }
}))

const AddExercise = props => {
  const classes = useStyles()
  const {exerciseName, reps, weight, handleFormChange, handleFormSubmit} = props

  return (
    <form onSubmit={handleFormSubmit} style={{paddingTop: '1rem'}}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <FormControl
            className={classes.formControl}
            variant="outlined"
            size="small"
          >
            <InputLabel>Exercise</InputLabel>
            <Select
              required
              id="exerciseName"
              name="exerciseName"
              key="exerciseName"
              value={exerciseName}
              onChange={handleFormChange}
            >
              <MenuItem value="">
                <em>Select Exercise</em>
              </MenuItem>
              <MenuItem value="Squat">Squat</MenuItem>
              <MenuItem value="Bicep Curl">Bicep Curl</MenuItem>
              <MenuItem value="Deadlift">Deadlift</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <FormControl className={classes.formControl}>
            <TextField
              required
              key="reps"
              type="number"
              inputProps={{min: 1}}
              id="reps"
              name="reps"
              label="Reps (#)"
              size="small"
              value={reps}
              onChange={handleFormChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <FormControl className={classes.formControl}>
            <TextField
              required
              key="weight"
              type="number"
              inputProps={{min: 0}}
              id="weight"
              name="weight"
              label="Weight (lbs)"
              size="small"
              value={weight}
              onChange={handleFormChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddExercise
