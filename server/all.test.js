const { getExercises, getActions } = require("./mocks")
const { dueForRepetition } = require("./behaviors")

test("visitor can browse all excercises filtered and with pagination", () => {
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