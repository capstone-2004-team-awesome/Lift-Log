import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import Calendar from 'react-calendar'
// ^ onChange	Function called when the user clicks an item (day on month view, month on year view and so on) on the most detailed view available.	n/a	(value, event) => alert('New date is: ', value)
// ^ onViewChange	Function called when the user navigates from one view to another using drill up button or by clicking a tile.	n/a	({ activeStartDate, view }) => alert('New view is: ', view)
// ^ onClickDay	Function called when the user clicks a day.	n/a	(value, event) => alert('Clicked day: ', value)

// ^ tileClassName	Class name(s) that will be applied to a given calendar item (day on month view, month on year view and so on).	n/a
// String: "class1 class2"
// Array of strings: ["class1", "class2 class3"]
// Function: ({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 3 ? 'wednesday' : null
// ^tileContent	Allows to render custom content within a given calendar item (day on month view, month on year view and so on).

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {firstName} = props

  return (
    <div>
      <h2>Welcome, {firstName}!</h2>
      <Calendar calendarType="US" />
      <h5>You've logged 3 workouts this week, that's awesome!</h5>
      <br />
      <h3>Your Progress: </h3>
      <p>Progress Bar (eventually)</p>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  console.log('Mapping State to Props', state)
  return {
    firstName: state.user.firstName
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  firstName: PropTypes.string
}
