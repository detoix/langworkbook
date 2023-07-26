const { getExercises, getActions } = require("./mocks")
const { projectionOf } = require("./behaviors")

test("visitor can browse all excercises", () => {
  //todo
})

test("student can browse once solved due excercises in proper order", () => {
  //todo
  let exercises = getExercises()
  let actions = getActions()
  let exercisesData = []

  exercises.forEach(exercise => {
    actions
      .filter(action => action.exercise == exercise.id)
      .filter(action => action.student == 0)
      .forEach(action => {
        let copy = {...exercise}
        copy.timestamp = action.timestamp
        copy.answer = action.result.answer
        exercisesData.push(copy)
      })    
  })

  let projection = projectionOf(exercisesData)
})

test("student can explore their exercises", () => {
  // let students = getStudents()
  // let student = students[1]
  // let exercises = getExercises()

  // let myExercises = filterMyExercises(student, exercises)

  // expect(myExercises).toMatchObject([
  //   { id: 0, data: { answer: [{}, {}] }, history: [{correct: 1}, {correct: 0.5}] },
  //   { id: 1 }])
})

test("student can do an excercise", () => {
  //todo
})

test("student can solve an exercise", () => {
  // let students = getStudents()
  // let exercises = getExercises()
  
  // let student = students[0]
  // let exercise = exercises[0]
  // let answer = ["dupa", "iba"]
  // let studentWithAttempt = solveExercise(student, exercise, answer)
  
  // expect(studentWithAttempt).toMatchObject({ exercises: [ { history: [{}, {}, {answer: answer, correct: 0.5}]} ] })
})

test("student can submit a new exercise", () => {
  //todo
})