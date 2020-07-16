import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Button, Select, FormHelperText, Grid, Divider} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(6)
    }
  },
  dividerColor: {
    backgroundColor: '#00B5AD'
  }
}))

export default function UserProfile() {
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    feet: '',
    inches: '',
    weight: '',
    sex: '',
    email: '',
    goal: '',
    password: ''
  })

  const [goalHasError, setGoalError] = useState(false)
  const [fNameHasError, setNameError] = useState(false)
  const [weightHasError, setWeightError] = useState(false)
  const [emailHasError, setEmailError] = useState(false)
  const [submitted, setSubmitted] = useState()
  const classes = useStyles()

  const handleChange = event => {
    if (event.target.id === 'goal') {
      if (isNaN(event.target.value)) {
        setGoalError(true)
      } else {
        setGoalError(false)
      }
    }
    if (event.target.id === 'firstName') {
      if (!event.target.value) {
        setNameError(true)
      } else {
        setNameError(false)
      }
    }

    if (event.target.id === 'weight') {
      if (isNaN(event.target.value)) {
        setWeightError(true)
      } else {
        setWeightError(false)
      }
    }
    if (event.target.id === 'email') {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)
      ) {
        setEmailError(false)
      } else {
        setEmailError(true)
      }
    }
    setUser({...user, [event.target.id]: event.target.value})
  }

  const onSubmit = async user => {
    setSubmitted(true)
    const {data} = await axios.put(`/auth/${user.id}`, user)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/auth/me')
      setUser(result.data)
    }

    fetchData()
  }, [])
  return submitted ? (
    <Redirect to={{pathname: '/home'}} />
  ) : (
    <form
      id="user-profile"
      onSubmit={() => onSubmit(user)}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      {<h3>PROFILE</h3>}
      <Grid container spacing={1} alignContent="center">
        <Grid item xs={6} md={6} lg={6}>
          <FormControl error={fNameHasError}>
            <InputLabel htmlFor="component-simple">First Name</InputLabel>
            <Input
              id="firstName"
              value={user.firstName}
              onChange={handleChange}
            />
            {fNameHasError ? (
              <FormHelperText id="component-error-text">
                Field cannot be empty
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <FormControl error={weightHasError}>
            <InputLabel htmlFor="component-simple">Weight(lb)</InputLabel>
            <Input id="weight" value={user.weight} onChange={handleChange} />
            {weightHasError ? (
              <FormHelperText id="component-error-text">
                Enter a number
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <FormControl>
            <InputLabel htmlFor="component-simple">Last Name</InputLabel>
            <Input
              id="lastName"
              value={user.lastName}
              onChange={handleChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <FormControl>
            {/* <InputLabel htmlFor="component-simple">Height(ft.in)</InputLabel>
            <Input id="height" value={user.height} onChange={handleChange} /> */}
            <InputLabel htmlFor="height">Height</InputLabel>
            <Input id="height.feet" value={user.feet} onChange={handleChange} />
            <FormHelperText id="filled-helperText" variant="filled">
              feet
            </FormHelperText>
            <Input
              id="height.inches"
              value={user.inches}
              onChange={handleChange}
            />
            <FormHelperText id="filled-helperText" variant="filled">
              inches
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <FormControl error={emailHasError}>
            <InputLabel htmlFor="component-simple">E-mail</InputLabel>
            <Input id="email" value={user.email} onChange={handleChange} />
            {emailHasError ? (
              <FormHelperText id="component-error-text">
                Enter a valid e-mail
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="sex">Sex</InputLabel>
            <Select native value={user.sex} onChange={handleChange} id="sex">
              <option aria-label="None" value="" />
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={user.password}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Divider classes={{root: classes.dividerColor}} />
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          align="justify"
          classes={{root: classes.goalColor}}
          align="stretch"
        >
          <FormControl error={goalHasError}>
            <InputLabel htmlFor="goal">Enter your goal!</InputLabel>
            <Input
              id="goal"
              value={user.goal}
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
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              goalHasError || fNameHasError || weightHasError || emailHasError
            }
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
