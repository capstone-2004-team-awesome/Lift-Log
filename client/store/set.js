import axios from 'axios'

// *** ACTION TYPES
const INCREMENTED_REPS = 'INCREMENTED_REPS'
const CREATED_SET = 'CREATED_SET'

// *** ACTION CREATORS
export const incrementedReps = reps => ({
  type: INCREMENTED_REPS,
  reps
})
export const createdSet = set => ({
  type: CREATED_SET,
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
export const completeSet = (exerciseId, userId) => async dispatch => {
  try {
    await axios.put(`/api/exercise/complete/${exerciseId}/${userId}`)
  } catch (err) {
    console.error(err)
  }
}

// *** INITIAL STATE
const initialState = {
  exerciseName: '',
  exerciseId: '',
  reps: '',
  weight: '',
  updatedAt: ''
}

// *** REDUCER
export default function(state = initialState, action) {
  switch (action.type) {
    case INCREMENTED_REPS:
      return {...state, reps: action.reps}
    case CREATED_SET:
      return {...state, ...action.set}
    default:
      return state
  }
}
