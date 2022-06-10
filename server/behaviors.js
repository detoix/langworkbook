const formatMyExercises = (exercises) => {
  let myExercises = []

  exercises.forEach(exercise => {
    if (myExercises[exercise.id]) {
      myExercises[exercise.id].count += 1
    } else {
      myExercises[exercise.id] = exercise
      myExercises[exercise.id].count = 1
    }
  })

  return myExercises
}

const solveExercise = (exercise, answer) => {
  let correct = exercise.data.answer.filter((phrase, index) => phrase == answer[index]).length
  let result = correct != 0 ? correct / exercise.data.answer.length : 0

  return result
}

module.exports = {
  formatMyExercises,
  solveExercise,
}