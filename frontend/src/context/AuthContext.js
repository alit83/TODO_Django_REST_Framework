import { createContext, useState , useEffect,useContext} from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
};

const AuthContext = createContext()

export default AuthContext;
    const checkServerStatus = async () => {
        try {
            
             const authTokens = JSON.parse(localStorage.getItem('authTokens'))

             
          await fetch('http://127.0.0.1:8000/accounts/api/v1/jwt/verify/', { method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            
            body:JSON.stringify({token:String(authTokens.access)}) });
        } catch (error) {
          
          localStorage.removeItem('authTokens');
          localStorage.removeItem('email');
          
          // Server unavailable - clear everything

    
        }
      };
      
export const AuthProvider = ({children}) => {
    useEffect(() => {
    checkServerStatus();
}, []);
    let [user, setUser] = useState(() => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));

        if (!tokens?.access) {
            return null;
        }

        return jwtDecode(tokens.access);
    } catch (err) {
        localStorage.removeItem('authTokens');
        return null;
    }
});
    let [email, setEmail] = useState(() => localStorage.getItem('email') || null);
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(false)

    const navigate = useNavigate()

      
      
    let loginUser = async (email,password) => {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/v1/jwt/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password })
        });

        const data = await response.json();

        if(response.ok){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            setEmail(data.email)
            if(data.is_verified ==false) {
            setLoading(false);
            navigate('/verify');
        } else {
            setLoading(false);
            navigate('/');
        }
        } else {
            alert('Something went wrong while logging in the user!')
        }
    }

    let logoutUser = () => {
    
    localStorage.removeItem('authTokens');
    localStorage.removeItem('email');

    setAuthTokens(null);
    setUser(null);
    setEmail(null);

    navigate('/login');
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
            console.log(response)
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }



   useEffect(() => {
    if (authTokens?.access) {
        if (isTokenExpired(authTokens.access)) {
            updateToken();
        }
    }
}, []);
    return(
        <AuthContext.Provider value={{ user, authTokens, loginUser, registerUser, loading ,email , logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);