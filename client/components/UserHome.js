import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Calendar from 'react-calendar'
import WorkoutSummary from './WorkoutSummary'
import {Redirect} from 'react-router-dom'
import ProgressBar from './ProgressBar'
import axios from 'axios'
// ^ onChange	Function called when the user clicks an item (day on month view, month on year view and so on) on the most detailed view available.	n/a	(value, event) => alert('New date is: ', value)
// ^ onViewChange	Function called when the user navigates from one view to another using drill up button or by clicking a tile.	n/a	({ activeStartDate, view }) => alert('New view is: ', view)
// ^ onClickDay	Function called when the user clicks a day.	n/a	(value, event) => alert('Clicked day: ', value)

// ^ tileClassName	Class name(s) that will be applied to a given calendar item (day on month view, month on year view and so on).	n/a
// String: "class1 class2"
// Array of strings: ["class1", "class2 class3"]
// Function: ({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 3 ? 'wednesday' : null
// ^tileContent	Allows to render custom content within a given calendar item (day on month view, month on year view and so on).

// *** Progress Bar: DATA & STYLING
const progressBarData = {
  total: 5,
  value: 2,
  progress: 'ratio', // ratio, percent
  labelContent: 'Workouts Per Week',
  size: 'medium', // tiny, small, medium, large, big
  color: 'teal' // red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black
}

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {firstName} = props
  const [date, setDate] = useState(null)

  const handleChange = selectedDate => {
    try {
      setDate(selectedDate)
    } catch (error) {
      console.log('error getting date!')
    }
  }

  useEffect(
    () => {
      const fetchWorkoutByMonth = async () => {
        try {
          let today = new Date().toISOString().slice(0, 10)
          console.log(today)

          const {data} = await axios.get(`/api/workouts/month/${today}`)
          console.log(`Fetching workouts for ${today}`, data)
          // if (!data.length) setNoWorkoutMsg('You did not work out on this day.')
          // else setSummary(data)
        } catch (error) {
          console.log('error fetching sets on front end!', error)
        }
      }
      fetchWorkoutByMonth()
    },
    [date]
  )

  return date ? (
    <Redirect to={{pathname: '/summary', state: {date}}} />
  ) : (
    <div>
      <h2>Welcome, {firstName}!</h2>
      <Calendar calendarType="US" onChange={handleChange} />
      <h5>You've logged 3 workouts this week, that's awesome!</h5>
      <br />
      <h3>Your Progress: </h3>
      <div style={{width: `${40}%`}}>
        <ProgressBar data={progressBarData} />
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  console.log('Mapping State to Props', state)
  return {
    firstName: state.user.firstName,
    userId: state.user.id
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  firstName: PropTypes.string
}
