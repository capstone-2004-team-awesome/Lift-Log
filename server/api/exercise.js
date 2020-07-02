const router = require('express').Router()
const {Set} = require('../db/models')
module.exports = router

router.put('/:exerciseId/:userId', async (req, res, next) => {
  try {
    console.log('incrementing reps in set!')
    // const user = await User.findByPk(1)
    // TODO: will need to add Date field later on
    const exerciseId = req.params.exerciseId
    const userId = req.params.userId
    const set = await Set.findOrCreate({
      where: {
        userId,
        exerciseId
      }
    })
    console.log('FIND OR CREATE SET', set)
    // if set is found - increment reps
    if (!set[1]) {
      await set[0].update({reps: set.reps + 1})
    }
    res.json(set[0])
    console.log('NEW SET OBJECT', set[0])
    // if set was created (set[1]====true) then do nothing
    // user.addExercise(set[0])
  } catch (err) {
    next(err)
  }
})
