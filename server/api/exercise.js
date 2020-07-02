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
    const [set, created] = await Set.findOrCreate({
      where: {
        userId,
        exerciseId
      }
    })
    console.log('FIND OR CREATE SET', set)
    // if set is found - increment reps
    if (!created) {
      await set.update({reps: set.reps + 1})
    }
    res.json(set)
    console.log('NEW SET OBJECT', set)
    // if set was created (set[1]====true) then do nothing
    // user.addExercise(set[0])
  } catch (err) {
    next(err)
  }
})
