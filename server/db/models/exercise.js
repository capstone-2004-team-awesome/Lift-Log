const Sequelize = require('sequelize')
const db = require('../db')

const Exercise = db.define('exercise', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Exercise
