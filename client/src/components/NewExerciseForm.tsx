import Async from "react-async"
import { useSearchParams, Link } from "react-router-dom"
import { getTags, createExercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { NewExercise } from "../models/excercise"
import { Autocomplete, Button, Card, CardActions, CardContent, Stack, TextField } from "@mui/material"

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
    tags: [],
    data: {
      content: [],
      answer: []
    }
  }

  for (let index = 0; index < event.target.tags.parentNode.children.length - 3; index++) {
    exercise.tags.push(event.target.tags.parentNode.children[index].textContent)
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
          <form onSubmit={event => handleSubmit(event)} style={{display: 'flex'}}>
            <Card variant="outlined">
              <CardContent>
                <Autocomplete
                  multiple
                  freeSolo
                  options={tags}
                  renderInput={(params) => <TextField name="tags" {...params} label="Tags" placeholder={tags.join(", ")} />}
                />
                <Stack direction="row" spacing={1} style={{ alignItems: "center" }}>

                  {Array.from({length: phrasesCount}, (_, i) => 
                    <Stack key={i}>
                      <TextField name={"phrase" + i} variant="standard" placeholder={defaultPhrases[i]} />
                      {/* <input name={"phrase" + i} type="text" placeholder={defaultPhrases[i]} /> */}
                      {/* <input name={"letters" + i} type="text" placeholder="letters" />
                      <input name={"sth" + i} type="text" placeholder="sth" /> */}
                    </Stack>
                  )}

                  <Link to={{search: buildQueryParams(searchParams, { phrases: (phrasesCount + 1) })}}>
                    <Button>+</Button>
                  </Link>
                </Stack>
              </CardContent>
              <CardActions>
                <Button type="submit">Submit</Button>
              </CardActions>
            </Card>
          </form>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm