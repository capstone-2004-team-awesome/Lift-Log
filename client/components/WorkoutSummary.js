import React, {useEffect, useState} from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  TableCell,
  TextField,
  IconButton,
  Snackbar,
  Divider
} from '@material-ui/core'
import axios from 'axios'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import MuiAlert from '@material-ui/lab/Alert'
import AddExercise from './AddExercise'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    width: '5rem'
  },
  WorkoutSummaryTable: {
    paddingTop: '1rem'
  }
}))

const WorkoutSummary = props => {
  const classes = useStyles()

  const [summary, setSummary] = useState([])
  const [updateMsg, setUpdateMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [noWorkoutMsg, setNoWorkoutMsg] = useState('')
  const [newSet, setNewSet] = useState({
    exerciseName: '',
    reps: '',
    weight: ''
  })

  // checking to see if there is a state in props.location
  // this is how the UserHome component passes in date from the calendar selection
  const selectedDate = props.location.state
    ? props.location.state.selectedDate.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)
  // date is a string in YYYY-MM-DD format
  // default date is today's date (will need to change this based on calendar selection)
  const [date] = useState(selectedDate)

  useEffect(
    () => {
      const fetchProjects = async () => {
        try {
          const {data} = await axios.get(`/api/set/${date}`)
          if (!data.length) setNoWorkoutMsg('You did not work out on this day.')
          else setSummary(data)
        } catch (error) {
          console.log('error fetching sets on front end!', error)
        }
      }
      fetchProjects()
    },
    [date, newSet]
  )

  // Handling updates to logged exercises
  const handleChange = async (event, setId) => {
    const updatedSets = summary.map(set => {
      if (setId === set.id) {
        return {...set, [event.target.name]: event.target.value}
      } else return set
    })
    setSummary(updatedSets)
    await axios.put(`/api/set/${setId}`, {
      [event.target.name]: event.target.value
    })
    setUpdateMsg(`Updated ${event.target.name}!`)
    setOpen(true)
  }

  const handleDelete = async setId => {
    const updatedSets = summary.filter(set => set.id !== setId)
    setSummary(updatedSets)
    await axios.delete(`/api/set/${setId}`)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  // Form for adding a new exercise to the work out summary
  const handleFormSubmit = async event => {
    event.preventDefault()
    try {
      await axios.post(`/api/set`, {...newSet, date})
    } catch (error) {
      console.error('Error adding new set:', error)
    }
    setNewSet({
      exerciseName: '',
      reps: '',
      weight: ''
    })
  }

  const handleFormChange = event => {
    setNewSet({
      ...newSet,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h2">Workout Summary</Typography>
              <Typography variant="h4">{date}</Typography>
              <Divider component="h2" />

              {summary.length ? (
                <div className={classes.WorkoutSummaryTable}>
                  <Typography variant="body1">
                    If exercise information was not logged correctly, use input
                    fields to modify.
                  </Typography>
                  <Typography variant="body1">
                    You can also add an exercise with the button below.
                  </Typography>

                  <TableContainer className={classes.WorkoutSummaryTable}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Exercise</TableCell>
                          <TableCell align="right">Reps (#)</TableCell>
                          <TableCell align="right">Weight (lbs)</TableCell>
                          <TableCell align="right" />
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {summary.map(set => {
                          return (
                            <TableRow key={set.id}>
                              <TableCell>{set.exercise.name}</TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  name="reps"
                                  size="small"
                                  value={set.reps}
                                  onChange={() => handleChange(event, set.id)}
                                  className={classes.root}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  name="weight"
                                  size="small"
                                  value={set.weight}
                                  onChange={() => handleChange(event, set.id)}
                                  className={classes.root}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleDelete(set.id)}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                                <Snackbar
                                  anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                  }}
                                  open={open}
                                  autoHideDuration={2000}
                                  onClose={handleClose}
                                >
                                  <MuiAlert
                                    onClose={handleClose}
                                    severity="success"
                                    variant="filled"
                                  >
                                    {updateMsg}
                                  </MuiAlert>
                                </Snackbar>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : (
                <Typography variant="h5">{noWorkoutMsg}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Worked out without the camera? Add an exercise to your log
                manually.
              </Typography>
              <AddExercise
                {...newSet}
                handleFormSubmit={handleFormSubmit}
                handleFormChange={handleFormChange}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default WorkoutSummary
