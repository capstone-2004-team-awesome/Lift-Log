// import {initialState, exercises} from '../context/reducers'

import axios from 'axios'

// *** Is the exercise something other than Neutral Position? (i.e. do we even care or need to do anything?) Noooope!
// TODO: if our prediction_tracker set off a (dispatch?)
// export let isNotNeutral = false
export let isNeutral = true

// *** prediction tracker?
// const workoutStore = {
// 	canvasWidth: 0,
// 	canvasHeight: 0,
// 	notFirstInitFrame: true,
// 	startedAnimationFrame: false,
// 	unit: 0
// }

// export const createdNewSet = (set) => ({
// 	type: CREATED_NEW_SET,
// 	set
// })

// export const createNewSet = (exerciseName, userId) => async dispatch => {
// 	try {
// 		const {data} = await axios.post(
// 			`/api/exercise/create/${exerciseName}/${userId}`
// 		)
// 		const [exercise, set] = data
// 		const updatedSet = {
// 			exerciseName: exercise.name,
// 			exerciseId: exercise.id,
// 			reps: set.reps,
// 			weight: set.weight,
// 			updatedAt: set.updatedAt
// 		}
// 		console.log('IN THUNK createNewSet=>', updatedSet)
// 		dispatch(createdNewSet(updatedSet))
// 	} catch (err) {
// 		console.error(err)
// 	}
// }

//#region    Evaluate Prediction   *** IN PROGRESS ***
// export function evaluatePrediction(
//   currentSet,
//   previousPrediction,
//   newPrediction
// ) {
//   for (let exercise in newPrediction) {
//     console.log(exercise)
//     if (
//       // only records a rep if user is going from neutral position to bicep curl
//       previousPrediction[exercise] === false &&
//       newPrediction[exercise] === true
//     ) {
//       if (!currentSet.exerciseId) {
//         // createSet(exercise, props.userId)
//         console.log('Creating new set!')
//         // *** dispatch(axios request to create + get data)
//         return 'CREATE_NEW_SET'
//       } else if (exercise === currentSet.exerciseName) {
//         //TODO: Evaluate time between reps to determine if a new set should be created.
//         return 'UPDATE_SET'
//         console.log(
//           "Same exercise, let's check the time: ",
//           currentSet.updatedAt.getTime()
//         )
//         // check current time compared to the last set
//         // if 30 seconds (30000ms) has passed, this is a new set. (createSet())
//         // else {incrementReps()}
//         // if (Date.now() - props.set.updatedAt.getTime() >= 5000) {}
//         // props.incrementReps(props.exerciseId, props.userId)
//       } else {
//         // complete set & start new set
//         console.log('Completed set! Time for a new one.')
//         // props.completeSet(props.exerciseId, props.userId)
//         // props.createSet(exercise, props.userId)
//         return 'CREATE_NEW_SET'
//       }
//     } else {
//       console.log('Nothing changed with predictions, move along.')
//       return 'NO_SET_UPDATE'
//     }
//   }
// }
//#endregion

//#region   initCanvas
// export function initCanvas(canvas) {
// 	const { widthPortion, heightPortion } = initialState.globalValues.snakeCanvas
// 	const ctx = canvas.getContext('2d')

// 	ctx.canvas.width = window.innerWidth * widthPortion
// 	ctx.canvas.height = window.innerHeight * heightPortion
// 	ctx.fillStyle = '#eeeeee'
// 	ctx.fillRect(0, 0, canvas.width, canvas.height)

// 	snakeStore.canvasWidth = ctx.canvas.width
// 	snakeStore.canvasHeight = ctx.canvas.height
// }
//#endregion

//#region    updateGameFrame
// export function updateGameFrame(state, canvas, contextCallbacks) {
// 	const ctx = canvas.getContext('2d')
// 	const { updateUnit, updateFood, updateSnakePosition, updateSnakeLength, updateGameStatus } = contextCallbacks

// 	return (timestamp) => {
// 		if (!snakeStore.startedAnimationFrame) snakeStore.startedAnimationFrame = timestamp
// 		let progress = timestamp - snakeStore.startedAnimationFrame
// 		isInFrame = progress > snakeStore.frameDebounce

// 		if (isInFrame && !state.globalValues.isGameOver) {
// 			// execute main frame function
// 			initCanvas(canvas)

// 			// game over status
// 			if (isGameOver(state.players)) updateGameStatus()

// 			// from action context, dispatch reducer function
// 			// update the positions in global state
// 			snakeEating(state, updateFood, updateSnakeLength)
// 			updateSnakePosition()

// 			// draw the shapes according to global state
// 			redrawSnake(state, ctx)
// 			redrawFood(state, ctx)

// 			// reset flag
// 			snakeStore.startedAnimationFrame = false

// 			if (snakeStore.notFirstInitFrame) {
// 				updateUnit()
// 				updateFood()
// 				snakeStore.unit = state.globalValues.unit
// 				snakeStore.notFirstInitFrame = false
// 			}
// 		}

// 		requestAnimationFrame(updateGameFrame(state, canvas, contextCallbacks))
// 	}
// }
//#endregion

// export function checkPrediction(
//   currentExercise,
//   currentSet,
//   predictionTracker,
//   checkIfSameExercise = false
// ) {
//   let somethingChanged = false
//   console.log('Checking that Prediction!', currentExercise)

//   // if (snakeTrails.length > 1) {
// 	if (currentSet.reps > 1) {

// 		// *** if the predictionTracker === true  (exercise rep was already logged)
// 		// if (predictionTracker[currentExercise]) {
// 		// 	//exercise already logged!
// 		// 	console.log("Exercise already logged, move along.")
// 		// }

// 		if (!predictionTracker[currentExercise]) {
// 			//exercise already logged!
// 			console.log(`Exercise changed from false to true!
// 					You've got a REP of ${currentExercise}!!`)
// 			}
// 		}
// 		else {
// 			console.log(`CHECK_PREDICTION: The currentSet is empty! This must be your first exercise.
// 				Time to dispatch a thunk!!`)
// 		}

// 	return somethingChanged
// }
