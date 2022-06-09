const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { solveExercise } = require("./behaviors")
const { createPool } = require("./dbclient")

const app = express()
const pool = createPool()
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())

app.get("/exercises", (req, res) => {
  pool.getExercises().then(payload => {
    res.send(payload.rows)
  })
})

app.get("/students/:studentId/exercises", (req, res) => {
  pool.getExercises().then(payload => {
    res.send(payload.rows)
  })
})

app.get("/exercises/:exerciseId", (req, res) => {
  pool.getExercise(req.params.exerciseId).then(payload => {
    res.send(payload)
  })
})

app.post("/students/:studentId/exercises/:exerciseId", (req, res) => {
  pool.getExercise(req.params.exerciseId)
    .then(exercise => (
      {
        student: req.params.studentId,
        exercise: req.params.exerciseId,
        result: {
          answer: req.body.answer,
          correct: solveExercise(exercise, req.body.answer)
        }
      }
    ))
    .then(action => {
      pool.submitAction(action)
      res.send(action)
    })
})

app.post("/exercises/:exerciseId", (req, res) => {
  //create new exercise
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
