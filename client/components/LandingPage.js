import React from 'react'
import Typography from '@material-ui/core/Typography'

const LandingPage = () => {
  return (
    <div style={{textAlign: 'center'}}>
      <Typography variant="h4" style={{paddingBottom: '1rem'}}>
        Track your weightlifting exercises automatically.
      </Typography>
      <Typography variant="h6" paragraph={true}>
        Turn your camera on while exercising, and Lift Log will be able to
        detect, recognize, and track your workout.
      </Typography>
      <Typography variant="h6" paragraph={true}>
        Sign up to try today!
      </Typography>
      <img
        src="https://drive.google.com/uc?export=view&id=1hfiXjPGt5Z6rQuh5nz-8L0hs0Fi9UifL"
        style={{width: '80vw'}}
      />
    </div>
  )
}

export default LandingPage
