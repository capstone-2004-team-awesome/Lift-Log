const router = require('express').Router()
const {Set, Exercise, User} = require('../db/models')
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
          date: {
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

// update set info
// /api/set/:setId
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

// increment reps by 1
// /api/set/:setId
router.patch('/:setId', async (req, res, next) => {
  try {
    if (req.user) {
      const setId = req.params.setId
      const set = await Set.findOne({
        where: {id: setId}
      })
      if (!set) res.sendStatus(404)
      else {
        await set.update({reps: set.reps + 1})
        res.status(202).json(set)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    next(err)
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

// TODO: consolidate the two post routes and edit in StartWorkout.js - provide req.body

// creating new set via form submission (user manual input)
// used in WorkoutSummary.js
// /api/set
router.post('/', async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user.id

      const {exerciseName, reps, weight, date} = req.body

      if (exerciseName && reps && weight) {
        const exercise = await Exercise.findOne({
          where: {
            name: exerciseName
          }
        })
        const user = await User.findByPk(userId)

        let set = await user.createSet()

        await exercise.addSet(set)

        set = await set.update({
          exerciseName,
          reps,
          weight,
          date,
          completed: true
        })
        res.json(set)
      } else if (exerciseName) {
        const exercise = await Exercise.findOne({
          where: {
            name: exerciseName
          }
        })
        const user = await User.findByPk(userId)

        let set = await user.createSet()

        await exercise.addSet(set)

        set = await set.update({
          exerciseName
        })
        const updatedSet = [exercise, set]
        res.json(updatedSet)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    next(err)
  }
})
