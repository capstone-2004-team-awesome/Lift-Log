import React from 'react'

import {Button, Card} from '@material-ui/core'

const Camera = props => {
  const {pause, stop, play, init} = props

  return (
    <Card style={{width: '100%'}}>
      <Button type="button" onClick={() => init()}>
        Start
      </Button>
      <Button type="button" onClick={() => play()}>
        Play
      </Button>
      <Button type="button" onClick={() => pause()}>
        Pause
      </Button>
      <Button type="button" onClick={() => stop()}>
        Stop
      </Button>
      <div>
        <canvas id="canvas" style={{width: '600px', height: '600px'}} />
      </div>
      <div id="label-container" />
    </Card>
  )
}

export default Camera
