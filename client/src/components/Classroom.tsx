import Async from "react-async"
import { useParams, Link } from "react-router-dom"
import { getMyExercises } from "../services/client"
import { Excercise } from "../models/excercise"

const Classroom = () => {
  const { id } = useParams()

  return (
    <Async promiseFn={props => getMyExercises(props)} id={id}> {/* explicit syntax because otherwise component won't reload */}
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(exercises: Excercise[]) => (
          <div>
            {exercises.map(e => 
              <p>
                {e.id} {e.data.content.map((x: any) => x.text).join("_")}<Link to={"/exercises/" + e.id}>take</Link>
              </p>
            )}
          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Classroom