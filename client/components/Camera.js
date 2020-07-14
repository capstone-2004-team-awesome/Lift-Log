import React from 'react'
import {Button, Card, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    [theme.breakpoints.up('sm')]: {
      width: '2rem'
    },
    [theme.breakpoints.down('sm')]: {
      width: '1rem'
    },
    padding: '3px 8px'
  }
}))

const Camera = props => {
  const classes = useStyles()
  const {pause, stop, play, init} = props

  return (
    <Card style={{width: '100%'}}>
      <Typography variant="body1" style={{textAlign: 'center'}}>
        CAMERA FUNCTIONS
      </Typography>
      <Grid container item spacing={1} justify="center">
        <Grid item>
          <Button
            type="button"
            onClick={() => init()}
            className={classes.button}
          >
            Start
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="button"
            onClick={() => play()}
            className={classes.button}
          >
            Play
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="button"
            onClick={() => pause()}
            className={classes.button}
          >
            Pause
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="button"
            onClick={() => stop()}
            className={classes.button}
          >
            Stop
          </Button>
        </Grid>
      </Grid>
      <div>
        <canvas id="canvas" />
      </div>
      <div id="label-container" />
    </Card>
  )
}

export default Camera
