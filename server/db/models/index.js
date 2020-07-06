const User = require('./user')
const Exercise = require('./exercise')
const Set = require('./set')

Set.belongsTo(Exercise)
Exercise.hasMany(Set)
User.hasMany(Set)
Set.belongsTo(User)

module.exports = {
  User,
  Exercise,
  Set
}
