const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 8080

const { getStudents, getExercises } = require("./mocks")
const { filterMyExercises, solveExercise } = require("./behaviors")
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
  let students = getStudents()
  let student = students.find(x => x.id == req.params.studentId)
  let exercises = getExercises()

  let myExercises = filterMyExercises(student, exercises)

  res.send(myExercises)
})

app.get("/exercises/:exerciseId", (req, res) => {
  pool.getExercise(req.params.exerciseId).then(payload => {
    res.send(payload.rows[0])
  })
})

app.post("/students/:studentId/exercises/:exerciseId", (req, res) => {
  let students = getStudents()
  let student = students.find(x => x.id == req.params.studentId)
  let exercises = getExercises()
  let exercise = exercises.find(e => e.id == req.params.exerciseId)

  let studentAfterExercise = solveExercise(student, exercise, req.body.answer)
  
  res.send(studentAfterExercise)
  
})

app.post("/exercises/:exerciseId", (req, res) => {
  //create new exercise
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
