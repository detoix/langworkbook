const dueForRepetition = exercise => {
  return exercise.time_since_last_correct_answer.days > 10 * Math.sqrt(exercise.score)
}

module.exports = {
  dueForRepetition,
}