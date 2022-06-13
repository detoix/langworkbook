import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import Workbook from "./components/Workbook"
import Excercise from "./components/Exercise"
import Revision from "./components/Revision"
import NewExerciseForm from "./components/NewExerciseForm"

const App = () => {
  return (
    <BrowserRouter>
      <Link to={"/"}>HOME </Link>
      <Link to={"/exercises/new"}> ADD EXERCISE</Link>
      <Link to={"/students/0"}> MY ACCOUNT </Link>
      <Link to={"/students/1"}> OTHER ACCOUNT</Link>
      <Routes>
        <Route path="/" element={<Navigate to="/workbook" />} />
        <Route path="/workbook" element={<Workbook />} />
        <Route path="/exercises/new" element={<NewExerciseForm />} />
        <Route path="/exercises/:id" element={<Excercise />} />
        <Route path="/students/:id" element={<Revision />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App