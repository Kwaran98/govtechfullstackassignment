import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import TeachersPage from './pages/TeachersPage'
import AddTeacherPage from './pages/AddTeacherPage'
import ClassesPage from './pages/ClassesPage'
import AddClassPage from './pages/AddClassPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Navigate to="/teachers" replace />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/new" element={<AddTeacherPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/new" element={<AddClassPage />} />
          <Route path="*" element={<Navigate to="/teachers" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App