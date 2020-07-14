import React, {useState, useEffect, handleSubmit} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Button, Select, FormHelperText, Box} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(4)
    }
  }
}))

export default function UserProfile() {
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    height: '',
    weight: '',
    sex: '',
    email: '',
    goal: ''
  })
  const [goalHasError, setGoalError] = useState(false)
  const [fNameHasError, setNameError] = useState(false)
  const [weightHasError, setWeightError] = useState(false)
  const [emailHasError, setEmailError] = useState(false)
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
    const {data} = await axios.put(`/auth/${user.id}`, user)
    setUser(data)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/auth/me')
      setUser(result.data)
    }

    fetchData()
  }, [])

  return (
    <form
      onSubmit={() => onSubmit(user)}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      {user ? <h3>PROFILE</h3> : <h3>SIGN UP</h3>}
      <FormControl error={fNameHasError}>
        <InputLabel htmlFor="component-simple">First Name</InputLabel>
        <Input id="firstName" value={user.firstName} onChange={handleChange} />
        {fNameHasError ? (
          <FormHelperText id="component-error-text">
            Field cannot be empty
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Last Name</InputLabel>
        <Input id="lastName" value={user.lastName} onChange={handleChange} />
      </FormControl>
      <FormControl error={weightHasError}>
        <InputLabel htmlFor="component-simple">Weight(lb)</InputLabel>
        <Input id="weight" value={user.weight} onChange={handleChange} />
        {weightHasError ? (
          <FormHelperText id="component-error-text">
            Enter a number
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Height</InputLabel>
        <Input id="height" value={user.height} onChange={handleChange} />
        {/* <small>Height</small>
        <TextField
          id="height"
          label="Feet"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="standard-number"
          label="Inches"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        /> */}
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="sex">Sex</InputLabel>
        <Select native value={user.sex} onChange={handleChange} id="sex">
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </Select>
      </FormControl>
      <FormControl error={emailHasError}>
        <InputLabel htmlFor="component-simple">E-mail</InputLabel>
        <Input id="email" value={user.email} onChange={handleChange} />
        {emailHasError ? (
          <FormHelperText id="component-error-text">
            Enter a valid e-mail
          </FormHelperText>
        ) : null}
      </FormControl>
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
      />

      <FormControl error={goalHasError}>
        <InputLabel htmlFor="goal">Goal (X per week)</InputLabel>
        <Input
          id="goal"
          value={user.goal}
          aria-describedby="component-error-text"
          onChange={handleChange}
        />
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
        disabled={
          goalHasError || fNameHasError || weightHasError || emailHasError
        }
      >
        Submit
      </Button>
    </form>
  )
}
