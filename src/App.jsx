import { Route, Router, Routes } from "react-router-dom"
import { LoginForm } from "./components/LoginForm"
import { CreateUpdateExam } from "./pages/CreateUpdateExam"
import { DashboardExamCreator } from "./pages/DashboardExamCreator"
import { DashboardParticipant } from "./pages/DashboardParticipant"
import { DoingExam } from "./pages/DoingExam"
import { Login } from "./pages/Login"

import './App.css'
function App() {
  return (
    <div className="app">
      <div id="attribution">
        Image by <a target={'_blank'} href="https://www.freepik.com/free-vector/white-abstract-background_11771164.htm#query=website%20background&position=47&from_view=keyword">Freepik</a>
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/participant" element={<DashboardParticipant />} />
        <Route path="/participant/:examid" element={<DoingExam />} />
        <Route path="/exam-creator" element={<DashboardExamCreator />} />
        <Route path="/exam-creator/create" element={<CreateUpdateExam />} />
      </Routes>
    </div>
  )
}

export default App
