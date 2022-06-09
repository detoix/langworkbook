const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 8080

const { solveExercise } = require("./behaviors")
const { createPool } = require("./dbclient")

const pool = createPool()

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
  pool.getExercise(req.params.exerciseId).then(exercise => {
    let result = solveExercise(exercise, req.body.answer)
    let response = {
      answer: req.body.answer, result, student: req.params.studentId
    }
    res.send(response)
  })
})

app.post("/exercises/:exerciseId", (req, res) => {
  //create new exercise
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
