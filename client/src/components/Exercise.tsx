import Async from "react-async"
import { useParams } from "react-router-dom"
import { Excercise } from "../models/excercise"
import { getExercise, solveExcercise } from "../services/client"

const handleSubmit = (context: any, event: any) => {
  let answer = []

  for (let index = 0; index < event.target.length - 1; index++) {
    answer.push(event.target[index].value)
  }

  solveExcercise({ id: 0 }, { id: context.exerciseId, answer: answer })

  event.preventDefault()
}

const Exercise = () => {
  const { id } = useParams()

  return (
    <Async promiseFn={getExercise} id={id}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
      {(exercise: Excercise) => (
        <div>
          <form onSubmit={event => handleSubmit({ studentId: 0, exerciseId: id }, event)}>
            {exercise.content.map((phrase) => {
              if (phrase.text) {
                return phrase.text
              } else {
                return <div><input type="text" /><label>{JSON.stringify(phrase.options ?? phrase.letters)}</label></div>
              }
            })}
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercise