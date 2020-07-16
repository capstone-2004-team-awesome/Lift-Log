'use strict'
var faker = require('faker')

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

  let userSeed = []
  let sexOptions = ['female', 'male', 'other']
  for (let i = 0; i < 100; i++) {
    userSeed.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      sex: sexOptions[Math.floor(Math.random() * sexOptions.length)],
      weight: Math.floor(Math.random() * 301) + 80,
      height: Math.floor(Math.random() * 97) + 36,
      goal: Math.floor(Math.random() * 8)
    })
  }
  await Promise.all(
    userSeed.map(user => {
      return User.create(user)
    })
  )

  const exercises = await Promise.all([
    Exercise.create({name: 'Bicep Curl'}),
    Exercise.create({name: 'Squat'}),
    Exercise.create({name: 'Glute Bridge'})
  ])

  let setSeed = []
  for (let i = 0; i < 300; i++) {
    setSeed.push({
      weight: Math.floor(Math.random() * 201),
      reps: Math.floor(Math.random() * 20) + 1,
      completed: true,
      date: faker.date.between(new Date('2020-06-01'), new Date())
    })
  }

  const sets = await Promise.all(
    setSeed.map(set => {
      return Set.create(set)
    })
  )

  await Promise.all(
    sets.map((set, idx) => {
      if (idx < 100) {
        return user1.addSet(set)
      } else if (idx >= 100 && idx < 200) {
        return user2.addSet(set)
      } else {
        return user3.addSet(set)
      }
    })
  )

  await Promise.all(
    sets.map(set => {
      let index = Math.floor(Math.random() * exercises.length)
      return exercises[index].addSet(set)
    })
  )

  console.log(`seeded successfully!`)
  console.log(`seeded ${userSeed.length + 3} users successfully!`)
  console.log(`seeded ${setSeed.length} sets successfully!`)
  console.log(`seeded ${exercises.length} exercises successfully!`)
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
