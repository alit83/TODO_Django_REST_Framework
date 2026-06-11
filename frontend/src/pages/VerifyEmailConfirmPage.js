import React, { useContext , useState } from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/vendor/animate/animate.css';
import '../assets/vendor/css-hamburgers/hamburgers.min.css';
import '../assets/vendor/select2/select2.min.css';
import '../assets/css/util.css';
import '../assets/css/main2.css';

import AuthContext from '../context/AuthContext.js';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../assets/vendor/select2/select2.min.js';
import '../assets/vendor/tilt/tilt.jquery.min.js';
import { useParams,useNavigate } from 'react-router-dom';

function VerifyEmailConfirmPage() {
    const [is_verify, setIs_verify] = useState(() => localStorage.getItem('is_verify') || false);
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
        
    const verify_email = async (e) => {
        e.preventDefault()
        let response = await fetch(`http://127.0.0.1:8000/accounts/api/v1/verify-email/${uidb64}/${token}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
            if(response.status === 200){
                console.log('shod<');
                setIs_verify(true); 
                localStorage.setItem('is_verify', 'true');
                navigate('/');
            }
    }


    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                <button onClick={verify_email}>verify</button>
                </div>
            </div>
        </div>
    );

};
export default VerifyEmailConfirmPage;