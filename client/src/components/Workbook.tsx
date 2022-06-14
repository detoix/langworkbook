import Async from "react-async"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { getExercises } from "../services/client"
import { redirectWith } from "../services/redirect"
import { Excercise } from "../models/excercise"

const target = (searchParams: URLSearchParams, query: any) => {

  let params = new URLSearchParams(searchParams.toString());

  Object.keys(query).forEach(key => {
    params.set(key, query[key].toString())
  })

  return params.toString() 
}

const Exercises = () => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = {
    offset: Number(searchParams.get("offset")),
    limit: Number(searchParams.get("limit")) || 10,
    tags: searchParams.get("tags")?.split(",") || []
  }

  return (
    <Async promiseFn={() => getExercises(query)}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(exercises: Excercise[]) => (
          <div>
            {exercises.map(exercise => 
              <p key={exercise.id}>
                {exercise.id}. {exercise.tags.map(tag => <Link to={{search: target(searchParams, { tags: [...query.tags].concat(tag) })}}>#{tag}</Link>)} {exercise.data.content.map(phrase => phrase.text).join("_")} <Link to={"/exercises/" + exercise.id}>[take]</Link>
              </p>
            )}

            <Link to={{search: target(searchParams, {offset: Math.max(query.offset - query.limit, 0), limit: query.limit})}}>
              <button>prev</button>
            </Link>
            <select defaultValue={query.limit} onChange={event => redirectWith(searchParams, setSearchParams, navigate, {offset: query.offset, limit: Number(event.target.value)})}>
              <option>1</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <Link to={{search: target(searchParams, {offset: query.offset + query.limit, limit: query.limit})}}>
              <button>next</button>
            </Link>

          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercises