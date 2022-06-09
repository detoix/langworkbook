const { Pool } = require('pg')
const { getStudents, getExercises } = require("./mocks")

const dropExercisesTable = client => new Promise((resolve, reject) => {
  client
    .query('DROP TABLE IF EXISTS exercises')
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const createExercisesTable = client => new Promise((resolve, reject) => {
  client
    .query('CREATE TABLE IF NOT EXISTS exercises ( \
      id SERIAL PRIMARY KEY, \
      takenBy integer[], \
      tags text[], \
      data jsonb \
      )')
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const flattenExercises = exercises => exercises.flatMap(exercise => [exercise.id, [], exercise.tags, exercise.data])

const insertExercises = client => new Promise((resolve, reject) => {
  let exercises = getExercises()
  let flatMap = flattenExercises(exercises)
  let ids = flatMap.reduce((previous, current, index) => (previous != 0 ? previous : "$1") + ", $" + (index + 1))

  // console.log(flatMapOfExerciseData.reduce((previous, current, index) => (index % 4 == 0 ? "(" : "") + (previous != 0 ? previous : "$1") + ", $" + (index + 1) + (index % 4 == 3 ? ")" : "")))

  let query = "INSERT INTO exercises(id, takenBy, tags, data) VALUES " +
    exercises.map((exercise, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
    " ON CONFLICT DO NOTHING"

  client
    .query(query, flatMap)
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const dropActionsTable = client => new Promise((resolve, reject) => {
  client
    .query('DROP TABLE IF EXISTS actions')
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const createActionsTable = client => new Promise((resolve, reject) => {
  client
    .query('CREATE TABLE IF NOT EXISTS actions ( \
      id SERIAL PRIMARY KEY, \
      timestamp TIMESTAMP DEFAULT NOW(), \
      student integer, \
      exercise integer, \
      result jsonb \
      )')
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const flattenActions = actions => actions.flatMap(action => [action.id, action.student, action.exercise, action.result])

const insertActions = client => new Promise((resolve, reject) => {
  let actions = [
    {
      id: 0,
      student: 0,
      exercise: 0,
      result: {
        answer: ["encontre", "iba"],
        correct: 1
      }
    },
    {
      id: 1,
      student: 0,
      exercise: 0,
      result: {
        answer: ["encontre", "fue"],
        correct: 0.5
      }
    }
  ]
  let flatMap = flattenActions(actions)

  let query = "INSERT INTO actions(id, student, exercise, result) VALUES " +
    actions.map((action, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
    " ON CONFLICT DO NOTHING"

  client
    .query(query, flatMap)
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const createPool = () => {
  let pool = new Pool({ connectionString: "postgres://xd:xd@localhost:5432/tmp" })
  
  pool
    .connect()
    .then(client => dropExercisesTable(client))
    .then(client => createExercisesTable(client))
    .then(client => insertExercises(client))
    .then(client => dropActionsTable(client))
    .then(client => createActionsTable(client))
    .then(client => insertActions(client))
    .then(client => {
      console.log("Database ready!")
      client.release()
    })
    .catch(response => {
      response.client.release()
      console.log(response.error.stack)
    })


  // pool
  //   .connect()
  //   .then(client => client
  //     .query('CREATE TABLE IF NOT EXISTS students ( \
  //       id SERIAL PRIMARY KEY, \
  //       takenBy integer[], \
  //       tags text[], \
  //       data jsonb \
  //       )')
  //     .then(res => {
  //       getStudents().forEach(exercise => {
  //         pool
  //           .connect()
  //           .then(client => {
  //             return client.query('INSERT INTO exercises(id, takenBy, tags, data) \
  //               VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [exercise.id, [], exercise.tags, exercise.data])})
  //         })
  //         client.release()
  //       })
  //     .catch(err => {
  //       client.release()
  //       console.log(err.stack)
  //     })
  //   )

  pool.getExercises = () => pool
    .connect()
    .then(client => client.query('SELECT * FROM exercises'))

  pool.getExercise = id => pool
    .connect()
    .then(client => client.query('SELECT * FROM exercises WHERE id = $1', [id]))

  pool.createExercise = () => pool
    .connect()
    .then(client => client.query('INSERT INTO exercises(tags, content) VALUES ($1, $2)', [["a", "b"], {"xd": 13}]))

  return pool
}

module.exports = {
  createPool
}