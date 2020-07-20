import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {login} from '../store'
import {
  Grid,
  Card,
  Typography,
  Button,
  CardContent,
  Input,
  Divider,
  sizing
} from '@material-ui/core'

/**
 * COMPONENT
 */

const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <form onSubmit={handleSubmit} name={name}>
      <Grid
        container
        spacing={1}
        align="center"
        alignContent="center"
        direction="column"
        justify="space-between"
      >
        <Grid item xs={6} md={6} lg={6}>
          <Card width="60%">
            <CardContent>
              <Typography variant="h6">
                Email
                <Input name="email" type="text" align="center" />
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="h6">
                Password
                <Input name="password" type="password" />
              </Typography>
            </CardContent>
            <CardContent>
              <Grid item xs={12}>
                <Button type="submit">{displayName}</Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Divider />
        {error && error.response && <div> {error.response.data} </div>}

        <a href="/auth/google">{displayName} with Google</a>
      </Grid>
    </form>
  )
}

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const password = evt.target.password.value

      dispatch(login(email, password))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
