const filterMyExercises = (student, exercises) => {
  let myExercises = student.exercises.map(excerciseRecord => {
    let exercise = exercises.find(exercise => exercise.id == excerciseRecord.id)

    return Object.assign(exercise, excerciseRecord)
  })

  return myExercises
}

const solveExercise = (exercise, answer) => {
  let correct = exercise.data.answer.filter((phrase, index) => phrase == answer[index]).length
  let result = correct != 0 ? correct / exercise.data.answer.length : 0

  return result
}

module.exports = {
  filterMyExercises,
  solveExercise,
}