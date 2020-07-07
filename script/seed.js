'use strict'

const db = require('../server/db')
const {User, Exercise, Set} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const [user1, user2, user3] = await Promise.all([
    User.create({
      firstName: 'Cody',
      email: 'cody@email.com',
      password: '123',
      sex: 'male',
      weight: 25,
      height: 16
    }),
    User.create({
      firstName: 'Murphy',
      email: 'murphy@email.com',
      password: '123',
      sex: 'female',
      weight: 135,
      height: 66
    }),
    User.create({
      firstName: 'Bright',
      lastName: 'Future',
      email: 'bright_future@email.com',
      password: 'bright',
      sex: 'other',
      weight: 35,
      height: 38
    })
  ])

  const [bicepCurls, squats] = await Promise.all([
    Exercise.create({name: 'Bicep Curl - Up'}),
    Exercise.create({name: 'Squat'})
  ])

  const [set1, set2, set3, set4, set5, set6] = await Promise.all([
    Set.create({weight: 20, reps: 5, completed: true}),
    Set.create({weight: 5, reps: 12, completed: true}),
    Set.create({weight: 65, reps: 15, completed: true}),
    Set.create({weight: 40, reps: 6, completed: true}),
    Set.create({weight: 80, reps: 8, completed: true}),
    Set.create({weight: 75, reps: 9, completed: true})
  ])

  // *** User #1 ASSOCIATIONS
  await user1.addSet([set1, set2])
  await bicepCurls.addSet(set1)
  await squats.addSet(set2)

  // *** User #2 ASSOCIATIONS
  await user2.addSet(set3)
  await squats.addSet(set3)

  // *** User #3 ASSOCIATIONS
  await user3.addSet([set4, set5, set6])
  await bicepCurls.addSet(set4)
  await squats.addSet([set5, set6])

  // console.log(`seeded ${userss.length} users`)
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
