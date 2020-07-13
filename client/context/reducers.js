const initialState = {
  globalValues: {
    ctx: '',
    theUser: null,
    isWorkoutOver: false,
    isWorkoutStarted: false,
    isWorkoutPaused: false
  },
  sets: [],
  currentSet: {
    exerciseName: '',
    exerciseId: '',
    reps: 0,
    weight: 0,
    updatedAt: '',
    completed: false
  },
  predictionTracker: {
    'Bicep Curl': false,
    Squat: false
  }
}

const types = {
  UPDATE_PREDICTION_TRACKER: 'UPDATE_PREDICTION_TRACKER',
  UPDATED_SET: 'UPDATED_SET',
  CREATED_SET: 'CREATED_SET',
  COMPLETED_SET: 'COMPLETED_SET',
  INCREMENTED_REPS: 'INCREMENTED_REPS',
  UPDATE_WORKOUT_START: 'UPDATE_WORKOUT_START',
  UPDATE_WORKOUT_PAUSE: 'UPDATE_WORKOUT_PAUSE',
  UPDATE_WORKOUT_STATUS: 'UPDATE_WORKOUT_STATUS'
}

// *** The exercise predicted by the camera/model??
// const exercises = {
//     CURL: 'Bicep Curl',
//     SQUAT: 'Squat'
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PREDICTION_TRACKER: {
      console.log('In REDUCER => ', action.newPrediction)
      // state.predictionTracker = {...action.newPrediction}
      state = {
        ...state,
        predictionTracker: action.newPrediction,
        currentSet: {...state.currentSet, exerciseName: action.exercise}
      }

      return {...state}
    }
    case types.CREATED_SET: {
      console.log('Reducer INCOMING set: ', action.set)

      if (!state.currentSet.exerciseId) {
        state.currentSet = {...action.set}
        console.log('Reducer, 1st UPDATED set: ', state.currentSet)
      } else {
        // state.sets = [...state.sets, {...state.currentSet, completed: true}]
        // state.currentSet = {...set}
        state = {
          ...state,
          sets: [...state.sets, {...state.currentSet, completed: true}],
          currentSet: {...action.set}
        }
      }
      console.log('Reducer UPDATED set (on state): ', state.currentSet)
      return {...state}
    }
    case types.INCREMENTED_REPS: {
      // console.log('Reducer ACTION incrementedReps', state.currentSet.reps)
      // state.currentSet = {...state.currentSet, reps: state.currentSet.reps + 1}
      state.currentSet = {...state.currentSet, reps: action.reps}
      console.log('Reducer ACTION incrementedReps', state.currentSet.reps)

      return {...state}
    }

    // ? COMPLETED_SET ===> basically handled by CREATED_SET
    // case types.COMPLETED_SET: {
    //   state.sets = [...state.sets, {...state.currentSet, completed: true}]
    //   state.currentSet = {...action.latestSet}

    //   return {...state}
    // }
    // *** UPDATE_WORKOUT_START
    case types.UPDATE_WORKOUT_START: {
      //TODO: structure state update so there is a single re-render
      // state.globalValues.isWorkoutStarted = true
      // state.globalValues.isWorkoutPaused = false
      // state.globalValues.isWorkoutOver = false
      state.globalValues = {
        ...state.globalValues,
        isWorkoutStarted: true,
        isWorkoutPaused: false,
        isWorkoutOver: false
      }

      return {...state}
    }
    // *** UPDATE_WORKOUT_PAUSE
    case types.UPDATE_WORKOUT_PAUSE: {
      state.globalValues.isWorkoutPaused = !state.globalValues.isWorkoutPaused

      return {...state}
    }
    // *** UPDATE_WORKOUT_STATUS
    case types.UPDATE_WORKOUT_STATUS: {
      console.log(
        'Time to update workout status==>',
        state.globalValues.isWorkoutOver
      )
      state.globalValues.isWorkoutOver = action.newStatus
      console.log('Awesome Workout!!', state.globalValues.isWorkoutOver)

      return {...state}
    }
    default:
  }
}

export {initialState, types, reducer}
