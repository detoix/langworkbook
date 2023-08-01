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

const generateHint = (event: any, index: number, hintsCache: Map<number, string>, phrasesCount: number, navigate: NavigateFunction) => {
  let exercise = assembleExercise((event.target as any).form)
  exercise.data.content[index].hint = hintsCache.get(index)
  for (let i = exercise.data.content.length; i < phrasesCount; i++) { exercise.data.content.push({}) }
  navigate(window.location.pathname, {state: {phrases: exercise.data.content}})
}

const shuffle = (relPhrase: string) => {
  if (relPhrase) { return relPhrase.split('').sort(function(){return 0.5-Math.random()}).join('') }
  else { return "" }
}

const loadFormContent = (state: any) => {
  if (state && state.rawText) {
    return state.rawText.split(' ').map((chunk: string) => ({ text: chunk }))
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

const hintsFor = (phrases: any) => {
  let map = new Map<number, string>()
  for (let index = 0; index < phrases.length; index++) {
    if (phrases[index].text) {
      map.set(index, shuffle(phrases[index].text))
    }
  }
  return map
}

const NewExerciseForm = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const state = location.state as any
  const phrases = loadFormContent(state)
  const [hintsCache, setHintsCache] = useState<Map<number, string>>(hintsFor(phrases))

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
                                  <IconButton edge="end" color="primary" onClick={e => generateHint(e, i, hintsCache, phrases.length, navigate)}>~</IconButton>
                                </InputAdornment>
                              )
                            }}
                            onChange={e => setHintsCache(new Map<number, string>(hintsCache).set(i, shuffle(e.target.value)))}
                          />
                          <TextField 
                            name={"hint" + i} 
                            variant="standard" 
                            placeholder={phrases[i]?.hint}
                            defaultValue={state ? phrases[i]?.hint : null}
                            key={phrases[i]?.hint}
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