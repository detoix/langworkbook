const { Pool } = require('pg')
const { getStudents, getExercises } = require("./mocks")

const students = getStudents()

const createPool = () => {
  let pool = new Pool({ connectionString: "postgres://xd:xd@localhost:5432/tmp" })
  
  pool
    .connect()
    .then(client => client
      .query('CREATE TABLE IF NOT EXISTS exercises ( \
        id SERIAL PRIMARY KEY, \
        takenBy integer[], \
        tags text[], \
        data jsonb \
        )')
      .then(res => {
        getExercises().forEach(exercise => {
          pool
            .connect()
            .then(client => {
              return client.query('INSERT INTO exercises(id, takenBy, tags, data) \
                VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [exercise.id, [], exercise.tags, exercise.data])})
          })
          client.release()
        })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
    )

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