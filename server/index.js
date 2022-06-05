const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 8080

const { getStudents, getExercises } = require("./mocks")
const { filterMyExercises, solveExercise } = require("./behaviors")
const { createDatabaseClient } = require("./dbclient")

const client = createDatabaseClient()

// client.connect(err => {
//   if (err) {
//     console.error('connection error', err.stack)
//   } else {
//     console.log('connected')
//   }
// })

// client.query('CREATE TABLE IF NOT EXISTS exercises ( \
//   id SERIAL PRIMARY KEY, \
//   tags text[], \
//   content jsonb \
//   )', (err, res) => {
//   if (err) throw err
//   console.log(res)
// })

// client.query('INSERT INTO exercises(tags, content) VALUES ($1, $2)', [["a", "b"], {"xd": 12}], (err, res) => {
//   if (err) throw err
//   console.log(res)
//   client.end()
// })

app.use(cors())
app.use(bodyParser.json())

app.get("/exercises", (req, res) => {
  let exercises = getExercises()

  res.send(exercises)
})

app.get("/students/:studentId/exercises", (req, res) => {
  let students = getStudents()
  let student = students.find(x => x.id == req.params.studentId)
  let exercises = getExercises()

  let myExercises = filterMyExercises(student, exercises)

  res.send(myExercises)
})

app.get("/exercises/:exerciseId", (req, res) => {
  let exercises = getExercises()
  let exercise = exercises.find(e => e.id == req.params.exerciseId)

  res.send(exercise)
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
