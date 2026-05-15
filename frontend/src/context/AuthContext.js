import { createContext, useState , useEffect,useContext} from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (email,password) => {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/v1/jwt/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password })
        });

        let data = await response.json();

        if(data){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            setLoading(false)
            navigate('/')
        } else {
            alert('Something went wrong while logging in the user!')
        }
    }

    let logoutUser = (e) => {
    e.preventDefault()
    localStorage.removeItem('authTokens')
    setAuthTokens(null)
    setUser(null)
    navigate('/login')
    }
    let registerUser = async (email, password, password1) => {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/v1/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, password1 })
        });
        
        if(response.status === 201){
            // Auto-login after successful registration
            console.log('tst');
            
            return await loginUser(email, password);
        }
        return false;
    }
    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/v1/jwt/refresh-token/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            
            body:JSON.stringify({refresh:authTokens?.refresh})
        })
        
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }



    useEffect(()=>{

        const REFRESH_INTERVAL = 1000 * 60 * 10 // 10 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens , loading])

    return(
        <AuthContext.Provider value={{ user, authTokens, loginUser, registerUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);