import React from 'react'

const WorkoutContext = React.createContext({
  workoutStatus: {},
  setWorkoutStatus: () => {}
})

export default WorkoutContext
