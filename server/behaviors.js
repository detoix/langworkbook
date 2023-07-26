const dueForRepetition = attempts => {
  let correctAttempts = attempts
    .filter(attempt => attempt.answer.toString() == attempt.data.answer.toString())
    .count()
  let result = 10 * Math.sqrt(correctAttempts)

  return result
}

const projectionOf = exercisesAttempts => {
  let exercises = exercisesAttempts.reduce((groups, excercise) => {
    const group = (groups[excercise.id] || [])
    group.push(excercise)
    groups[excercise.id] = group
    return groups;
  }, {})

  Object.values(exercises)
    .forEach(e => dueForRepetition(e))

  // exercises.forEach(exercise => {
  //   if (myExercises[exercise.id]) {
  //     myExercises[exercise.id].attempts += 1
  //   } else {
  //     myExercises[exercise.id] = exercise
  //     myExercises[exercise.id].attempts = 1
  //   }
  // })

  let result = Object.values(myExercises)
    .filter(dueForRepetition)
    .sort((a, b) => Math.sign(a.attempts - b.attempts))

  return result
}

module.exports = {
  projectionOf,
}