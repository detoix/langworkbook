import axios from "axios"

const url = "http://localhost:8080"

const getExercises = async () => {
  const res = await axios.get(url + "/exercises")
  return res.data
}

const getMyExercises = async (id:any) => {
  const res = await axios.get(url + "/students/" + id.id + "/exercises")
  return res.data
}

const getExercise = async (id:any) => {
  const res = await axios.get(url + "/exercises/" + id.id)
  return res.data
}

const solveExcercise = (student: any, exercise: any) => {
  return axios.post(url + "/students/" + student.id + "/exercises/" + exercise.id, exercise)
}

export {
  getMyExercises,
  getExercise,
  getExercises,
  solveExcercise
}