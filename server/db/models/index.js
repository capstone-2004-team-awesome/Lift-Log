const db = require('../db')
const User = require('./user')
const Exercise = require('./exercise')
const Set = require('./set')

User.belongsToMany(Exercise, {through: Set})
Exercise.belongsToMany(User, {through: Set})

module.exports = {
  User,
  Exercise,
  Set
}
