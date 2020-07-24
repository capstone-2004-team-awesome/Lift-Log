import React, {useState, useEffect} from 'react'
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

const ExerciseLog = props => {
  const [log, setLog] = useState([])
  const {completedExercise, currentSet} = props

  useEffect(
    () => {
      setLog(exercises => [...exercises, completedExercise])
    },
    [completedExercise]
  )

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              Current Exercise: {currentSet.exerciseName}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Exercise</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6"># Of Reps</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Weight (lbs)</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">
                        {currentSet.exerciseName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{currentSet.reps}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{currentSet.weight}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Exercise Log</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Exercise</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6"># Of Reps</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Weight (lbs)</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {log.map(elem => {
                    return (
                      <TableRow key={elem.setId}>
                        <TableCell>
                          <Typography variant="h6">
                            {elem.exerciseName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">{elem.reps}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">{elem.weight}</Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          When doing squats or deadlifts, please make sure your whole body is in
          the camera view.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default ExerciseLog
