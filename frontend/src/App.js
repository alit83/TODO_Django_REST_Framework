import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgetPasswordPage from './pages/ForgetPasswordPage'
import Header from './components/Header'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import ChangePasswordPage from './pages/ChangePasswordPage'
function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignUpPage/>}/>
                    <Route path="/verify" element={<VerifyEmailPage/>}/>
                    <Route path="/forget-password" element={<ForgetPasswordPage/>}/>
                    <Route path="/verify-email/:uidb64/:token/" element={<ChangePasswordPage/>}/>
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;