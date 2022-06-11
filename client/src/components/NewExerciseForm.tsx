import Async from "react-async"
import { getTags, createExercise } from "../services/client"
import { NewExercise } from "../models/excercise"

const actions = [
  (exercise: NewExercise, input: string) => exercise.tags = input.split(", "),
  (exercise: NewExercise, input: string) => exercise.data.content.push({text: input}),
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},

  (exercise: NewExercise, input: string) => exercise.data.content.push({text: input}),
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => exercise.data.content.push({text: input}),
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => exercise.data.content.push({text: input}),
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => exercise.data.content.push({text: input}),
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
]

//this is ridiculous, but the purpose is to avoid any sort of state
const handleSubmit = (event: any) => {

  let exercise: NewExercise = {
    tags: [],
    data: {
      content: [],
      answer: []
    }
  }

  for (let index = 0; index < event.target.length - 1; index++) {
    if (actions[index]) {
      actions[index](exercise, event.target[index].value)
    }
  }

  console.log(exercise)

  createExercise(exercise).then(response => console.log(response))

  event.preventDefault()
}

const NewExerciseForm = () => {
  return (
    <Async promiseFn={getTags}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <form onSubmit={event => handleSubmit(event)}  style={{display: 'flex'}}>
            <div>
              <input type="text" placeholder={tags.join(", ")} />
            </div>
            <div>
              <input type="text" placeholder="Florian ist seit" />
              <input type="text" />
              <input type="text" />
            </div>
            <div>
              <input type="text" placeholder="drei" />
              <input type="text" placeholder="RDIE" />
              <input type="text" />
            </div>
            <div>
              <input type="text" placeholder="Monaten wieder Single," />
              <input type="text" />
              <input type="text" />
            </div>
            <div>
              <input type="text" placeholder="aber" />
              <input type="text" />
              <input type="text" placeholder="sonst, vielleicht" />
            </div>
            <div>
              <input type="text" placeholder="er freut sich." />
              <input type="text" />
              <input type="text" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm