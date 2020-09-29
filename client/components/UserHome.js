import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Calendar from 'react-calendar'
import {Redirect} from 'react-router-dom'
import ProgressBar from './ProgressBar'
import {default as UpdateGoalDialog} from './UpdateGoalDialog'
import axios from 'axios'
import moment from 'moment'

import {makeStyles} from '@material-ui/core/styles'
import {Typography, Paper, Grid} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center'
  }
}))

/**
 //* COMPONENT
 */
export const UserHome = props => {
  const classes = useStyles()

  // *** States
  const {firstName} = props
  const [selectedDate, setSelectedDate] = useState(null)
  const [workoutCalendar, setWorkoutCalendar] = useState([])
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0)
  const [userGoal, setUserGoal] = useState(0)
  const [userGoalDialogOpen, setUserGoalDialogOpen] = useState(false)

  // *** Handle user selection of a calendar date to view workout summary
  const handleChange = selection => {
    try {
      setSelectedDate(selection)
    } catch (error) {
      console.error('error getting date: ', error)
    }
  }

  // *** Fetch all workout dates for the current month
  useEffect(() => {
    const fetchWorkoutByMonth = async () => {
      try {
        const today = moment().format(moment.HTML5_FMT.DATE)

        const {data} = await axios.get(`/api/workouts/month/${today}`)
        if (data.length) setWorkoutCalendar(data)
      } catch (error) {
        console.error('error fetching sets on front end!', error)
      }
    }
    fetchWorkoutByMonth()
  }, [])

  // *** Calculate the # of workouts this week for ProgressBar
  useEffect(
    () => {
      const yearMM = moment().format('YYYY-MM')
      const thisWeek = moment().format('w')

      const workoutsPerWeek = (workouts, week) => {
        let workoutCount = 0
        for (let i = 0; i < workouts.length; i++) {
          let workoutDate = moment(
            `${yearMM}-${workouts[i].day}`,
            'YYYY-MM-D'
          ).format('YYYY-MM-DD')
          let workoutWeek = moment(workoutDate).format('w')
          if (week === workoutWeek) {
            workoutCount = workoutCount + 1
          }
        }
        return workoutCount
      }
      setWorkoutsThisWeek(workoutsPerWeek(workoutCalendar, thisWeek))
    },
    [workoutCalendar]
  )

  // *** Fetch user goal data for ProgressBar
  useEffect(() => {
    const fetchGoal = async () => {
      const {data} = await axios.get('/auth/me')
      setUserGoal(data.goal)
    }
    fetchGoal()
  }, [])

  // *** Progress Bar: DATA & STYLING
  const progressBarData = {
    progress: 'ratio', // ratio, percent
    labelContent: 'Workouts This Week',
    size: 'medium', // tiny, small, medium, large, big
    color: 'teal' // red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black
  }

  // *** Progress Bar: Select Goal DIALOG
  const handleClickGoal = () => {
    setUserGoalDialogOpen(true)
  }
  const handleCloseGoal = async newValue => {
    setUserGoalDialogOpen(false)

    if (newValue) {
      const {data} = await axios.put(`/auth/${props.userId}`, {goal: newValue})
      console.log('Incoming user data from dialog: ', data)
      setUserGoal(data[1].goal)
    }
  }

  // *** append className to calendar tiles for days with workouts logged
  const tileClassName = ({date, view}) => {
    if (workoutCalendar.length !== 0) {
      let getDate = moment(date).format('D')
      for (let i = 0; i < workoutCalendar.length; i++) {
        if (getDate === `${workoutCalendar[i].day}`) {
          return 'workout'
        }
      }
      return null
    }
  }

  return selectedDate ? (
    <Redirect to={{pathname: '/summary', state: {selectedDate}}} />
  ) : (
    <div className={classes.root}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} sm={10} md={8} lg={10}>
          <Typography variant="h2">Welcome, {firstName}!</Typography>
        </Grid>

        <Grid item xs={12} sm={10} md={8} lg={10} alignContent="center">
          <Paper className={classes.paper}>
            {workoutsThisWeek ? (
              <Typography variant="body1" gutterBottom>
                You've logged {workoutsThisWeek} workouts this week, that's
                awesome!
              </Typography>
            ) : (
              <Typography variant="body1" gutterBottom>
                Uh oh, you haven't logged any workouts this week, better get
                lifting!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
          <Paper className={classes.paper}>
            <Calendar
              calendarType="US"
              onChange={handleChange}
              tileClassName={tileClassName}
            />
          </Paper>
        </Grid>

        <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
          <Paper className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Your Progress
            </Typography>

            {userGoal ? (
              <ProgressBar
                data={progressBarData}
                total={userGoal}
                value={workoutsThisWeek}
              />
            ) : (
              <div>
                <Typography variant="body1" gutterBottom>
                  Want to see how you're doing each week?
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Set a goal to track your progress!
                </Typography>

                <UpdateGoalDialog
                  userId={props.userId}
                  userGoal={userGoal}
                  onClose={handleCloseGoal}
                  onClickOpen={handleClickGoal}
                  open={userGoalDialogOpen}
                />
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

/**
 //* CONTAINER
 */
const mapState = state => {
  return {
    firstName: state.user.firstName,
    userId: state.user.id,
    goal: state.user.goal
  }
}

export default connect(mapState)(UserHome)

/**
 //* PROP TYPES
 */
UserHome.propTypes = {
  firstName: PropTypes.string
}
