import React, {useState} from 'react'
import {Navbar} from './components'
// import Routes from './routes'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import themeObj from './theme'
import WorkoutContext from './context/WorkoutContext'

const App = () => {
  const [workoutStatus, setWorkoutStatus] = useState({
    paused: false,
    stopped: false
  })

  const themeConfig = createMuiTheme(themeObj)
  return (
    <div>
      <WorkoutContext.Provider value={{workoutStatus, setWorkoutStatus}}>
        <MuiThemeProvider theme={themeConfig}>
          <Navbar />
          {/* <Routes /> */}
        </MuiThemeProvider>
      </WorkoutContext.Provider>
    </div>
  )
}

export default App
