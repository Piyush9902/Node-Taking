import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/Auth'
import NotesPage from './pages/Notes'
import { useAtom } from 'jotai'
import { tokenAtom } from './state/auth'
import { useEffect } from 'react'
import './App.css'

function App() {
  const [token] = useAtom(tokenAtom)

  useEffect(() => {
    document.body.classList.add('theme')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <NotesPage /> : <AuthPage />} />
        <Route path="/notes" element={token ? <NotesPage /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
