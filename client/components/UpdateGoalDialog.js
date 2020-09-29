import React, {useState, useEffect} from 'react'
import {withStyles} from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import CloseIcon from '@material-ui/icons/Close'
import {
  Button,
  Dialog,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
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
  const {onClose, onClickOpen, userGoal: userGoalProp, open} = props
  const [goalValue, setGoalValue] = useState(userGoalProp)
  const [goalHasError, setGoalError] = useState(false)

  useEffect(
    () => {
      if (!open) {
        setGoalValue(userGoalProp)
      }
    },
    [userGoalProp, open]
  )

  const handleChange = event => {
    if (event.target.id === 'goal') {
      if (isNaN(event.target.value)) {
        setGoalError(true)
      } else {
        setGoalError(false)
      }
    }
    setGoalValue(event.target.value)
  }
  const handleCancel = () => {
    onClose()
  }
  const handleOkay = () => {
    onClose(goalValue)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={onClickOpen}>
        Select Goal
      </Button>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          Select a Goal
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            How many days per week would you like to workout?
          </Typography>
          <Typography variant="body2" gutterBottom>
            If you are new to working out, it is best to start small. Set a goal
            that is achievable, not aspirational. Once you are consistently
            achieving your weekly goals, it's time to adjust!
          </Typography>
          <div>
            <form noValidate autoComplete="off">
              <FormControl error={goalHasError}>
                <InputLabel htmlFor="goal">Enter your goal!</InputLabel>
                <Input
                  id="goal"
                  value={goalValue}
                  aria-describedby="component-error-text"
                  label="Days per week"
                  onChange={handleChange}
                  fullWidth={true}
                  variant="filled"
                />
                <FormHelperText id="filled-helperText" variant="filled">
                  Days per week
                </FormHelperText>
                {goalHasError ? (
                  <FormHelperText id="component-error-text">
                    Enter a number
                  </FormHelperText>
                ) : null}
              </FormControl>
            </form>
            {/* {bottom of dialog box!} */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCancel}
            color="secondary"
            disabled={goalHasError}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleOkay}
            color="primary"
            disabled={goalHasError}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
