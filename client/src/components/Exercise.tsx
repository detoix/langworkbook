import Async from "react-async"
import { useParams } from "react-router-dom"
import { getExercise, solveExcercise } from '../services/client'

const handleSubmit = (context: any, event: any) => {

  let answer = []

  for (let index = 0; index < event.target.length - 1; index++) {
    answer.push(event.target[index].value)
  }

  solveExcercise(
  { 
    id: 0
  }, 
  {
    id: context.exerciseId,
    answer: answer
  })

  event.preventDefault()
}

const Exercise = () => {
  const { id } = useParams()

  return (
    <Async promiseFn={getExercise} id={id}>
      {({ data, error, isPending }) => {
        if (isPending) return "Loading..."
        if (error) return `Something went wrong: ${error.message}`
        if (data)
          return (
            <div>
              {JSON.stringify(data)}
              

              <form onSubmit={(e: any) => handleSubmit({ studentId: 0, exerciseId: id }, e)}>

              {data.content.map((x: any, index: number) => {
                if (x.text) {
                  return x.text
                } else {
                  return <div><input type="text" /><label>{JSON.stringify(x.options ?? x.letters)}</label></div>
                }
              })}

                      <input type="submit" value="Wyślij" />
                    </form>


            </div>
          )
        return null
      }}
    </Async>
  )
}

export default Exercise