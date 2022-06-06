const { getStudents, getExercises } = require("./mocks")
const { filterUndoneExercises, filterMyExercises, solveExercise } = require("./behaviors")

test("visitor can browse all excercises", () => {
  //todo
})

test("student can browse excercises they have never done before", () => {
  let students = getStudents()
  let student = students[0]
  let exercises = getExercises()

  let availableExercises = filterUndoneExercises(student, exercises)
  
  expect(availableExercises).toMatchObject([{ id: 1 }])
})

test("student can explore their exercises", () => {
  let students = getStudents()
  let student = students[1]
  let exercises = getExercises()

  let myExercises = filterMyExercises(student, exercises)

  expect(myExercises).toMatchObject([
    { id: 0, data: { answer: [{}, {}] }, history: [{correct: 1}, {correct: 0.5}] },
    { id: 1 }])
})

test("student can do an excercise", () => {
  //todo
})

test("student can solve an exercise", () => {
  let students = getStudents()
  let exercises = getExercises()
  
  let student = students[0]
  let exercise = exercises[0]
  let answer = ["dupa", "iba"]
  let studentWithAttempt = solveExercise(student, exercise, answer)
  
  expect(studentWithAttempt).toMatchObject({ exercises: [ { history: [{}, {}, {answer: answer, correct: 0.5}]} ] })
})

test("student can submit a new exercise", () => {
  //todo
})