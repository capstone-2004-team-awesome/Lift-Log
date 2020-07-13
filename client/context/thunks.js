import axios from 'axios'

// *** ACTION TYPES
import {types} from './reducers'

// *** ACTION CREATORS
export const incrementedReps = reps => ({
  type: types.INCREMENTED_REPS,
  reps
})
export const createdSet = set => ({
  type: types.CREATED_SET,
  set
})

// *** THUNK CREATORS
export const incrementReps = (exerciseId, userId) => async dispatch => {
  try {
    const {data} = await axios.put(
      `/api/exercise/update/${exerciseId}/${userId}`
    )
    console.log('IN THUNK incrementReps=>', data)
    dispatch(incrementedReps(data.reps))
  } catch (err) {
    console.error(err)
  }
}
export const createSet = (exerciseName, userId) => async dispatch => {
  try {
    const {data} = await axios.post(
      `/api/exercise/create/${exerciseName}/${userId}`
    )
    const [exercise, set] = data
    const updatedSet = {
      exerciseName: exercise.name,
      exerciseId: exercise.id,
      reps: set.reps,
      weight: set.weight,
      updatedAt: set.updatedAt
    }
    console.log('IN THUNK createSet=>', updatedSet)
    dispatch(createdSet(updatedSet))
  } catch (err) {
    console.error(err)
  }
}
export const completeSet = (exerciseId, userId) => async () => {
  try {
    await axios.put(`/api/exercise/complete/${exerciseId}/${userId}`)
    // TODO: conditional if something goes wrong?
  } catch (err) {
    console.error(err)
  }
}
