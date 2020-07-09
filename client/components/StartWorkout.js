/* eslint-disable complexity */
import React, {useState, useEffect} from 'react'
import Camera from './Camera'
import {Grid} from '@material-ui/core'
import ExerciseLog from './ExerciseLog'
import * as tmPose from '@teachablemachine/pose'
import {connect} from 'react-redux'
import {createSet, incrementReps, completeSet} from '../store/set'

const StartWorkout = props => {
  const [webcam, setWebcam] = useState({})

  // the link to Teachable Machine model
  const URL = 'https://teachablemachine.withgoogle.com/models/ByPivKL7e/'
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'
  const size = 600
  let model, ctx, labelContainer, maxPredictions
  let lastPrediction = {
    'Bicep Curl': false,
    Squat: false
  }
  let predictionTracker = {
    'Bicep Curl': false,
    Squat: false
  }

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

    // this section appends the probability of a pose to the DOM
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
        // we don't want to include neutral position in our log
        if (
          // only records a rep if user is going from neutral position to bicep curl
          lastPrediction[exercise] === false &&
          predictionTracker[exercise] === true
        ) {
          if (!props.set.exerciseId) {
            props.createSet(exercise, props.userId)
          } else if (exercise === props.set.exerciseName) {
            //TODO: Evaluate time between reps to determine if a new set should be created.
            // check current time compared to the last set
            // if 30 seconds (30000ms) has passed, this is a new set. (createSet())
            // else {incrementReps()}
            // if (Date.now() - props.set.updatedAt.getTime() >= 5000) {}
            props.incrementReps(props.exerciseId, props.userId)
          } else {
            // complete set & start new set
            props.completeSet(props.exerciseId, props.userId)
            props.createSet(exercise, props.userId)
          }
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
          <ExerciseLog currentSet={props.set} />
        </Grid>
      </Grid>
    </div>
  )
}

const mapState = state => {
  console.log('Mapping State to Props:', state)
  return {
    set: state.set,
    userId: state.user.id
  }
}

const mapDispatch = dispatch => {
  console.log('Mapping dispatch to props')
  return {
    createSet: (exerciseName, userId) =>
      dispatch(createSet(exerciseName, userId)),
    incrementReps: (exerciseId, userId) =>
      dispatch(incrementReps(exerciseId, userId)),
    completeSet: (exerciseId, userId) =>
      dispatch(completeSet(exerciseId, userId))
  }
}

export default connect(mapState, mapDispatch)(StartWorkout)
