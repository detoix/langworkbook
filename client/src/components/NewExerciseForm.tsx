import Async from "react-async"
import { getTags } from "../services/client"
import { NewExercise } from "../models/excercise"

const handleSubmit = (event: any) => {

  let exercise: NewExercise = {
    tags: [],
    data: {
      content: [],
      answer: ""
    }
  }

  for (let index = 0; index < event.target.length - 1; index++) {

    if (index == 0) {
      exercise.data.content.push({text: event.target[index].value})
    } else {
      exercise.data.answer = event.target[index].value
      exercise.data.content.push({letters: event.target[index].value.split("").reverse().join("")})
    }

  }

  console.log(exercise)

  event.preventDefault()
}

const NewExerciseForm = () => {
  return (
    <Async promiseFn={getTags}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        <form onSubmit={event => handleSubmit(event)}>
          <input type="text" />
          <input type="text" />
          <input type="submit" value="Submit" />
        </form>
      {/* {(tags: string[]) => (
        <div>
          {tags.map((tag: string) => 
            <p>
              {tag}
            </p>
          )}
        </div>
      )} */}
    </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm