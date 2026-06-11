import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';


const PrivateRoute2 = ({ children }) => {
    const { user , is_verify} = useContext(AuthContext);

    if (user) {
        return <Navigate to="/" />;
    }

    if (is_verify === true) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute2;