/* eslint-disable complexity */
import {types, exercises} from './reducers'
import {
  //   checkPrediction,
  //   createNewSet,
  evaluatePrediction
} from '../utilities/workout'

// const keys = {
//   CURL: 1,
//   SQUAT: 2
// }

export const useActions = (state, dispatch) => {
  //#region    updateSnakePosition    OLD TEMP CODE
  // function updateSnakePosition(event) {
  // 	const { globalValues, players } = state
  // 	const { unit } = globalValues
  // 	const {
  // 		LEFT,
  // 		UP,
  // 		RIGHT,
  // 		DOWN,
  // 		arrowUp,
  // 		arrowRight,
  // 		arrowDown,
  // 		arrowLeft
  // 	} = keys

  // 	const keyCode = event
  // 		? event.keyCode
  // 			? event.keyCode
  // 			: event.predictType
  // 		: null

  // 	switch(keyCode) {
  // 		case LEFT:
  // 		case arrowLeft:
  // 			dispatch({
  // 				type: types.MOVE_SNAKE,
  // 				payload: {
  // 					isBackWrapping: checkDirection(directions.LEFT, players[0].trails),
  // 					playerId: 0,
  // 					xVelocity: -1 * unit,
  // 					yVelocity: 0
  // 				}
  // 			})
  // 			return
  // 		case UP:
  // 		case arrowUp:
  // 			dispatch({
  // 				type: types.MOVE_SNAKE,
  // 				payload: {
  // 					isBackWrapping: checkDirection(directions.UP, players[0].trails),
  // 					playerId: 0,
  // 					xVelocity: 0,
  // 					yVelocity: -1 * unit,
  // 				}
  // 			})
  // 			return
  // 		case RIGHT:
  // 		case arrowRight:
  // 			dispatch({
  // 				type: types.MOVE_SNAKE,
  // 				payload: {
  // 					isBackWrapping: checkDirection(directions.RIGHT, players[0].trails),
  // 					playerId: 0,
  // 					xVelocity: 1 * unit,
  // 					yVelocity: 0
  // 				}
  // 			})
  // 			return
  // 		case DOWN:
  // 		case arrowDown:
  // 			dispatch({
  // 				type: types.MOVE_SNAKE,
  // 				payload: {
  // 					isBackWrapping: checkDirection(directions.DOWN, players[0].trails),
  // 					playerId: 0,
  // 					xVelocity: 0,
  // 					yVelocity: 1 * unit,
  // 				}
  // 			})
  // 			return
  // 		default:
  // 			dispatch({
  // 				type: types.MOVE_SNAKE,
  // 				payload: {
  // 					playerId: 0,
  // 					keepMoving: true
  // 				}
  // 			})
  // 			return
  // 	}
  // }
  //#endregion

  function updatePredictionTracker(newPrediction) {
    console.log('in ACTION =>', newPrediction)
    const {globalValues, sets, currentSet, predictionTracker} = state
    const howToUpdate = evaluatePrediction(
      currentSet,
      predictionTracker,
      newPrediction
    )
    console.log('ACTION TYPE for updating Set: ', howToUpdate)

    dispatch({
      type: types.UPDATE_PREDICTION_TRACKER,
      payload: {
        howToUpdate,
        predictionTracker: newPrediction
      }
    })
  }
  // *** updateSET (based on newest prediction)    by reviewing "trails" = "prediction_tracker"
  // function updateSet(newPrediction) {
  // 	const {globalValues, sets, currentSet, predictionTracker} = state
  // }

  return {
    updatePredictionTracker
    // updateSet
  }
}
