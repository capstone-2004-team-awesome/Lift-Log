// import {generateWorkoutLog} from '../utilities/workout'

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
  // UPDATE_PREDICTION_TRACKER: 'UPDATE_PREDICTION_TRACKER',
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
    // case types.UPDATE_PREDICTION_TRACKER: {
    //   console.log("In REDUCER => ", action.payload.howToUpdate)
    //   state.predictionTracker = {...action.payload}

    //   return { ...state }
    // }
    case types.CREATED_SET: {
      // const { set , setId } =  action.payload
      const set = action.updatedSet
      console.log('Reducer ACTION createdSet: ', set)
      state.currentSet = {...set}
      console.log('Reducer ACTION createdSet 2: ', state.currentSet)
      return {...state}
    }
    case types.INCREMENTED_REPS: {
      console.log('Reducer ACTION incrementedReps', state.currentSet.reps)
      // state.currentSet = {...state.currentSet, reps}
      state.currentSet = {...state.currentSet, reps: state.currentSet.reps + 1}

      return {...state}
    }
    // *** UPDATED_SET   (keep set up-to-date)
    // case types.UPDATED_SET: {
    //   const {somethingChanged} = action.payload
    // }
    //#region    OLD code
    // case types.MOVE_SNAKE: {
    // 	const { playerId, xVelocity: newXVelocity, yVelocity: newYVelocity, keepMoving, isBackWrapping } = action.payload
    // 	const updatePlayer = state.players[playerId]

    // 	if (!keepMoving && !isBackWrapping) {
    // 		updatePlayer.xVelocity = newXVelocity
    // 		updatePlayer.yVelocity = newYVelocity
    // 	}

    // 	const newTrails = generateSnakePosition({
    // 		currentLength: updatePlayer.length,
    // 		currentTrails: updatePlayer.trails,
    // 		currentXYVelocity: {
    // 			xVelocity: updatePlayer.xVelocity,
    // 			yVelocity: updatePlayer.yVelocity
    // 		}
    // 	})

    // 	state.players[playerId] = {
    // 		...updatePlayer,
    // 		trails: newTrails
    // 	}

    // 	return { ...state }
    // }
    //#endregion

    // *** UPDATE_NEW_SET ==> CREATE_SET
    case types.COMPLETED_SET: {
      state.sets = [...state.sets, {...state.currentSet, completed: true}]
      state.currentSet = {...action.latestSet}

      return {...state}
    }
    // *** UPDATE_WORKOUT_START
    case types.UPDATE_WORKOUT_START: {
      //TODO: structure state update so there is a single re-render
      // state.globalValues.isWorkoutStarted = true
      // state.globalValues.isWorkoutPaused = false
      state.globalValues.isWorkoutOver = false

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
      // state.globalValues.isWorkoutOver = !state.globalValues.isWorkoutOver
      state.globalValues.isWorkoutOver = action.newStatus
      console.log('Awesome Workout!!', state.globalValues.isWorkoutOver)
      // alert('AWESOME WORKOUT!')

      return {...state}
    }
    default:
  }
}

export {initialState, types, reducer}
