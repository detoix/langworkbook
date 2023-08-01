import Async from "react-async"
import { useNavigate, useLocation, Link, NavigateFunction } from "react-router-dom"
import { getTags, createExercise } from "../services/client"
import { NewExercise } from "../models/excercise"
import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, InputAdornment, Stack, TextField } from "@mui/material"

const handleSubmit = (event: any, phrases: any, navigate: NavigateFunction) => {
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
    navigate(window.location.pathname, {state: {phrases: phrases, id: response.id}})
  })
}

const addSlot = (phrases: any, navigate: NavigateFunction) => {
  navigate(window.location.pathname, {state: {phrases: phrases.concat([{}])}})
}

const appendPhrase = (id: number, value: string | null, state: any, navigate: NavigateFunction) => {
  // let query = buildQueryParams(searchParams, { ["hint" + id]: value })
  navigate(window.location.pathname, {state: state})
}

const shuffle = (relPhrase: string | null) => {
  if (relPhrase) { return relPhrase.split('').sort(function(){return 0.5-Math.random()}).join('') }
  else { return null }
}

const layout = (state: any) => { //if provided && provided.plainText, if provided && provided.phrases << tak zrobic navigate
  if (state && state.rawText) {
    return state.rawText.split(' ').map((chunk: string) => ({ phrase: chunk}))
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

  return (
    <Async promiseFn={getTags}>
      <Async.Pending></Async.Pending>
      <Async.Fulfilled>
        {(tags: string[]) => (
          <form onSubmit={event => handleSubmit(event, phrases, navigate)} style={{display: 'flex'}}>
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
                            defaultValue={location.state ? phrases[i]?.text : null}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton edge="end" color="primary">~</IconButton>
                                </InputAdornment>
                              )
                            }}
                            //TODO: event listeners are only appended, they stack and slow it down
                            // onChange={e => e.target.nextSibling?.addEventListener('click', () => appendPhrase(i, e.target.value, state, navigate))} 
                          />
                          <TextField 
                            name={"hint" + i} 
                            variant="standard" 
                            placeholder={phrases[i]?.hint}
                            defaultValue={location.state ? phrases[i]?.hint : null}
                            // value={shuffle(searchParams.get("hint" + i)) || ''}
                            // onFocus={e => { 
                            //   e.target.select()
                            //   appendPhrase(i, null, searchParams, navigate)
                            // }}
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