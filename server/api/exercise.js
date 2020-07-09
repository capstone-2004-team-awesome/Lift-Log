const router = require('express').Router()
const {Set, User, Exercise} = require('../db/models')
module.exports = router

// TODO: change api route to api/set instead of exercise??

// update set (increment reps)
// exercise/update/:exerciseId/:userId
router.put('/update/:exerciseId/:userId', async (req, res, next) => {
  try {
    const exerciseId = req.params.exerciseId
    const userId = req.params.userId

    const [set, created] = await Set.findOrCreate({
      where: {
        userId,
        exerciseId,
        completed: false
      },
      include: [
        {
          model: Exercise,
          attributes: ['name']
        }
      ]
    })
    // if set is found - increment reps
    if (!created) {
      await set.update({reps: set.reps + 1})
    }
    res.json(set)
  } catch (err) {
    next(err)
  }
})

// set = completed
// exercise/complete/:exerciseId/:userId
router.put('/complete/:exerciseId/:userId', async (req, res, next) => {
  try {
    const exerciseId = req.params.exerciseId
    const userId = req.params.userId

    const prevSet = await Set.findOne({
      where: {
        userId,
        exerciseId,
        completed: false
      }
    })

    if (prevSet) {
      await prevSet.update({completed: true})
    }
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})

// create a new set
// exercise/create/:exerciseId/:userId
router.post('/create/:exerciseName/:userId', async (req, res, next) => {
  try {
    const exerciseName = req.params.exerciseName
    const userId = req.params.userId

    // TODO: get weight from previous set here?

    const exercise = await Exercise.findOne({
      where: {
        name: exerciseName
      }
    })
    const user = await User.findByPk(userId)

    const set = await user.createSet()

    await exercise.addSet(set)

    const updatedSet = [exercise, set]
    res.json(updatedSet)
  } catch (err) {
    next(err)
  }
})
