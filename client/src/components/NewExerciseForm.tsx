import Async from "react-async"
import { useState } from "react"
import { useNavigate, useLocation, Link, NavigateFunction } from "react-router-dom"
import { getTags, createExercise } from "../services/client"
import { NewExercise } from "../models/excercise"
import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, InputAdornment, Stack, TextField } from "@mui/material"

const assembleExercise = (form: any) => {
  let exercise: NewExercise = {
    author: 0,
    tags: [],
    data: {
      content: [],
      answer: []
    }
  }

  for (let index = 0; index < form.tags.parentNode.children.length - 3; index++) {
    exercise.tags.push(form.tags.parentNode.children[index].textContent)
  }

  for (let index = 0; index < form.length - 1; index++) {
    let phrase = form["phrase" + index]
    let hint = form["hint" + index]

    if (phrase && phrase.value) {
      exercise.data.content.push({text: phrase.value})
    }

    if (hint && hint.value) {
      let last = exercise.data.content.pop()
      exercise.data.answer.push(last!.text!)
      exercise.data.content.push({hint: hint.value})
    }
  }

  return exercise
}

const handleSubmit = (event: any, navigate: NavigateFunction) => {
  event.preventDefault()

  let exercise = assembleExercise(event.target)

  createExercise(exercise).then(response => {
    navigate(window.location.pathname, {state: {phrases: exercise.data.content, id: response.id}})
  })
}

const addSlot = (phrases: any, navigate: NavigateFunction) => {
  navigate(window.location.pathname, {state: {phrases: phrases.concat([{}])}})
}

const generateHint = (event: any, index: number, hintsCache: Map<number, string>, navigate: NavigateFunction) => {
  let exercise = assembleExercise((event.target as any).form)
  exercise.data.content[index].hint = hintsCache.get(index)
  for (let i = exercise.data.content.length; i < 3; i++) {
    exercise.data.content.push({})
  }
  navigate(window.location.pathname, {state: {phrases: exercise.data.content}})
}

const shuffle = (relPhrase: string) => {
  if (relPhrase) { return relPhrase.split('').sort(function(){return 0.5-Math.random()}).join('') }
  else { return "" }
}

const layout = (state: any) => {
  if (state && state.rawText) {
    return state.rawText.split(' ').map((chunk: string) => ({ phrase: { text: chunk}}))
  } else if (state && state.phrases) {
    return state.phrases
  } else {
    return [
      { text: "Florian ist seit", hint: "" },
      { text: "drei", hint: "reid" },
      { text: "Monaten wieder Single.", hint: "" }
    ]
  }
}

const NewExerciseForm = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const state = location.state as any
  const phrases = layout(state)
  const [hintsCache, setHintsCache] = useState<Map<number, string>>(new Map<number, string>())

  return (
    <Async promiseFn={getTags}>
      <Async.Pending></Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <form onSubmit={event => handleSubmit(event, navigate)} style={{display: 'flex'}}>
            <Stack spacing={1}>
              {state && state.id && <Card variant="outlined">
                <CardActions>
                  <Button color="success" variant="contained" component={Link} to={"/workbook/exercises/" + state.id}>Take</Button>
                  <Button color="success" variant="outlined" component={Link} to="/workbook/exercises/new/clear">Create another</Button>
                </CardActions>
              </Card>}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} style={{ alignItems: "center" }}>
                      {Array.from({length: phrases.length}, (_, i) => 
                        <Stack key={i}>
                          <TextField 
                            name={"phrase" + i} 
                            variant="standard" 
                            placeholder={phrases[i]?.text}
                            defaultValue={state ? phrases[i]?.text : null}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton edge="end" color="primary" onClick={e => generateHint(e, i, hintsCache, navigate)}>~</IconButton>
                                </InputAdornment>
                              )
                            }}
                            onChange={e => setHintsCache(new Map<number, string>(hintsCache).set(i, shuffle(e.target.value)))}
                          />
                          <TextField 
                            name={"hint" + i} 
                            variant="standard" 
                            placeholder={state ? phrases[i]?.hint : null}
                            defaultValue={state ? phrases[i]?.hint : null}
                            key={state ? phrases[i]?.hint : null}
                          />
                        </Stack>
                      )}
                      <Button onClick={() => addSlot(phrases, navigate)}>+</Button>
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