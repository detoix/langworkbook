const { Pool } = require("pg")
const { getExercises, getActions } = require("./mocks")

const dropExercisesTable = client => new Promise((resolve, reject) => {
  client
    .query("DROP TABLE IF EXISTS exercises")
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const createExercisesTable = client => new Promise((resolve, reject) => {
  client
    .query("CREATE TABLE IF NOT EXISTS exercises ( \
      id SERIAL PRIMARY KEY, \
      author integer, \
      tags text[], \
      data jsonb \
      )")
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const flattenExercises = exercises => exercises.flatMap(exercise => [exercise.id, exercise.author, exercise.tags, exercise.data])

const insertExercises = client => new Promise((resolve, reject) => {
  let exercises = getExercises()
  let flatMap = flattenExercises(exercises)
  let ids = flatMap.reduce((previous, current, index) => (previous != 0 ? previous : "$1") + ", $" + (index + 1))

  // console.log(flatMapOfExerciseData.reduce((previous, current, index) => (index % 4 == 0 ? "(" : "") + (previous != 0 ? previous : "$1") + ", $" + (index + 1) + (index % 4 == 3 ? ")" : "")))

  let query = "INSERT INTO exercises(id, author, tags, data) VALUES " +
    exercises.map((exercise, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
    " ON CONFLICT DO NOTHING"

  client
    .query(query, flatMap)
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const dropActionsTable = client => new Promise((resolve, reject) => {
  client
    .query("DROP TABLE IF EXISTS actions")
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const createActionsTable = client => new Promise((resolve, reject) => {
  client
    .query("CREATE TABLE IF NOT EXISTS actions ( \
      id SERIAL PRIMARY KEY, \
      timestamp TIMESTAMP DEFAULT NOW(), \
      student integer, \
      exercise integer, \
      result jsonb \
      )")
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const flattenActions = actions => actions.flatMap(action => [action.id, action.student, action.exercise, action.result])

const insertActions = client => new Promise((resolve, reject) => {
  let actions = getActions()
  let flatMap = flattenActions(actions)
  let query = "INSERT INTO actions(id, student, exercise, result) VALUES " +
    actions.map((action, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
    " ON CONFLICT DO NOTHING"

  client
    .query(query, flatMap)
    .then(res => resolve(client))
    .catch(error => reject({client, error}))
})

const fixPrimaryKeySequence = (client, table) => new Promise((resolve, reject) => {
  client
    .query("SELECT setval('" + table + "_id_seq', (SELECT MAX(id) from " + table + "))")
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
    .then(client => fixPrimaryKeySequence(client, "exercises"))
    .then(client => dropActionsTable(client))
    .then(client => createActionsTable(client))
    .then(client => insertActions(client))
    .then(client => fixPrimaryKeySequence(client, "actions"))
    .then(client => {
      console.log("Database ready!")
      client.release()
    })
    .catch(response => {
      response.client.release()
      console.log(response.error.stack)
    })

  pool.getExercises = (limit, offset, tags) => pool
    .query("SELECT * FROM exercises \
      WHERE tags @> $1::text[] \
      LIMIT $2 \
      OFFSET $3", [tags, limit, offset])
    .then(data => data.rows)

  pool.createExercise = exercise => pool
    .query("INSERT INTO exercises(author, tags, data) VALUES ($1, $2, $3)", [exercise.author, exercise.tags, exercise.data])
    .then(data => data)

  pool.getTags = () => pool
    .query("SELECT DISTINCT UNNEST(tags) FROM exercises")
    .then(data => data.rows.map(row => row.unnest))

  pool.getMyExercises = student => pool
    .query("SELECT exercises.id, exercises.tags, exercises.data, actions.result FROM actions \
      LEFT JOIN exercises ON actions.exercise = exercises.id AND actions.student = $1 \
      WHERE student = $1", [student])
    .then(data => data.rows)

  pool.getExercise = id => pool
    .query("SELECT * FROM exercises WHERE id = $1", [id])
    .then(data => data.rows[0])

  pool.submitAction = action => pool
    .query("INSERT INTO actions(student, exercise, result) VALUES ($1, $2, $3)", [action.student, action.exercise, action.result])

  pool.deleteExercise = (exerciseId, studentId) => pool
    .query("DELETE FROM exercises \
      WHERE id = $1 AND author = $2", [exerciseId, studentId])

  pool.updateExercise = id => pool
    .query("UPDATE exercises SET tags = $1, data = $2 \
      WHERE id = $3 AND id NOT IN (SELECT exercise FROM actions)", [null, null, id])

  return pool
}

module.exports = {
  createPool
}