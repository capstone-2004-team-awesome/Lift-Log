import React, {useState, useEffect} from 'react'
import Camera from './Camera'
import {Grid} from '@material-ui/core'
import ExerciseLog from './ExerciseLog'
import * as tmPose from '@teachablemachine/pose'
import axios from 'axios'

const StartWorkout = props => {
  const [currentSet, setCurrentSet] = useState({
    exerciseName: '',
    exerciseId: '',
    reps: '',
    weight: '',
    time: ''
  })
  const [webcam, setWebcam] = useState({})

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

  let lastPrediction = {
    'Bicep Curl - Up ': false,
    Squat: false
  }
  let predictionTracker = {
    'Bicep Curl - Up ': false,
    Squat: false
  }

  async function init() {
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()

    console.log('webcam', webcam)
    await webcam.setup() // request access to the webcam
    await webcam.play()
    window.requestAnimationFrame(loop)

    // append/get elements to the DOM
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
    await predict()
    window.requestAnimationFrame(loop)
  }

  async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {pose, posenetOutput} = await model.estimatePose(webcam.canvas)
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput)
    // *** prediction object sample:
    // prediction = [{className: "Neutral - Standing", probability: 1.1368564933439103e-15},
    //              {className: "Bicep Curl - Up ", probability: 1}]

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2)
      labelContainer.childNodes[i].innerHTML = classPrediction
      if (prediction[i].probability > 0.95) {
        predictionTracker[prediction[i].className] = true
      } else {
        predictionTracker[prediction[i].className] = false
      }
    }

    for (let exercise in predictionTracker) {
      // *** if exercise boolean value has switched, make API call (exerciseId), to increase reps
      if (exercise !== 'Neutral - Standing') {
        if (
          lastPrediction[exercise] === false &&
          predictionTracker[exercise] === true
        ) {
          // TODO: create exercise object on state with id's so we only need one db call here.
          // check current time compared to the last set
          // if 30 seconds has passed, this is a new set. (axios.post)
          // else axios.put

          const {data} = await axios.put('/api/exercise/update/1/1')

          //data: {weight: null, reps: 41, createdAt: "2020-07-06T16:18:59.059Z", updatedAt: "2020-07-06T16:42:03.394Z", userId: 1, exerciseId: 1}

          setCurrentSet({
            exerciseName: exercise,
            exerciseId: data.exerciseId,
            reps: data.reps,
            weight: data.weight,
            time: data.updatedAt
          })
        }
      }
    }
    // finally draw the poses
    drawPose(pose)
    lastPrediction = {...predictionTracker}
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
  }

  const stop = async () => {
    await webcam.stop()
    // redirect to workout summary page
    props.history.push('/summary')
  }

  const play = async () => {
    await webcam.play()
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item sm={6}>
          <Camera init={init} pause={pause} stop={stop} play={play} />
        </Grid>
        <Grid item sm={6}>
          <ExerciseLog currentSet={currentSet} />
        </Grid>
      </Grid>
    </div>
  )
}

export default StartWorkout
