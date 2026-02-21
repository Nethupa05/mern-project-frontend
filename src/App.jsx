import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home.jsx'
import LoginPage from './pages/login.jsx'
import SignUpPage from './pages/signup.jsx'
import Header from './components/header.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/testPage.jsx'
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        {/* <Header/> */}
        <Routes path="/*">
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignUpPage />}/>
          <Route path="/testing" element={<TestPage />}/>
          <Route path="/*" element={<h1>404 Not Found</h1>}/>
          <Route path="/admin/*" element={<AdminPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
