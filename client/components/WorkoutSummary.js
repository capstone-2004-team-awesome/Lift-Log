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
  Button
} from '@material-ui/core'
import axios from 'axios'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import MuiAlert from '@material-ui/lab/Alert'
import AddExercise from './AddExercise'

const WorkoutSummary = props => {
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
    ? props.location.state.date.toISOString().slice(0, 10)
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

  const handleFormSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post(`/api/set`, {...newSet, date})
    } catch (error) {
      console.log('Error adding new set:', error)
    }
    setNewSet({
      exerciseName: '',
      reps: '',
      weight: ''
    })
  }

  const handleFormChange = e => {
    setNewSet({
      ...newSet,
      [e.target.name]: e.target.value
    })
    console.log('NEW SET', newSet)
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h2">Workout Summary</Typography>
              <Typography variant="h4">{date}</Typography>
              <TableContainer>
                <Typography variant="body1">
                  If exercise information was not logged correctly, use input
                  fields to modify.
                </Typography>
                <Typography variant="body1">
                  You can also add an exercise with the button below.
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Exercise</TableCell>
                      <TableCell align="right"># Of Reps</TableCell>
                      <TableCell align="right">Weight (lbs)</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {summary.length ? (
                      summary.map(set => {
                        return (
                          <TableRow key={set.id}>
                            <TableCell>{set.exercise.name}</TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                name="reps"
                                value={set.reps}
                                onChange={() => handleChange(event, set.id)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                name="weight"
                                value={set.weight}
                                onChange={() => handleChange(event, set.id)}
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
                      })
                    ) : (
                      <TableRow>
                        <TableCell>
                          <Typography variant="h5">{noWorkoutMsg}</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
                newSet={newSet}
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
