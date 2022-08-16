import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import Workbook from "./components/Workbook"
import Excercise from "./components/Exercise"
import NewExerciseForm from "./components/NewExerciseForm"
import { AppBar, Button, Stack, Toolbar } from "@mui/material"

const App = () => {
  return (
    <BrowserRouter>
      <Stack spacing={1}>
        <AppBar position="sticky">
          <Toolbar>
            <Button color="inherit" component={Link} to={"/workbook/"}>HOME</Button>
            <Button color="inherit" component={Link} to={"/workbook/exercises/new"}>ADD EXERCISE</Button>
            <Button color="inherit" component={Link} to={"/workbook/students/0"}> MY ACCOUNT</Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Navigate to="/workbook" />} />
          <Route path="/workbook" element={<Workbook />} />
          <Route path="/workbook/exercises/new" element={<NewExerciseForm />} />
          <Route path="/workbook/exercises/new/clear" element={<Navigate to="/workbook/exercises/new" />} />
          <Route path="/workbook/exercises/:id" element={<Excercise />} />
          <Route path="/workbook/students/:id" element={<Workbook />} />
        </Routes>
      </Stack>
    </BrowserRouter>
  )
}

export default App