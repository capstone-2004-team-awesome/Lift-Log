import React, {useState, useEffect, handleSubmit} from 'react'
import PropTypes from 'prop-types'
import {connect, useSelector} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core'
import FilledInput from '@material-ui/core/FilledInput'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
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
  const [user, setUser] = React.useState({
    id: '',
    firstName: '',
    lastName: '',
    height: '',
    weight: '',
    sex: '',
    email: '',
    goal: ''
  })

  const classes = useStyles()

  const handleChange = event => {
    setUser({...user, [event.target.id]: event.target.value})
  }

  const onSubmit = async user => {
    const {data} = await axios.put(`/api/users/${user.id}`, user)
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
      id="user-profile"
      onSubmit={() => onSubmit(user)}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <h3>PROFILE</h3>
      <FormControl>
        <InputLabel htmlFor="component-simple">First Name</InputLabel>
        <Input id="firstName" value={user.firstName} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Last Name</InputLabel>
        <Input id="lastName" value={user.lastName} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Weight(lb)</InputLabel>
        <Input id="weight" value={user.weight} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Height(ft, in)</InputLabel>
        <Input id="height" value={user.height} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Sex</InputLabel>
        <Input id="sex" value={user.sex} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">E-mail</InputLabel>
        <Input id="email" value={user.email} onChange={handleChange} />
      </FormControl>
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
      />
      <FormControl>
        <InputLabel htmlFor="component-simple">Goal (X per week)</InputLabel>
        <Input id="goal" value={user.goal} onChange={handleChange} />
      </FormControl>

      <Button variant="contained" type="submit">
        Submit
      </Button>
    </form>
  )
}
