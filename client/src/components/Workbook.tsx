import Async from "react-async"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { getExercises } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { Excercise } from "../models/excercise"

const defaultLimit = 10

const Exercises = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = {
    offset: Number(searchParams.get("offset")),
    limit: Number(searchParams.get("limit")) || defaultLimit,
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
                {exercise.id}. {exercise.tags.map(tag => <Link to={{search: buildQueryParams(searchParams, { tags: [...query.tags].concat(tag) })}}>#{tag}</Link>)} {exercise.data.content.map(phrase => phrase.text).join("_")} <Link to={"/exercises/" + exercise.id}>[take]</Link>
              </p>
            )}

            <Link to={{search: buildQueryParams(searchParams, {offset: Math.max(query.offset - query.limit, 0), limit: query.limit})}}>
              <button>prev</button>
            </Link>
            <select defaultValue={query.limit} onChange={event => navigate({ search: buildQueryParams(searchParams, {offset: query.offset, limit: Number(event.target.value)}) }) }>
              <option>1</option>
              <option>{defaultLimit}</option>
              <option>25</option>
              <option>50</option>
            </select>
            <Link to={{search: buildQueryParams(searchParams, {offset: query.offset + query.limit, limit: query.limit})}}>
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