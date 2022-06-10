import Async from "react-async"
import { getTags, createExercise } from "../services/client"
import { NewExercise } from "../models/excercise"

const handleSubmit = (event: any) => {

  let exercise: NewExercise = {
    tags: [],
    data: {
      content: [],
      answer: []
    }
  }

  for (let index = 0; index < event.target.length - 1; index++) {

    if (index == 0) {
      exercise.data.content.push({text: event.target[index].value})
    } else {
      exercise.data.answer.push(event.target[index].value)
      exercise.data.content.push({letters: event.target[index].value.split("").reverse().join("")})
    }

  }

  createExercise(exercise).then(response => console.log(response))

  event.preventDefault()
}

const NewExerciseForm = () => {
  return (
    <Async promiseFn={getTags}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <form onSubmit={event => handleSubmit(event)}>
            <label>{tags.join(",")}</label>
            <input type="text" />
            <input type="text" />
            <input type="submit" value="Submit" />
          </form>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm