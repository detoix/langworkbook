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

const insertExercises = client => new Promise((resolve, reject) => {
  let exercises = getExercises()
  let query = "INSERT INTO exercises(id, takenBy, tags, data) VALUES " +
    exercises.map((exercise, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
    " ON CONFLICT DO NOTHING"
  let data = exercises.flatMap(exercise => [exercise.id, [], exercise.tags, exercise.data])

  client
    .query(query, data)
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