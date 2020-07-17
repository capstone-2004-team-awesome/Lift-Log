/* eslint-disable complexity */
import React, {useState, useEffect} from 'react'
import Camera from './Camera'
import {Grid} from '@material-ui/core'
import ExerciseLog from './ExerciseLog'
import * as tmPose from '@teachablemachine/pose'
import axios from 'axios'
import {connect} from 'react-redux'

const StartWorkout = props => {
  const [currentSet, setCurrentSet] = useState({
    exerciseName: '',
    exerciseId: '',
    reps: '',
    weight: '',
    time: '',
    setId: ''
  })

  const [completedExercise, setCompletedExercise] = useState({})
  const [webcam, setWebcam] = useState(null)
  const [model, setModel] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [webcamErrorMsg, setWebcamErrorMsg] = useState('')
  let setLogger = {}

  let ctx, labelContainer, maxPredictions
  let globalId
  let stopped = false
  let prevPrediction = {
    'Bicep Curl': false,
    Squat: false
  }
  let currPrediction = {
    'Bicep Curl': false,
    Squat: false
  }

  // Teachable Machine API Functions:
  // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

  useEffect(() => {
    async function loadModel() {
      // load the model and metadata
      // Note: the pose library adds a tmPose object to your window (window.tmPose)
      // the link to our Teachable Machine model
      const URL = 'https://teachablemachine.withgoogle.com/models/ByPivKL7e/'
      const modelURL = URL + 'model.json'
      const metadataURL = URL + 'metadata.json'
      const loadedModel = await tmPose.load(modelURL, metadataURL)
      setModel(loadedModel)
    }
    loadModel()
  }, [])

  useEffect(() => {
    const defineWebcam = () => {
      // setup a webcam
      setWebcam(new tmPose.Webcam(300, 300, true)) // width, height, flip
    }
    defineWebcam()
  }, [])

  const createNewSet = async exercise => {
    const {data} = await axios.post(
      `/api/exercise/create/${exercise}/${props.userId}`
    )
    const [exerciseInfo, setInfo] = data
    setLogger = {
      exerciseName: exerciseInfo.name,
      exerciseId: exerciseInfo.id,
      reps: setInfo.reps,
      weight: setInfo.weight,
      updatedAt: setInfo.updatedAt,
      setId: setInfo.id
    }
  }

  const markSetComplete = async () => {
    await axios.put(`/api/exercise/complete/${props.userId}`)
    setCompletedExercise(setLogger)
  }

  async function loop() {
    if (!stopped) {
      webcam.update() // update the webcam frame
      await predict()
      globalId = window.requestAnimationFrame(loop)
    }
  }

  async function init() {
    maxPredictions = model.getTotalClasses()
    // Convenience function to setup a webcam
    setIsLoading(true)
    try {
      await webcam.setup() // request access to the webcam from user
    } catch (error) {
      setWebcamErrorMsg(
        'There was an error opening your webcam. Make sure permissions are enabled.'
      )
      console.log('There was an error accessing webcam: ', error)
    }
    webcam.play()
    globalId = window.requestAnimationFrame(loop)
    setIsLoading(false)
    // append/get elements to the DOM
    const canvas = document.getElementById('canvas')
    canvas.height = canvas.width
    ctx = canvas.getContext('2d')
    labelContainer = document.getElementById('label-container')
    for (let i = 0; i < maxPredictions; i++) {
      // and class labels
      labelContainer.appendChild(document.createElement('div'))
    }
  }

  async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {pose, posenetOutput} = await model.estimatePose(webcam.canvas)
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput)
    // *** prediction object example:
    // prediction = [{className: "Neutral - Standing", probability: 1.1368564933439103e-15},
    //              {className: "Bicep Curl - Up ", probability: 1}]

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2)
      labelContainer.childNodes[i].innerHTML = classPrediction
      if (prediction[i].probability > 0.95) {
        currPrediction[prediction[i].className] = true
      } else {
        currPrediction[prediction[i].className] = false
      }
    }

    for (let exercise in currPrediction) {
      if (!exercise.includes('Neutral')) {
        // *** if exercise boolean value has switched, make API call (exerciseId), to increase reps
        if (
          prevPrediction[exercise] === false &&
          currPrediction[exercise] === true
        ) {
          if (!setLogger.exerciseId) {
            await createNewSet(exercise)
          } else if (exercise === setLogger.exerciseName) {
            // IF CURRENT DATE IS GREATER THAN PREVIOUS REP BY MORE THAN THE BREAK TIME
            // MARK PREVIOUS SET COMPLETE AND CREATE A NEW SET
            const breakTime = 30000 // 3Os
            if (Date.now() - new Date(setLogger.updatedAt) >= breakTime) {
              await markSetComplete()
              await createNewSet(exercise)
            } else {
              // INCREMENT REPS IF SAME EXERCISE IS REPEATED BEFORE BREAK TIME
              const {data} = await axios.put(
                `/api/exercise/update/${setLogger.exerciseId}/${props.userId}`
              )
              setLogger = {
                ...setLogger,
                reps: data.reps,
                updatedAt: data.updatedAt
              }
            }
          } else {
            // IF NEW EXERCISE IS BEING DONE, MARK PREVIOUS SET AS COMPLETE AND CREATE A NEW SET
            await markSetComplete()
            await createNewSet(exercise)
          }
          setCurrentSet({
            exerciseName: exercise,
            exerciseId: setLogger.exerciseId,
            reps: setLogger.reps,
            weight: setLogger.weight,
            time: setLogger.updatedAt,
            setId: setLogger.setId
          })
        }
      }
    }

    // finally draw the poses
    drawPose(pose)
    prevPrediction = {...currPrediction}
  }

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

  const stop = async () => {
    // STOP CAMERA AND MARK THE LAST SET DONE AS COMPLETE
    stopped = true
    cancelAnimationFrame(globalId)
    // setStopped(true)

    await axios.put(`/api/exercise/complete/${props.userId}`)
    webcam.stop()
    // redirect to workout summary page
    props.history.push('/summary')
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Camera
            init={init}
            stop={stop}
            model={model}
            webcam={webcam}
            isLoading={isLoading}
            webcamErrorMsg={webcamErrorMsg}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <ExerciseLog
            currentSet={currentSet}
            completedExercise={completedExercise}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapState = state => {
  return {
    userId: state.user.id
  }
}

export default connect(mapState)(StartWorkout)
