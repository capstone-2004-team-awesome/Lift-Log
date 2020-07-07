const router = require('express').Router()
const {Set, User, Exercise} = require('../db/models')
module.exports = router

// TODO: change api route to api/set instead of exercise??

// update set (increment reps)
// exercise/update/:exerciseId/:userId
router.put('/update/:exerciseId/:userId', async (req, res, next) => {
  try {
    // TODO: will need to add Date field later on
    const exerciseId = req.params.exerciseId
    const userId = req.params.userId

    const [set, created] = await Set.findOrCreate({
      where: {
        userId,
        exerciseId,
        completed: false
      }
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

// create a new set
// exercise/create/:exerciseId/:userId
router.post('/create/:exerciseId/:userId', async (req, res, next) => {
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

    // TODO: get weight from previous set here?

    const exercise = await Exercise.findByPk(exerciseId)
    const user = await User.findByPk(userId)

    const set = await user.createSet()

    const updatedSet = await exercise.addSet(set)

    res.json(updatedSet)
  } catch (err) {
    next(err)
  }
})
