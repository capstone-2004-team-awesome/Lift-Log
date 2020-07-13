/* eslint-disable complexity */
import {types, exercises} from './reducers'
import {
  //   checkPrediction,
  //   createNewSet,
  evaluatePrediction
} from '../utilities/workout'
import axios from 'axios'
// import { nextFrame } from '@tensorflow/tfjs'

// const keys = {
//   CURL: 1,
//   SQUAT: 2
// }
// function createdSet(set) {
//   return({
//     type: types.CREATED_SET,
//     set
//   })
// }
// function incrementedReps(reps) {
//   return ({
//     type: types.INCREMENTED_REPS,
//     reps
//   })
// }

export const useActions = (state, dispatch) => {
  function updatePredictionTracker(newPrediction, exercise) {
    console.log('in ACTION =>', newPrediction)
    const {globalValues, sets, currentSet, predictionTracker} = state
    // const howToUpdate = evaluatePrediction(
    //   currentSet,
    //   predictionTracker,
    //   newPrediction
    // )
    // console.log('ACTION TYPE for updating Set: ', howToUpdate)

    dispatch({
      type: types.UPDATE_PREDICTION_TRACKER,
      newPrediction,
      exercise
    })
  }

  function createdSet(set) {
    dispatch({
      type: types.CREATED_SET,
      set
    })
  }

  function incrementedReps(reps) {
    dispatch({
      type: types.INCREMENTED_REPS,
      reps
    })
  }

  // *** THUNKS

  // const incrementReps = (exerciseId, userId) => async dispatch => {
  //   const {data} = await axios.put(
  //     `/api/exercise/update/${exerciseId}/${userId}`
  //   )
  //   console.log('IN THUNK incrementReps=>', data)
  //   incrementedReps(data.reps)
  // }

  function incrementReps(exerciseId, userId) {
    // const { actions } = useContext(StoreContext)
    console.log('IN THE THUNK')
    return async function(dispatch) {
      try {
        const {data} = await axios.put(
          `/api/exercise/update/${exerciseId}/${userId}`
        )
        console.log('IN THUNK incrementReps=>', data)
        dispatch(incrementedReps(data.reps))
      } catch (err) {
        console.log(err)
      }
    }
  }

  return {
    updatePredictionTracker,
    createdSet,
    incrementedReps,
    // updateSet,
    incrementReps
  }
}
