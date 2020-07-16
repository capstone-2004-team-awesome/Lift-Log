import React, {useState} from 'react'
import {withStyles} from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import CloseIcon from '@material-ui/icons/Close'
import {
  Button,
  Dialog,
  Select,
  FormControl,
  Input,
  InputLabel,
  TextField,
  FormHelperText,
  Grid,
  Divider,
  IconButton,
  Typography
} from '@material-ui/core'
import axios from 'axios'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose, ...other} = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions)

export default function UpdateGoalDialog(props) {
  const [open, setOpen] = useState(false)
  const [userGoal, setUserGoal] = useState({userId: props.userId, goal: ''})
  const [goalHasError, setGoalError] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = event => {
    if (event.target.id === 'goal') {
      if (isNaN(event.target.value)) {
        setGoalError(true)
      } else {
        setGoalError(false)
      }
    }
    setUserGoal({...userGoal, [event.target.id]: event.target.value})
  }
  const onSubmit = async user => {
    const {data} = await axios.put(`/auth/${user.id}`, user)
    console.log('Incoming user data from dialog: ', data)
    setUserGoal(data)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Select Goal
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Select a Goal
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            How many times per week would you like to workout?
          </Typography>
          <Typography variant="body2" gutterBottom>
            If you are new to working out, it is best to start small. Set a goal
            that is achievable, not aspirational. Once you are consistently
            achieving your weekly goals, it's time to adjust!
          </Typography>
          {/* <Typography gutterBottom> */}
          <div>
            <form
              onSubmit={() => onSubmit(userGoal)}
              // className={classes.root} //from UserProfile.js
              // className="root"
              noValidate
              autoComplete="off"
            >
              <FormControl error={goalHasError}>
                <InputLabel htmlFor="goal">Enter your goal!</InputLabel>
                <Input
                  id="goal"
                  value={userGoal.goal}
                  aria-describedby="component-error-text"
                  label="Times per week"
                  onChange={handleChange}
                  fullWidth={true}
                  variant="filled"
                />
                <FormHelperText id="filled-helperText" variant="filled">
                  Times per week
                </FormHelperText>
                {goalHasError ? (
                  <FormHelperText id="component-error-text">
                    Enter a number
                  </FormHelperText>
                ) : null}
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={goalHasError}
              >
                Submit
              </Button>
            </form>
            {/* {bottom of dialog box!} */}
          </div>
          {/* </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            color="primary"
            disabled={goalHasError}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
