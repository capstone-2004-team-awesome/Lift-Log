import React, {useContext, useState, useEffect} from 'react'
import {StoreContext} from '../context/StoreContext'

// import SnakeCanvas from '../SnakeCanvas'
import loadVideo from '../utilities/camera'
import staticStore from '../context/staticStore'
// import { isInFrame } from '../../utilities/snake'
// import {isNotNeutral} from '../utilities/workout'
import {isNeutral} from '../utilities/workout'

import * as tmPose from '@teachablemachine/pose'
import {Button, Card, Grid} from '@material-ui/core'
import WorkoutLog from './NewWorkoutLog'

function TheWorkout() {
  const {actions, state} = useContext(StoreContext)
  console.log('The state in CONTEXT', state.predictionTracker.Squat)

  // const tm = window.tm   //TODO: WHAT IS THIS??? */
  // const tmPose = window.tmPose //TODO: Is this somewhere?
  const [userWebCam, setUserWebCam] = useState(null)
  const [model, setModel] = useState(null)

  let maxPredictions
  // TODO: Make with a for loop over the model.getTotalClasses
  // let lastPrediction = {
  //   'Bicep Curl': false,
  //   'Squat': false
  // }
  let predictionTracker = {
    'Bicep Curl': false,
    Squat: false
  }
  // const [predictionTracker, setPredictionTracker] = useState({
  //   'Bicep Curl': false,
  //   'Squat': false
  // })

  async function loadModel() {
    // const loadedModel = await tm.mobilenet.load(staticStore.model.checkPoint)
    // setModel(loadedModel)

    // *** the link to Teachable Machine model
    const loadedModel = await tmPose.load(
      staticStore.model.modelURL,
      staticStore.model.metadataURL
    )
    setModel(loadedModel)
    // maxPredictions = model.getTotalClasses()
    // console.log("# of Model Classes", maxPredictions)
  }

  async function predictVideo(image) {
    if (model) {
      // const prediction = await model.predict(image, 4)
      // const predictType = prediction[0].className

      // const {pose, posenetOutput} = await model.estimatePose(webcam.canvas)
      const {pose, posenetOutput} = await model.estimatePose(image)
      const prediction = await model.predict(posenetOutput)
      maxPredictions = model.getTotalClasses()
      // console.log(maxPredictions)

      // *** prediction ARRAY EXAMPLE:
      // prediction = [
      //     {className: "Neutral - Standing", probability: 1.1368564933439103e-15},
      //     {className: "Bicep Curl - Up ", probability: 1}
      // ]

      for (let i = 0; i < maxPredictions; i++) {
        // console.log("Inside my FOR loop, making predictions", prediction[i])
        if (prediction[i].className !== 'Neutral - Standing') {
          if (prediction[i].probability > 0.95) {
            predictionTracker[prediction[i].className] = true
            // console.log("FOR loop, IF true: ", predictionTracker)
          } else {
            predictionTracker[prediction[i].className] = false
          }
        }
      }
      // if (isInFrame) actions.updateSnakePosition({ predictType })
      //TODO: Adjust!  So long as the prediction is not the neutral pose, don't update?  OOOR, so long as the camera is running?
      // if (!isNeutral) actions.updateSet({predictionTracker})
      // actions.updateSet({predictionTracker})
      // actions.updatePredictionTracker({predictionTracker})

      // TODO: missing the drawPose function... do I want it?
      // drawPose(pose)
      // lastPrediction = {...predictionTracker}
      // evaluatePrediction(predictionTracker)
      // console.log(predictionTracker)

      predictVideo(userWebCam)
    }
  }

  async function evaluatePrediction(prediction) {
    // takes the prediction OBJECT produced by predict() and evalutes whether anything has changed and which actions need to be dispatched
    // *** the very first time it changes (from null? to initial prediction) => CREATE SET
    // console.log("Let's evalute prediction!")
  }

  // load the model (only once as component is mounted)
  useEffect(() => {
    loadModel()
  }, [])

  // load the video (only once as component is mounted)
  useEffect(() => {
    try {
      const video = loadVideo(document.getElementById('userWebCam'))
      video.then(resolvedVideo => {
        setUserWebCam(resolvedVideo)
      })

      // *** ALT to above using canvas?
      // const video = loadVideo(document.getElementById('userWebCam'))
      // video.then((resolvedVideo) => {
      // 	setUserWebCam(resolvedVideo)
      // })
    } catch (err) {
      throw err
    }
  }, [])

  // make prediction (as userWebCam and model is set)
  useEffect(
    () => {
      if (userWebCam) {
        predictVideo(userWebCam)
      }
    },
    [userWebCam, model]
  )

  // useEffect(() => {

  // }, [predictionTracker])

  return (
    <div id="TheWorkout">
      {/* <div className="info-bar">
				<h1 className="game-title">Teachable Snake</h1>
				<video id="userWebCam"></video>
			</div>
			<div className="main-canvas">
				<SnakeCanvas/>
			</div> */}

      <Grid container spacing={4}>
        <Grid item sm={6}>
          {/* <Camera init={init} pause={pause} stop={stop} play={play} /> */}
          {/* <video id="userWebCam"></video> */}

          <Card style={{width: '100%'}}>
            {/* <canvas id="userWebCam"></canvas> */}
            <video id="userWebCam" />
          </Card>
        </Grid>
        <Grid item sm={6} className="main-canvas">
          {/* <ExerciseLog currentSet={props.set} /> */}
          <WorkoutLog
            prediction={{'Bicep Curl': false, Squat: false, Deadlift: true}}
          />
          {/* <SnakeCanvas/> */}
        </Grid>
      </Grid>
    </div>
  )
}

export default TheWorkout
