import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import NewPassword from "./pages/NewPassword"
import ConfirmAccount from "./pages/ConfirmAccount"
import { AuthProvider } from "./context/AuthProvider"
import ProtectedRoute from "./layouts/ProtectedRoute"
import HomePage from "./pages/HomePage"
import { ChatProvider } from "./context/ChatProvider"



function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<AuthLayout/>}>
                <Route index element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="forgot-password" element={<ForgotPassword/>}/>
                <Route path="forgot-password/:token" element={<NewPassword/>}/>
                <Route path="confirm/:id" element={<ConfirmAccount/>}/>
              </Route>
            
              <Route path="/chat" element={<ProtectedRoute />}>
                <Route index element={<HomePage />}/>
              </Route>
            </Routes>
        
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
