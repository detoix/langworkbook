const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const { projectionOf } = require("./behaviors")
const { createPool } = require("./dbclient")

const connectionString = process.argv[2] || process.env.DATABASE_URL
const app = express()
const pool = createPool(connectionString)
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/exercises", (req, res) => {
  let tags = req.query.tags && req.query.tags.split(",").length
    ? req.query.tags.split(",")
    : []

  pool.getExercises(
    req.query.limit || 10,
    req.query.offset || 0,
    tags).then(payload => 
  {
    res.send(payload)
  })
})

app.get("/tags", (req, res) => {
  pool.getTags().then(payload => {
    res.send(payload)
  })
})

app.get("/students/:studentId/exercises", (req, res) => {
  pool.getMyExercises(req.params.studentId)
    .then(exercises => projectionOf(exercises))
    .then(projection => res.send(projection))
})

app.get("/exercises/:exerciseId", (req, res) => {
  pool.getExercise(req.params.exerciseId).then(payload => {
    res.send(payload)
  })
})

app.delete("/exercises/:exerciseId", (req, res) => {
  pool.deleteExercise(req.params.exerciseId, req.query.studentId).then(payload => {
    res.send(payload)
  })
})

app.post("/students/:studentId/exercises/:exerciseId", (req, res) => {
  let action = {
    student: req.params.studentId,
    exercise: req.params.exerciseId,
    result: {
      answer: req.body.answer,
    }
  }

  pool.getExercise(req.params.exerciseId)
    .then(exercise => {
      action.result.correctAnswer = exercise.data.answer

      return action
    })
    .then(action => pool.submitAction(action))
    .then(_ => pool.getMyExercises(req.params.studentId))
    .then(exercises => projectionOf(exercises))
    .then(projection => {
      action.next = projection.shift().id
      res.send(action)
    })
})

app.post("/exercises", (req, res) => {
  pool.createExercise(req.body).then(payload => {
    res.send(payload)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}, connected with ${connectionString}`)
})
