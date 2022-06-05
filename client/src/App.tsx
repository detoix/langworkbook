import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Workbook from './components/Workbook'
import Excercise from './components/Exercise'
import Classroom from './components/Classroom'

const App = () => {
  return (
    <BrowserRouter>
      <Link to={'/'}>HOME </Link>
      <Link to={'/students/0'}> MY ACCOUNT </Link>
      <Link to={'/students/1'}> OTHER ACCOUNT</Link>
      <Routes>
        <Route path='/' element={<Navigate to='/workbook' />} />
        <Route path='/workbook' element={<Workbook />} />
        <Route path='/workbook/:id' element={<Excercise />} />
        <Route path='/students/:id' element={<Classroom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App