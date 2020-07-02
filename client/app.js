import React from 'react'
import {Navbar} from './components'
import Routes from './routes'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import themeObj from './theme'

const App = () => {
  const themeConfig = createMuiTheme(themeObj)
  return (
    <div>
      <MuiThemeProvider theme={themeConfig}>
        <Navbar />
        <Routes />
      </MuiThemeProvider>
    </div>
  )
}

export default App
