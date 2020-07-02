const Sequelize = require('sequelize')
const db = require('../db')

const Set = db.define('set', {
  weight: {
    type: Sequelize.INTEGER
  },
  reps: {
    type: Sequelize.INTEGER
  }
})

module.exports = Set
