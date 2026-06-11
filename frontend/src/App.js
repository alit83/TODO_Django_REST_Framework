import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import VerifyEmailConfirmPage from './pages/VerifyEmailConfirmPage'
import ForgetPasswordPage from './pages/ForgetPasswordPage'
import Header from './components/Header'
import PrivateRoute from './utils/PrivateRoute'
import PrivateRoute2 from './utils/PrivateRoute2'
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
                    <Route path="/login" element={<PrivateRoute2><LoginPage/></PrivateRoute2>}/>
                    <Route path="/signup" element={<PrivateRoute2><SignUpPage/></PrivateRoute2>}/>
                    <Route path="/verify" element={<VerifyEmailPage/>}/>
                    <Route path="/forget-password" element={<PrivateRoute2><ForgetPasswordPage/></PrivateRoute2>}/>
                    <Route path="/verify-email/:uidb64/:token/" element={<ChangePasswordPage/>}/>
                    <Route path="/confirm-email/:uidb64/:token/" element={<VerifyEmailConfirmPage/>}/>
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;