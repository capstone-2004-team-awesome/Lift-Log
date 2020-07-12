import React, {useState, useEffect, useContext} from 'react'
import {Button, Card} from '@material-ui/core'
import * as tmPose from '@teachablemachine/pose'

import {StoreContext} from '../context/StoreContext'
import {types} from '../context/reducers'

const NewCamera = props => {
  const [webcam, setWebcam] = useState({})

  const {state, dispatch} = useContext(StoreContext)
  let predictionTracker = props.predictionTracker
  console.log('Camera Props: ', predictionTracker)

  // the link to Teachable Machine model
  const URL = 'https://teachablemachine.withgoogle.com/models/ByPivKL7e/'
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'
  const size = 600
  let model, ctx, labelContainer, maxPredictions

  useEffect(() => {
    const defineWebcam = () => {
      const flip = true // whether to flip the webcam
      // Convenience function to setup a webcam
      setWebcam(new tmPose.Webcam(size, size, flip)) // width, height, flip
    }
    defineWebcam()
  }, [])

  // More API functions here:
  // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

  async function init() {
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()

    await webcam.setup() // request access to the webcam
    await webcam.play()
    window.requestAnimationFrame(loop)

    // append/get elements to the DOM
    // TODO: remove from DEPLOYED / FINAL version
    const canvas = document.getElementById('canvas')
    canvas.width = size
    canvas.height = size
    ctx = canvas.getContext('2d')
    labelContainer = document.getElementById('label-container')

    for (let i = 0; i < maxPredictions; i++) {
      // and class labels
      labelContainer.appendChild(document.createElement('div'))
    }
  }

  async function loop() {
    webcam.update() // update the webcam frame

    // *** conditional to STOP infinite loop!
    // console.log("LOOP....", state.globalValues.isWorkoutOver)
    if (
      !state.globalValues.isWorkoutOver &&
      !state.globalValues.isWorkoutPaused
    ) {
      await predict()
      window.requestAnimationFrame(loop)
    }
  }

  async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {pose, posenetOutput} = await model.estimatePose(webcam.canvas)
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput)
    // *** prediction object sample:
    // prediction = [{className: "Neutral - Standing", probability: 1.136856439103e-15},
    //              {className: "Bicep Curl - Up ", probability: 1}]

    let newPrediction = {
      'Bicep Curl': null,
      Squat: null
    }

    // this section appends the probability of a pose to the DOM
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2)
      labelContainer.childNodes[i].innerHTML = classPrediction

      // *** CREATE predictionTracker
      if (prediction[i].className !== 'Neutral - Standing') {
        if (prediction[i].probability > 0.95) {
          newPrediction[prediction[i].className] = true
        } else {
          newPrediction[prediction[i].className] = false
        }
      }
    }
    // finally draw the poses
    drawPose(pose)

    // console.log("predictionTracker in predict(): ", predictionTracker)
    await props.evaluatePrediction(predictionTracker, newPrediction)

    predictionTracker = {...newPrediction}
  }

  // TODO: if process.env.NODE_ENV !== 'production' don't run drawPose()
  function drawPose(pose) {
    if (webcam.canvas) {
      ctx.drawImage(webcam.canvas, 0, 0)
      // draw the keypoints and skeleton
      if (pose) {
        const minPartConfidence = 0.5
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx)
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx)
      }
    }
  }

  const pause = async () => {
    await webcam.pause()
    dispatch({type: types.UPDATE_WORKOUT_PAUSE})
  }

  const stop = async () => {
    await webcam.stop()
    dispatch({type: types.UPDATE_WORKOUT_STATUS, newStatus: true})
    // redirect to workout summary page
    props.history.push('/summary')
  }

  const play = async () => {
    await webcam.play()
    // TODO: toggle pause works for predict() loop... but not for camera
    // dispatch({type: types.UPDATE_WORKOUT_PAUSE})
  }

  return (
    <Card style={{width: '100%'}}>
      <Button type="button" onClick={() => init()}>
        Start
      </Button>
      <Button type="button" onClick={() => play()}>
        Play
      </Button>
      <Button type="button" onClick={() => pause()}>
        Pause
      </Button>
      <Button type="button" onClick={() => stop()}>
        Stop
      </Button>
      <div>
        <canvas id="canvas" style={{width: '600px', height: '600px'}} />
      </div>
      <div id="label-container" />
    </Card>
  )
}

export default NewCamera
