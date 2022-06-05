const filterExercises = (student, exercises) => {
  let excercisesAlreadyTried = new Set(student.exercises.map(e => e.id))
  let excersisesNeverDone = exercises.filter(e => !excercisesAlreadyTried.has(e.id))

  return excersisesNeverDone
}

const showMyExercises = (student, exercises) => {
  let myExercises = student.exercises.map(e => {

    let exercise = exercises.find(x => x.id == e.id)
    let exerciseData = {
      puzzle: exercise.content.text.join("_")
    }

    return Object.assign(exerciseData, e)
  })

  return myExercises
}

const solveExercise = (student, exercise, answer) => {
  let studentWithAttempt = Object.assign({}, student)
  let correct = exercise.answer.filter((e, index) => e == answer[index]).length
  let result = correct != 0 ? correct / exercise.answer.length : 0
  let excerciseRecord = studentWithAttempt.exercises.find(e => e.id == exercise.id)

  if (excerciseRecord) {} else { excerciseRecord = { id: exercise.id, history: [] } }

  excerciseRecord.history.push({ answer: answer, correct: result })

  return studentWithAttempt
}

module.exports = {
  filterExercises,
  showMyExercises,
  solveExercise,
}