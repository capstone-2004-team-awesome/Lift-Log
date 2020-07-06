import React from 'react'
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

function createData(exercise, reps, weight) {
  return {exercise, reps, weight}
}

const rows = [createData('Squat', 10, 20), createData('Bicep Curl', 20, 10)]

const ExerciseLog = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Current Exercise: Bicep Curl</Typography>
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
                  {rows.map(row => {
                    return (
                      <TableRow key={row.exercise}>
                        <TableCell>{row.exercise}</TableCell>
                        <TableCell align="right">{row.reps}</TableCell>
                        <TableCell align="right">{row.weight}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ExerciseLog
