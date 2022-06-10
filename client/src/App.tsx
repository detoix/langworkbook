import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import Workbook from "./components/Workbook"
import Excercise from "./components/Exercise"
import Class from "./components/Class"

const App = () => {
  return (
    <BrowserRouter>
      <Link to={"/"}>HOME </Link>
      <Link to={"/students/0"}> MY ACCOUNT </Link>
      <Link to={"/students/1"}> OTHER ACCOUNT</Link>
      <Routes>
        <Route path="/" element={<Navigate to="/workbook" />} />
        <Route path="/workbook" element={<Workbook />} />
        <Route path="/exercises/:id" element={<Excercise />} />
        <Route path="/students/:id" element={<Class />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App