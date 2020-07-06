import React from 'react'
import Camera from './Camera'
import {Grid} from '@material-ui/core'
import ExerciseLog from './ExerciseLog'

const StartWorkout = () => {
  return (
    <div>
      <Grid container spacing={4}>
        <Grid item sm={6}>
          <Camera />
        </Grid>
        <Grid item sm={6}>
          <ExerciseLog />
        </Grid>
      </Grid>
    </div>
  )
}

export default StartWorkout
