import React from 'react'
import Camera from './Camera'
import {Grid} from '@material-ui/core'
import ExerciseLog from './ExerciseLog'

const StartWorkout = () => {
  return (
    <div>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Camera />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <ExerciseLog />
        </Grid>
      </Grid>
    </div>
  )
}

export default StartWorkout
