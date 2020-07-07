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
  TableCell
} from '@material-ui/core'
import axios from 'axios'

const WorkoutSummary = () => {
  const [sets, setSets] = useState([])
  // date is a string in YYYY-MM-DD format
  // default date is today's date (will need to change this based on calendar selection)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

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

  return (
    <div>
      <Typography variant="h2">Workout Summary</Typography>
      <Typography variant="h4">{date}</Typography>
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
                            <TableCell align="right">{set.reps}</TableCell>
                            <TableCell align="right">{set.weight}</TableCell>
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
