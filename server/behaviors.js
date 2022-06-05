const filterUndoneExercises = (student, exercises) => {
  let excercisesAlreadyTried = new Set(student.exercises.map(e => e.id))
  let excersisesNeverDone = exercises.filter(e => !excercisesAlreadyTried.has(e.id))

  return excersisesNeverDone
}

const filterMyExercises = (student, exercises) => {
  let myExercises = student.exercises.map(excerciseRecord => {
    let exercise = exercises.find(exercise => exercise.id == excerciseRecord.id)

    return Object.assign(exercise, excerciseRecord)
  })

  return myExercises
}

const solveExercise = (student, exercise, answer) => {
  let studentWithAttempt = Object.assign({}, student)
  let correct = exercise.answer.filter((phrase, index) => phrase == answer[index]).length
  let result = correct != 0 ? correct / exercise.answer.length : 0
  let excerciseRecord = studentWithAttempt.exercises.find(exerciseRecord => exerciseRecord.id == exercise.id)

  if (excerciseRecord) {} else { excerciseRecord = { id: exercise.id, history: [] } }

  excerciseRecord.history.push({ answer: answer, correct: result })

  return studentWithAttempt
}

module.exports = {
  filterUndoneExercises,
  filterMyExercises,
  solveExercise,
}