import React, {useState, useEffect, useContext} from 'react'
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

import {StoreContext} from '../context/StoreContext'
// import { types } from '../context/reducers'

const WorkoutLog = props => {
  // const {exerciseName, exerciseId, reps, weight, time} = props.currentSet
  // const {newPrediction} = props.prediction
  console.log('Current Exercise in LOG', props.latestExercise)
  console.log('Updated at ', Date.now())

  const {state, dispatch} = useContext(StoreContext)
  const {sets, currentSet} = state

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              Current Exercise: {props.latestExercise}
            </Typography>
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
                    <TableCell>Exercise</TableCell>
                    <TableCell align="right"># Of Reps</TableCell>
                    <TableCell align="right">Weight (lbs)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{currentSet.exerciseName}</TableCell>
                    <TableCell align="right">{currentSet.reps}</TableCell>
                    <TableCell align="right">{currentSet.weight}</TableCell>
                  </TableRow>
                  {/* {rows.map(row => {
                        return (
                        <TableRow key={row.exercise}>
                            <TableCell>{row.exercise}</TableCell>
                            <TableCell align="right">{row.reps}</TableCell>
                            <TableCell align="right">{row.weight}</TableCell>
                        </TableRow>
                        )
                    })} */}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default WorkoutLog
