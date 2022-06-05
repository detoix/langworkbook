const { getStudents, getExercises } = require('./mocks')
const { filterExercises, showMyExercises, solveExercise } = require('./behaviors')

test('visitor can browse all excercises', () => {
  //todo
})

test('student can browse excercises they have never done before', () => {
  let students = getStudents()
  let exercises = getExercises()

  let student = students[0]
  let availableExercises = filterExercises(student, exercises)
  
  expect(availableExercises).toMatchObject([{id: 1}])
})

test('student can explore their exercises', () => {
  let students = getStudents()
  let exercises = getExercises()

  let student = students[1]
  let myExercises = showMyExercises(student, exercises)
  
  expect(myExercises).toMatchObject([
    { id: 0, puzzle: "El otro dia me __ con Mariano cuando __ a clase de Musica.", history: [ {correct: 1}, {correct: 0.5} ] },
    { id: 1, puzzle: "Florian is seit drei Monaten wieder __." }])
})

test('student can do an excercise', () => {
  //todo
})

test('student can submit a new exercise', () => {
  //todo
})

test('student can solve an exercise', () => {
  let students = getStudents()
  let exercises = getExercises()

  let student = students[0]
  let exercise = exercises[0]
  let answer = ['dupa', 'iba']
  let studentWithAttempt = solveExercise(student, exercise, answer)

  expect(studentWithAttempt).toMatchObject({ exercises: [ { history: [{}, {}, {answer: answer, correct: 0.5}]} ] })
})