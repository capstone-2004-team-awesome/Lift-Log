'use strict'

const db = require('../server/db')
const {User, Exercise, Set} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({firstName: 'Cody', email: 'cody@email.com', password: '123'}),
    User.create({
      firstName: 'Cody',
      email: 'murphy@email.com',
      password: '123'
    })
  ])

  const bicepCurls = await Exercise.create({name: 'Bicep Curl - Up'})
  await Exercise.create({name: 'Squat'})

  await Set.create({weight: 20, reps: 5})

  const user = await User.findByPk(1)
  user.addSet(1)

  await bicepCurls.addSet(1) //bicep curl

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
