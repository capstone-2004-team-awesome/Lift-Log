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
  TextField
} from '@material-ui/core'
import axios from 'axios'

const WorkoutSummary = () => {
  const [sets, setSets] = useState([])
  // date is a string in YYYY-MM-DD format
  // default date is today's date (will need to change this based on calendar selection)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [updateMsg, setUpdateMsg] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {data} = await axios.get(`/api/set/${date}`)
        setSets(data)
      } catch (error) {
        console.log('error fetching sets on front end!')
      }
    }
    fetchProjects()
  }, [])

  const handleChange = async (event, setId) => {
    const updatedSets = sets.map(set => {
      if (setId === set.id) {
        return {...set, [event.target.name]: event.target.value}
      } else return set
    })
    setSets(updatedSets)
    await axios.put(`/api/set/${setId}`, {
      [event.target.name]: event.target.value
    })
    setUpdateMsg(`Updated ${event.target.name}!`)
  }

  return (
    <div>
      <Typography variant="h2">Workout Summary</Typography>
      <Typography variant="h4">{date}</Typography>
      <Typography variant="body1">
        {updateMsg
          ? updateMsg
          : 'If exercise information was not recorded correctly, use input fields to modify.'}
      </Typography>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Exercise Log</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exercise</TableCell>
                    <TableCell align="right"># Of Reps</TableCell>
                    <TableCell align="right">Weight (lbs)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sets.length
                    ? sets.map(set => {
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
                          </TableRow>
                        )
                      })
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </div>
  )
}

export default WorkoutSummary
