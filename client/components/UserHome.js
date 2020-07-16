import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Calendar from 'react-calendar'
import {Redirect} from 'react-router-dom'
import ProgressBar from './ProgressBar'
import {default as UpdateGoalDialog} from './UpdateGoalDialog'
import axios from 'axios'
import moment from 'moment'

import {Typography} from '@material-ui/core'

/**
 //* COMPONENT
 */
export const UserHome = props => {
  const {firstName} = props
  const [selectedDate, setSelectedDate] = useState(null)

  const [workoutCalendar, setWorkoutCalendar] = useState([])
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0)

  // *** Handle user selection of a calendar date to view workout summary
  const handleChange = selection => {
    try {
      setSelectedDate(selection)
    } catch (error) {
      console.log('error getting date!')
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
        console.log('error fetching sets on front end!', error)
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

  // *** Progress Bar: DATA & STYLING
  const progressBarData = {
    total: props.goal,
    value: workoutsThisWeek,
    progress: 'ratio', // ratio, percent
    labelContent: 'Workouts Per Week',
    size: 'medium', // tiny, small, medium, large, big
    color: 'teal' // red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black
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

  console.log('SELECTED', selectedDate)

  return selectedDate ? (
    <Redirect to={{pathname: '/summary', state: {selectedDate}}} />
  ) : (
    <div>
      <Typography variant="h2" component="h3" gutterBottom>
        Welcome, {firstName}!
      </Typography>

      <Calendar
        calendarType="US"
        onChange={handleChange}
        tileClassName={tileClassName}
      />
      <br />

      <div>
        {progressBarData.value ? (
          <Typography variant="h6" gutterBottom>
            You've logged {progressBarData.value} workouts this week, that's
            awesome!
          </Typography>
        ) : (
          <Typography variant="h6" gutterBottom>
            Uh oh, you haven't logged any workouts this week, better get
            lifting!
          </Typography>
        )}
      </div>
      <br />
      <Typography variant="h3" component="h4" gutterBottom>
        Your Progress
      </Typography>

      <div style={{width: `${40}%`}}>
        {props.goal ? (
          <ProgressBar data={progressBarData} />
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
              // goal={props.goal}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 //* CONTAINER
 */
const mapState = state => {
  console.log('Mapping State to Props', state)
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
