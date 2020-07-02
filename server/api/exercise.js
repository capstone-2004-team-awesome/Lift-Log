const router = require('express').Router()
const {Set} = require('../db/models')
module.exports = router

router.put('/:exerciseId/:userId', async (req, res, next) => {
  try {
    // TODO: will need to add Date field later on
    const exerciseId = req.params.exerciseId
    const userId = req.params.userId
    const [set, created] = await Set.findOrCreate({
      where: {
        userId,
        exerciseId
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
