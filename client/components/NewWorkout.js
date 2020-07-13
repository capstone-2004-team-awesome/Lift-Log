/* eslint-disable guard-for-in */
import React, {useState, useContext} from 'react'
import NewCamera from './NewCamera'
import {Grid} from '@material-ui/core'
import WorkoutLog from './NewWorkoutLog'

import {StoreContext} from '../context/StoreContext'
import {types} from '../context/reducers'
import {createSet, incrementReps, completeSet} from '../context/thunks'

const NewWorkout = props => {
  const [updatedExercise, setUpdatedExercise] = useState('')

  const {state, dispatch, actions} = useContext(StoreContext)
  if (state.globalValues.isWorkoutOver) {
    dispatch({type: types.UPDATE_WORKOUT_START})
  }

  let predictionTracker = state.predictionTracker
  console.log(predictionTracker)

  // *** Evaluate the predictions from Camera component
  function evaluatePrediction(oldPrediction, newPrediction) {
    // takes the prediction OBJECT produced by predict() and evalutes whether anything has changed and which actions need to be dispatched
    // *** the very first time it changes (from null? to initial prediction) => CREATE SET
    console.log("Let's evalute prediction!", newPrediction)

    //#region      the FOR LOOP
    for (let exercise in newPrediction) {
      if (
        oldPrediction[exercise] === false &&
        newPrediction[exercise] === true
      ) {
        console.log(`SOMETHING HAS CHANGED! Let's update state.
                    CURRENT STATE: ${state.currentSet.exerciseName} (${
          state.currentSet.reps
        })
                    EXERCISE just completed: ${exercise}`)

        // *** if there is no currentSet on state, create new set
        if (!state.currentSet.exerciseName) {
          // dispatch(createSet(exercise, props.theUser))
          // actions.updatePredictionTracker(newPrediction, exercise)
          // dispatch({
          //   type: types.UPDATE_PREDICTION_TRACKER,
          //   newPrediction,
          //   exercise
          // })

          const set = {
            exerciseName: exercise,
            exerciseId: 2,
            reps: 1,
            weight: 5,
            updatedAt: Date.now(),
            completed: false
          }
          console.log('The NewWorkout... createSet!', set)

          // TODO: thunk dispatch  (need Version for Hooks)
          dispatch({type: types.CREATED_SET, set})

          setUpdatedExercise(exercise)
        } else if (exercise === state.currentSet.exerciseName) {
          // TODO: Evaluate time between reps to determine if a new set should be created.
          // check current time compared to the last set
          // if 30 seconds (30000ms) has passed, this is a new set. (createSet())
          // else {incrementReps()}
          // if (Date.now() - props.set.updatedAt.getTime() >= 5000) {}
          // props.incrementReps(props.exerciseId, props.userId)
          // dispatch({type: types.INCREMENTED_REPS, reps: state.currentSet.reps + 1})
          console.log('The NewWorkout... state REPS: ', state.currentSet.reps)

          dispatch(incrementReps(state.currentSet.exerciseId, props.theUser))

          setUpdatedExercise(exercise)
        } else {
          // complete set & start new set
          console.log('Time to complete SET & start a new one!')
          // props.completeSet(props.exerciseId, props.userId)
          // props.createSet(exercise, props.userId)

          // *** completeSet updates DB, while createSet manages both DB & state update
          completeSet(state.currentSet.exerciseId, props.theUser)
          dispatch(createSet(exercise, props.theUser))

          setUpdatedExercise(exercise)
        }

        // TODO: create exercise object on state with id's so we only need one db call here?
        // check current time compared to the last set
        // if 30 seconds has passed, this is a new set. (axios.post)
        // else axios.put
        // 30 seconds = 30000ms

        // if (Date.now() - currentSet.time.getTime() >= 5000) {
        //   const {data} = await axios.post('/api/exercise/create/1/1')
        //   setCurrentSet({
        //     exerciseName: exercise,
        //     exerciseId: data.exerciseId,
        //     reps: data.reps,
        //     weight: data.weight,
        //     time: data.updatedAt,
        //   })
        // } else {
        //TODO: need to pass in exerciseID and userId to route instead of hardcode
        // increment reps by 1
        // const {data} = await axios.put('/api/exercise/update/1/1')

        // setCurrentSet({
        //     exerciseName: exercise,
        //     exerciseId: data.exerciseId,
        //     reps: data.reps,
        //     weight: data.weight,
        //     time: data.updatedAt
        // })

        // console.log('DATA', data)
        // }

        //data: {weight: null, reps: 41, createdAt: "2020-07-06T16:18:59.059Z", updatedAt: "2020-07-06T16:42:03.394Z", userId: 1, exerciseId: 1}
      }
    }
    //#endregion
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item sm={6}>
          <NewCamera
            predictionTracker={predictionTracker}
            evaluatePrediction={evaluatePrediction}
            history={props.history}
          />
        </Grid>
        <Grid item sm={6}>
          <WorkoutLog latestExercise={updatedExercise} />
        </Grid>
      </Grid>
    </div>
  )
}

export default NewWorkout
