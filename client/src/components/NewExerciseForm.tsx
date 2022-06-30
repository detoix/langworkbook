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

const handleSubmit = (event: any) => {
  event.preventDefault()

  let exercise: NewExercise = {
    author: 0,
    tags: event.target.tags.value.split(", "),
    data: {
      content: [],
      answer: []
    }
  }

  for (let index = 0; index < event.target.length - 1; index++) {
    let phrase = event.target["phrase" + index]
    let letters = event.target["letters" + index]
    let sth = null

    if (phrase && phrase.value) {
      exercise.data.content.push({text: phrase.value})
    }

    if (letters && letters.value) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({letters: letters.value})
    }

    if (sth) {
      //nothing yet
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
                <input name="tags" type="text" placeholder={tags.join(", ")} />
              </div>

              <div>
                <label>Exercise:</label>
              </div>

              {Array.from({length: phrasesCount}, (_, i) => 
                <div>
                  <input name={"phrase" + i} type="text" placeholder={defaultPhrases[i]} />
                  <input name={"letters" + i} type="text" placeholder="letters" />
                  <input name={"sth" + i} type="text" placeholder="sth" />
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