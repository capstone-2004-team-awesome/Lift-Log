const Sequelize = require('sequelize')
const db = require('../db')

const Set = db.define('set', {
  weight: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  reps: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  }
})

module.exports = Set
