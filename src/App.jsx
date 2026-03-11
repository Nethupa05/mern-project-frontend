import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home.jsx'
import LoginPage from './pages/login.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/testPage.jsx'
import RegisterPage from './pages/register.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';


import { Toaster } from 'react-hot-toast';
import ForgetPasswordPage from './pages/forgetPassword.jsx'

function App() {

  return (
    <GoogleOAuthProvider clientId="874206426519-gutfk7g7jhjt8752jn272kna9ip5aiha.apps.googleusercontent.com">
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        {/* <Header/> */}
        <Routes path="/*">
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/forget" element={<ForgetPasswordPage />}/>
          <Route path="/signup" element={<RegisterPage />}/>
          <Route path="/testing" element={<TestPage />}/>
          <Route path="/*" element={<HomePage />}/>
          <Route path="/admin/*" element={<AdminPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
