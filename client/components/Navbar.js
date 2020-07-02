import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

//#region
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
//#endregion

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    color: 'white'
  }
}))

const Navbar = ({handleClick, isLoggedIn}) => {
  const classes = useStyles()
  const [state, setState] = useState({
    left: false
  })

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({...state, [anchor]: open})
  }

  const loggedInList = anchor => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <Typography variant="overline">WORKOUTS</Typography>
        </ListItem>

        <ListItem button component={Link} to="/start">
          <ListItemIcon>
            <PlayCircleFilledIcon />
          </ListItemIcon>
          <ListItemText primary="Start Workout" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem>
          <Typography variant="overline">ACCOUNT</Typography>
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn ? (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer('left', true)}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Drawer
            anchor="left"
            open={state.left}
            onClose={toggleDrawer('left', false)}
          >
            {isLoggedIn ? loggedInList('left') : null}
          </Drawer>

          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
          >
            Lift Log
          </Typography>
          {isLoggedIn ? null : (
            <div>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                Signup
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
