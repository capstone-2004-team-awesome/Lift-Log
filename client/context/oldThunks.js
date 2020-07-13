// import { useContext, useState, useEffect } from 'react'
// import { StoreContext } from '../context/StoreContext'
import axios from 'axios'
import {types, exercises} from './reducers'

//#region
// export const incrementReps = (exerciseId, userId) => async dispatch => {
//     try {
//         const {data} = await axios.put(
//             `/api/exercise/update/${exerciseId}/${userId}`
//       )
//         console.log('IN THUNK incrementReps=>', data)
//         dispatch(actions.incrementedReps(data.reps))
//     } catch (err) {
//         console.error(err)
//     }
// }

// function incrementReps (exerciseId, userId) {
//     const { actions } = useContext(StoreContext)
//     return async (dispatch) => {
//         try {
//             const {data} = await axios.put(
//                 `/api/exercise/update/${exerciseId}/${userId}`
//           )
//             console.log('IN THUNK incrementReps=>', data)
//             dispatch(actions.incrementedReps(data.reps))
//         } catch (err) {
//             console.error(err)
//         }
//     }
// }
//#endregion

// const keys = {
//   CURL: 1,
//   SQUAT: 2
// }
function createdSet(set) {
  return {
    type: types.CREATED_SET,
    set
  }
}
function incrementedReps(reps) {
  return {
    type: types.INCREMENTED_REPS,
    reps
  }
}

export const useThunks = (state, dispatch) => {
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
    return async function() {
      try {
        const {data} = await axios.put(
          `/api/exercise/update/${exerciseId}/${userId}`
        )
        console.log('IN THUNK incrementReps=>', data)
        dispatch({
          type: types.INCREMENTED_REPS,
          reps: data.reps
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return {
    incrementReps
  }
}
