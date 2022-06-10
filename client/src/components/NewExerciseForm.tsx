import Async from "react-async"
import { getTags } from "../services/client"

const NewExerciseForm = () => {
  return (
    <Async promiseFn={getTags}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
      {(tags: string[]) => (
        <div>
          {tags.map((tag: string) => 
            <p>
              {tag}
            </p>
          )}
        </div>
      )}
    </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default NewExerciseForm