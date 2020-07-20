/* eslint-disable complexity */
import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import {
  Button,
  Select,
  FormHelperText,
  Grid,
  Divider,
  Typography,
  FormControl,
  OutlinedInput,
  InputLabel,
  TextField
} from '@material-ui/core'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

import themeObj, {thirdColor, fourthColor, grayColor} from '../theme'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
      // marginTop: theme.spacing(2)
    }
  },
  dividerColor: {
    // backgroundColor: grayColor[3]
  },
  dividerSpace: {
    marginBottom: theme.spacing(3)
  },
  inputFieldColor: {
    backgroundColor: '#e8f0fe'
  },
  rowContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
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

  const onSubmit = async () => {
    setSubmitted(true)
    await axios.put(`/auth/${user.id}`, user)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/auth/me')
      const {height} = result.data
      const feet = Math.floor(height / 12)
      const inches = Math.round((height / 12 - feet) * 12)
      setUser({...result.data, feet, inches})
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
      <Grid container spacing={1} alignContent="center">
        <Grid item xs={12}>
          <Typography variant="h2" component="h3" gutterBottom>
            Profile
          </Typography>
        </Grid>

        {/* ******  First Name & LAST Name  ****** */}
        <Grid
          container
          spacing={3}
          className={classes.rowContainer}
          alignContent="center"
        >
          <Grid item xs={6} md={5} lg={4}>
            <FormControl error={fNameHasError} variant="outlined">
              <InputLabel htmlFor="firstName">First Name</InputLabel>
              <OutlinedInput
                id="firstName"
                // className={classes.inputFieldColor}
                label="First Name"
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
          <Grid item xs={6} md={5} lg={4}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="lastName">Last Name</InputLabel>
              <OutlinedInput
                id="lastName"
                label="Last Name"
                value={user.lastName}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* ******  Height, Weight, Sex  ****** */}
        <Grid container spacing={3} className={classes.rowContainer}>
          {/* ******       Height      ****** */}
          <Grid item container spacing={2} xs={8} sm={4} md={4} lg={3}>
            {/* <Grid container spacing={1}> */}
            <Grid item xs={6} md={5} lg={4}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="height">Height</InputLabel>
                <OutlinedInput
                  id="feet"
                  label="Height"
                  inputProps={{min: 0, max: 10}}
                  type="number"
                  value={user.feet}
                  onChange={handleChange}
                />
                <FormHelperText id="filled-helperText" variant="filled">
                  feet
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={5} lg={4}>
              <FormControl variant="outlined">
                <OutlinedInput
                  id="inches"
                  inputProps={{min: 0, max: 11}}
                  type="number"
                  value={user.inches}
                  onChange={handleChange}
         
                />
                <FormHelperText id="filled-helperText" variant="filled">
                  inches
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* </Grid> */}
          </Grid>

          {/* ******       Weight      ****** */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <FormControl error={weightHasError} variant="outlined">
              <InputLabel htmlFor="weight">Weight(lb)</InputLabel>
              <OutlinedInput
                id="weight"
                label="Weight"
                value={user.weight}
                onChange={handleChange}
                inputProps={{min: 0}}
              />
              {weightHasError ? (
                <FormHelperText id="component-error-text">
                  Enter a number
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>

          {/* ******       Sex      ****** */}
          <Grid item xs={6} sm={4} md={3} lg={3}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="sex">Sex</InputLabel>

              <Select
                native
                value={user.sex}
                onChange={handleChange}
                id="sex"
                label="Sex"
              >
                <option aria-label="None" value="" />
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.rowContainer}>
          <Grid item xs={12} sm={10} md={5} lg={4}>
            <FormControl error={emailHasError} variant="outlined">
              <InputLabel htmlFor="email">E-mail</InputLabel>
              <OutlinedInput
                id="email"
                label="E-mail"
                value={user.email}
                onChange={handleChange}
              />
              {emailHasError ? (
                <FormHelperText id="component-error-text">
                  Enter a valid e-mail
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={10} md={5} lg={4}>
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
      </Grid>

      <Divider classes={{root: classes.dividerColor}} />

      <Grid
        container
        spacing={1}
        className={classes.rowContainer}
        alignContent="center"
      >
        <Grid
          item
          xs={12}
          className={clsx(classes.rowContainer, classes.dividerSpace)}
        >
          <Typography variant="h4" component="h4">
            Goals
          </Typography>
          <Typography variant="body1">
            How many days do you aim to work out per week?
          </Typography>
        </Grid>

        <Grid
          container
          item
          xs={12}
          sm={10}
          md={7}
          className={clsx(classes.rowContainer)}
        >
          <Grid
            item
            xs={12}
            sm={10}
            md={6}
            // lg={12}
            // classes={{root: classes.goalColor}}
            // className={clsx(classes.rowContainer)}
          >
            <FormControl error={goalHasError} variant="outlined">
              <InputLabel htmlFor="goal">Enter your goal!</InputLabel>
              <OutlinedInput
                id="goal"
                // label="Enter your goal!"
                type="number"
                min="0"
                max="7"
                value={user.goal}
                aria-describedby="component-error-text"
                label="Days per Week"
                onChange={handleChange}
                fullWidth={true}
                // variant="filled"
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
          </Grid>
          <Grid item xs={12} sm={10} md={6} lg={6}>
            <Button
              variant="contained"
              type="submit"
              disabled={
                goalHasError || fNameHasError || weightHasError || emailHasError
              }
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
