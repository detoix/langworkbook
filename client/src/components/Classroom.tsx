import Async from "react-async"
import { useParams, Link } from 'react-router-dom'
import { getMyExercises } from '../services/client'

const Classroom = () => {
  const { id } = useParams()

  return (
    <Async promiseFn={(id: any) => getMyExercises(id)} id={id}>
      {({ data, error, isPending }) => {
        if (isPending) return "Loading..."
        if (error) return `Something went wrong: ${error.message}`
        if (data)
          return (
            <div>
              {data.map((e: any) => <p>{e.id} {e.content.map((x: any) => x.text).join('_')}
              
              <Link to={'/exercises/' + e.id}>take</Link>
              
              </p>)}
            </div>
          )
        return null
      }}
    </Async>
  )
}

export default Classroom