import React from 'react'
import clsx from 'clsx'
import {
  TextField,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  InputAdornment
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  exerciseDropdown: {
    minWidth: 'calc(7rem + 4.7vw)',
    maxWidth: 'calc(7rem + 7vw)'
  },
  weightEntry: {
    minWidth: 'calc(3rem + 5vw)',
    maxWidth: 'calc(3rem + 7vw)'
  },
  repsEntry: {
    minWidth: 'calc(2.3rem + 4.5vw)',
    maxWidth: 'calc(3rem + 6vw)'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  }
}))

const AddExercise = props => {
  const classes = useStyles()
  const {newSet, handleFormChange, handleFormSubmit} = props
  const {exerciseName, reps, weight} = newSet

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{paddingTop: '1rem'}}
      className={classes.root}
    >
      <FormControl
        className={clsx(classes.exerciseDropdown, classes.margin)}
        variant="outlined"
        size="small"
      >
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
      <FormControl className={clsx(classes.repsEntry, classes.margin)}>
        <TextField
          required
          key={reps}
          type="number"
          id="reps"
          name="reps"
          label="Reps"
          InputLabelProps={{shrink: true}}
          size="small"
          value={reps}
          onChange={handleFormChange}
        />
      </FormControl>
      <FormControl
        className={clsx(classes.weightEntry, classes.margin, classes.textField)}
      >
        <TextField
          required
          key={weight}
          type="number"
          id="weight"
          name="weight"
          label="Weight"
          InputLabelProps={{shrink: true}}
          InputProps={{
            endAdornment: <InputAdornment position="end">lbs</InputAdornment>
          }}
          size="small"
          value={weight}
          onChange={handleFormChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" className={classes.margin}>
        Submit
      </Button>
    </form>
  )
}

export default AddExercise
