import Async from "react-async"
import { useSearchParams, Link } from "react-router-dom"
import { getTags, createExercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { NewExercise } from "../models/excercise"

const defaultPhrases = [
  "Florian ist seit",
  "drei",
  "Monaten wieder Single,",
  "aber",
  "er freut sich."
]

const actions = [
  (exercise: NewExercise, input: string) => exercise.tags = input.split(", "),

  (exercise: NewExercise, input: string) => {
    if (input) {
      exercise.data.content.push({text: input})
    }
  },
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},

  (exercise: NewExercise, input: string) => {
    if (input) {
      exercise.data.content.push({text: input})
    }
  },
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => {
    if (input) {
      exercise.data.content.push({text: input})
    }
  },
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => {
    if (input) {
      exercise.data.content.push({text: input})
    }
  },
  (exercise: NewExercise, input: string) => {
    if (input) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: input})
    }
  },
  (exercise: NewExercise, input: string) => {},
  (exercise: NewExercise, input: string) => {
    if (input) {
      exercise.data.content.push({text: input})
    }
  },
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
  event.preventDefault()

  let exercise: NewExercise = {
    author: 0,
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

  createExercise(exercise).then(response => console.log(response))
}

const NewExerciseForm = () => {

  const [searchParams] = useSearchParams()
  const phrasesCount = Number(searchParams.get("phrases")) || 1

  return (
    <Async promiseFn={getTags}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <div>
            <form onSubmit={event => handleSubmit(event)} style={{display: 'flex'}}>
              <div> 
                <label>Tags:</label>
                <input type="text" placeholder={tags.join(", ")} />
              </div>

              <div>
                <label>Exercise:</label>
              </div>

              {Array.from({length: phrasesCount}, (_, i) => 
                <div>
                  <input type="text" placeholder={defaultPhrases[i]} />
                  <input type="text" placeholder="letters" />
                  <input type="text" placeholder="sth" />
                </div>
              )}

              <Link to={{search: buildQueryParams(searchParams, { phrases: (phrasesCount + 1) })}}>
                <button>+</button>
              </Link>

              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm