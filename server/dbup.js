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
  let query = "INSERT INTO exercises(id, author, tags, data) VALUES " +
    exercises.map((_, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
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
    actions.map((_, index) => `($${(index * 4) + 1}, $${(index * 4) + 2}, $${(index * 4) + 3}, $${(index * 4) + 4})`).join() +
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

new Pool({ connectionString: process.argv[2] })
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