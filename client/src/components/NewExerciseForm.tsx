import Async from "react-async"
import { useNavigate, useSearchParams, Link, NavigateFunction } from "react-router-dom"
import { getTags, createExercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { NewExercise } from "../models/excercise"
import { Autocomplete, Button, Card, CardActions, CardContent, Stack, TextField } from "@mui/material"

const defaultPhrases = [
  { phrase: "Florian ist seit", hint: "" },
  { phrase: "drei", hint: "reid" },
  { phrase: "Monaten wieder Single.", hint: "" }
]

const handleSubmit = (event: any, navigate: NavigateFunction) => {
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
    let hint = event.target["hint" + index]

    if (phrase && phrase.value) {
      exercise.data.content.push({text: phrase.value})
    }

    if (hint && hint.value) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({hint: hint.value})
    }
  }

  createExercise(exercise).then(response => {
    let query = buildQueryParams(new URLSearchParams(), { createdId: response.id })
    navigate({search: query})
  })
}

const NewExerciseForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const phrasesCount = Number(searchParams.get("phrases")) || 3
  const createdId = searchParams.get("createdId")

  return (
    <Async promiseFn={getTags}>
      <Async.Pending></Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <form onSubmit={event => handleSubmit(event, navigate)} style={{display: 'flex'}}>
            <Stack spacing={1}>
              {createdId && <Card variant="outlined">
                <CardActions>
                  <Button color="success" variant="contained" component={Link} to={"/workbook/exercises/" + createdId}>Take</Button>
                  <Button color="success" variant="outlined" component={Link} to="/workbook/exercises/new/clear">Create another</Button>
                </CardActions>
              </Card>}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} style={{ alignItems: "center" }}>
                      {Array.from({length: phrasesCount}, (_, i) => 
                        <Stack key={i}>
                          <TextField name={"phrase" + i} variant="standard" placeholder={defaultPhrases[i]?.phrase} />
                          <TextField name={"hint" + i} variant="standard" placeholder={defaultPhrases[i]?.hint} />
                        </Stack>
                      )}
                      <Button component={Link} to={{search: buildQueryParams(searchParams, { phrases: (phrasesCount + 1) })}}>+</Button>
                    </Stack>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={tags}
                      renderInput={(params) => <TextField name="tags" {...params} label="Tags" placeholder={tags.join(", ")} />}
                      />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button type="submit">Submit</Button>
                </CardActions>
              </Card>
            </Stack>
          </form>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm