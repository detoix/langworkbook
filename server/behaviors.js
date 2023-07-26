const dueForRepetition = exercise => {

  let result = 10 * Math.sqrt(exercise.score)

  return result < 1
}

const projectionOf = exercises => {
  let result = exercises
    .filter(dueForRepetition)

  return result
}

module.exports = {
  projectionOf,
}