import axios from "axios"
import { Buffer } from "buffer";
import { IdCarrier, Excercise, NewExercise, ExerciseSolution } from "../models/excercise"
import { Query } from "../models/query"

let parser = document.createElement("a")
parser.href = (document.currentScript as any).src
parser.port = parser.port.replace('3000', '8080') //redirect for local development
const url = parser.origin

const getExercises = async (query: Query) => {
  const searchParams = new URLSearchParams()
  searchParams.set("offset", query.offset.toString())
  searchParams.set("limit", query.limit.toString())
  searchParams.set("tags", query.tags.toString())

  const res = await axios.get<Excercise[]>(url + "/exercises?" + searchParams.toString())
  return res.data
}

const getTags = async () => {
  const res = await axios.get<string[]>(url + "/tags")
  return res.data
}

const getMyExercises = async (props: IdCarrier) => {
  const res = await axios.get<Excercise[]>(url + "/students/" + props.id + "/exercises")
  return res.data
}

const deleteExercise = async (student: IdCarrier, exercise: IdCarrier) => {
  const searchParams = new URLSearchParams()
  searchParams.set("studentId", student.id.toString())

  const res = await axios.delete<Excercise>(url + "/exercises/" + exercise.id + "?" + searchParams.toString())
  return res.data
}

const getExercise = async (props: IdCarrier) => {
  const res = await axios.get<Excercise>(url + "/exercises/" + props.id)
  return res.data
}

const solveExcercise = async (student: IdCarrier, exercise: ExerciseSolution) => {
  const res = await axios.post<any>(url + "/students/" + student.id + "/exercises/" + exercise.id, exercise)
  return res.data
}

const createExercise = async (exercise: NewExercise) => {
  const res = await axios.post<any>(url + "/exercises", exercise)
  return res.data
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Encoded = base64String.split(',')[1];
      resolve(base64Encoded);
    };

    reader.onerror = () => {
      reject(new Error("Failed to convert Blob to base64."));
    };

    reader.readAsDataURL(blob);
  });
}

const ocr = async (blob: Blob) => {
  const formData = new FormData();

  const base64Data = await blobToBase64(blob)
  const bufferData = Buffer.from(base64Data, 'base64');
  formData.append('image', new Blob([bufferData], { type: 'image/jpeg' }));


  const res = await axios.post<any>("https://website.objectequals.com", formData, { headers: { 'Content-Type': 'multipart/form-data', }})
  return res.data.text
}

export {
  getMyExercises,
  getExercise,
  getExercises,
  getTags,
  solveExcercise,
  createExercise,
  deleteExercise,
  ocr,
}