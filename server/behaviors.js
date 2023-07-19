const projectionOf = (exercises) => {
  let myExercises = {}

  exercises.forEach(exercise => {
    if (myExercises[exercise.id]) {
      myExercises[exercise.id].attempts += 1
    } else {
      myExercises[exercise.id] = exercise
      myExercises[exercise.id].attempts = 1
    }
  })

  let result = Object.values(myExercises)
    .sort((a, b) => Math.sign(a.attempts - b.attempts))

  return result
}

module.exports = {
  projectionOf,
}