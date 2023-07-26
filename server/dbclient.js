const { Pool } = require("pg")

const createPool = (connectionString) => {
  let pool = new Pool({ connectionString: connectionString })

  pool.getExercises = (limit, offset, tags) => pool
    .query("SELECT *, (SELECT COUNT(*) FROM actions WHERE actions.exercise = exercises.id) as attempts FROM exercises \
      WHERE tags @> $1::text[] \
      LIMIT $2 \
      OFFSET $3", [tags, limit, offset])
    .then(data => data.rows)

  pool.createExercise = exercise => pool
    .query("INSERT INTO exercises(author, tags, data) VALUES ($1, $2, $3) RETURNING id", [exercise.author, exercise.tags, exercise.data])
    .then(data => data.rows[0])

  pool.getTags = () => pool
    .query("SELECT DISTINCT UNNEST(tags) FROM exercises")
    .then(data => data.rows.map(row => row.unnest))

  pool.getMyExercises = student => pool
    .query("SELECT exercises.id, exercises.author, exercises.tags, exercises.data, COUNT(exercises.id) as score, NOW() - MAX(actions.timestamp) as time_since_last_correct_answer FROM actions \
      LEFT JOIN exercises ON actions.exercise = exercises.id AND actions.student = $1 \
      WHERE actions.student = $1 \
      AND actions.result->>'answer' = exercises.data->>'answer' \
      GROUP BY exercises.id", [student])
    .then(data => data.rows)

  pool.getExercise = id => pool
    .query("SELECT * FROM exercises WHERE id = $1", [id])
    .then(data => data.rows[0])

  pool.submitAction = action => pool
    .query("INSERT INTO actions(student, exercise, result) VALUES ($1, $2, $3)", [action.student, action.exercise, action.result])

  pool.deleteExercise = (exerciseId, studentId) => pool
    .query("DELETE FROM exercises \
      WHERE id = $1 AND author = $2 AND $1 NOT IN (SELECT exercise FROM actions)", [exerciseId, studentId])

  pool.updateExercise = id => pool
    .query("UPDATE exercises SET tags = $1, data = $2 \
      WHERE id = $3 AND id NOT IN (SELECT exercise FROM actions)", [null, null, id])

  return pool
}

module.exports = {
  createPool
}