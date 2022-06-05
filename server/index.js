const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 8080

const { getStudents, getExercises } = require("./mocks")
const { filterExercises, solveExercise } = require("./behaviors")

app.use(cors())
app.use(bodyParser.json())

app.get("/exercises", (req, res) => {
  let exercises = getExercises()

  res.send(exercises)
})

app.get("/students/:studentId/exercises", (req, res) => {
  let students = getStudents()
  let exercises = getExercises()
  let availableExercises = filterExercises(students.find(x => x.id == req.params.studentId), exercises)

  res.send(availableExercises)
})

app.get("/exercises/:exerciseId", (req, res) => {
  let exercises = getExercises()
  res.send(exercises.find(e => e.id == req.params.exerciseId))
})

app.post("/exercises/:exerciseId", (req, res) => {
  //create new exercise
})

app.post("/students/:studentId/exercises/:exerciseId", (req, res) => {
  let students = getStudents()
  let student = students.find(x => x.id == req.params.studentId)
  let exercises = getExercises()
  let exercise = exercises.find(e => e.id == req.params.exerciseId)

  let foo = solveExercise(student, exercise, req.body.answer)

  res.sendStatus(200)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
