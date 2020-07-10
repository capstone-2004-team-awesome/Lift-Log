const router = require('express').Router()
const {Set, Exercise} = require('../db/models')
const {Op} = require('sequelize')
module.exports = router

// get all sets for a user on a specific date
// /api/set/:date
// :date is in YYYY-MM-DD format
router.get('/:date', async (req, res, next) => {
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
      res.status(200).json(sets)
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

router.delete('/:setId', async (req, res, next) => {
  try {
    if (req.user) {
      const setId = req.params.setId
      const set = await Set.destroy({
        where: {id: setId}
      })
      if (!set) res.status(400).send('Set not found. Nothing to delete.')
      else res.status(204).json(set)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
})
