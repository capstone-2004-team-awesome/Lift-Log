const router = require('express').Router()
const {Set, Exercise} = require('../db/models')
const {Op} = require('sequelize')
module.exports = router

// get all sets for a user
// /api/set/:date
router.get('/:date', async (req, res, next) => {
  // :date is in YYYY-MM-DD format
  try {
    if (req.user) {
      const userId = req.user.id

      const year = req.params.date.slice(0, 4)
      const month = req.params.date.slice(5, 7) - 1 // month is from 0 - 11
      const day = req.params.date.slice(8)

      const dateInMs = Date.UTC(year, month, day)

      const sets = await Set.findAll({
        where: {
          userId,
          createdAt: {
            [Op.lt]: new Date(dateInMs + 60 * 60 * 24 * 1000), // plus one day
            [Op.gte]: new Date(dateInMs)
          }
        },
        include: [{model: Exercise}]
      })
      if (!sets.length) res.status(400).send('No workouts found on that date.')
      else res.status(200).json(sets)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:setId', async (req, res, next) => {
  try {
    if (req.user) {
      const setId = req.params.setId
      // const {weight, reps} = req.body
      // req.body = {weight: XX, reps: XX}
      const set = await Set.update(req.body, {
        where: {id: setId},
        returning: true,
        plain: true
      })
      if (!set.length) res.status(304).send('There were no sets updated.')
      else res.status(202).json(set)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
})
