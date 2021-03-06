const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findOne({where: {id: userId}})

    let userInfo
    if (req.body.feet) {
      const {inches, feet} = req.body
      const height = parseInt(feet, 10) * 12 + parseInt(inches, 10)
      userInfo = {...req.body, height}
    } else {
      userInfo = {...req.body}
    }

    const updatedUser = await user.update(userInfo, {
      returning: true,
      plain: true
    })

    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.use('/google', require('./google'))
