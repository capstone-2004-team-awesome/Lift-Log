const router = require('express').Router()
const {Set, Exercise} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

//#region   date calculation utility funcs
const extractYearMonth = date => {
  return date.slice(0, 7)
}
const yearNum = date => {
  return Number(date.slice(0, 4))
}
const monthNum = date => {
  return Number(date.slice(5, 7))
}
const dayNum = date => {
  return Number(date.slice(8))
}

//#endregion

// *** GET monthly workout count (grouped by day) for a given month
// /api/workouts/month/:date
// :date is in YYYY-MM-DD format
router.get('/month/:date', async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user.id
      // const userId = 3

      // const thisMonth = req.params.date.slice(0, 7)
      const thisMonth = extractYearMonth(req.params.date)
      const nextMonth = `${yearNum(req.params.date)}-${monthNum(
        req.params.date
      ) + 1}`

      const workouts = await Set.findAll({
        where: {
          userId,
          date: {
            [Sequelize.Op.gte]: new Date(thisMonth),
            [Sequelize.Op.lt]: new Date(nextMonth)
          }
        },
        attributes: [
          // 'date',
          [Sequelize.literal(`extract(day from date)`), 'day'],
          [Sequelize.literal(`COUNT(*)`), 'setCount']
          // [Sequelize.literal(`extract(week from date)`), 'week'],
        ],
        group: [Sequelize.literal(`extract(day from date)`)]
        // group: [Sequelize.literal(`extract(day from date)`), 'day']
      })

      res.status(200).json(workouts)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
})

// *** GET weekly workout count (grouped by day) for a given week
// /api/workouts/week/:date
// :date is in YYYY-MM-DD format
router.get('/week/:date', async (req, res, next) => {
  try {
    // if (req.user) {
    //     const userId = req.user.id
    const userId = 3

    const searchDate = req.params.date
    // const searchDate = new Date(today)
    const dateInMs = Date.UTC(
      yearNum(searchDate),
      monthNum(searchDate),
      dayNum(searchDate)
    )
    const newDate = new Date(dateInMs).getDay
    // const theDay = newDate.getDay()  // Sunday - Saturday : 0 - 6
    // *** find start of the week (day 0) & end of the week (day 6)

    const thisMonth = extractYearMonth(searchDate)
    const nextMonth = `${yearNum(req.params.date)}-${monthNum(req.params.date) +
      1}`

    const workouts = await Set.findAll({
      where: {
        userId,
        date: {
          [Sequelize.Op.gte]: new Date(thisMonth),
          [Sequelize.Op.lt]: new Date(nextMonth)
        }
        // date: [Sequelize.literal(`extract(week from ${searchDate})`)]
        // date: {
        //     [Sequelize.Op.eq]: [Sequelize.literal(`extract(week from ${searchDate})`)]
        // }
      },
      attributes: [
        // [Sequelize.literal(`extract(day from date)`), 'day'],
        // [Sequelize.literal(`extract(ISODOW from date)`), 'dayOfWeek'],
        [Sequelize.literal(`extract(week from date)`), 'week'],
        [Sequelize.literal(`COUNT(*)`), 'setCount']
      ],
      // group: [Sequelize.literal(`extract(day from date)`)],
      // group: [Sequelize.literal(`extract(ISODOW from date)`)]
      group: [Sequelize.literal(`extract(week from date)`)]
    })

    res.status(200).json(workouts)
    // }
    // else {
    //     res.sendStatus(404)
    // }
  } catch (error) {
    next(error)
  }
})

// *** GET a single workout (all sets on a specific date)
// /api/workouts/day/:date
// :date is in YYYY-MM-DD format
router.get('/day/:date', async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user.id

      const year = yearNum(req.params.date)
      const month = req.params.date.slice(5, 7) - 1 // month is from 0 - 11
      const day = dayNum(req.params.date)

      const dateInMs = Date.UTC(year, month, day)

      const sets = await Set.findAll({
        where: {
          userId,
          date: {
            [Sequelize.Op.lt]: new Date(dateInMs + 60 * 60 * 24 * 1000), // plus one day
            [Sequelize.Op.gte]: new Date(dateInMs)
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

// // Returns the ISO week of the date.
// Date.prototype.getWeek = function() {
//     var date = new Date(this.getTime());
//     date.setHours(0, 0, 0, 0);
//     // Thursday in current week decides the year.
//     date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//     // January 4 is always in week 1.
//     var week1 = new Date(date.getFullYear(), 0, 4);
//     // Adjust to Thursday in week 1 and count number of weeks from date to week1.
//     return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
//                           - 3 + (week1.getDay() + 6) % 7) / 7);
//   }

//   // Returns the four-digit year corresponding to the ISO week of the date.
//   Date.prototype.getWeekYear = function() {
//     var date = new Date(this.getTime());
//     date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//     return date.getFullYear();
//   }
