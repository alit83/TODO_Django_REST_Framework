import React, { useContext } from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/vendor/animate/animate.css';
import '../assets/vendor/css-hamburgers/hamburgers.min.css';
import '../assets/vendor/select2/select2.min.css';
import '../assets/css/util.css';
import '../assets/css/main2.css';


import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../assets/vendor/select2/select2.min.js';
import '../assets/vendor/tilt/tilt.jquery.min.js';
import { useNavigate } from 'react-router-dom';



const VerifyEmailPage = () => {
    const navigate = useNavigate();
     let verifyemail = async (e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/accounts/api/v1/verify-email-resend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: e.target.email.value, password: e.target.password.value,password1: e.target.password1.value })
        });

    }
    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">

                    <form className="login100-form validate-form" onSubmit={verifyemail}>
                        
                        <span className="login100-form-title">
                            verify your email please
                        </span>


                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" type="submit">
                                resend verfication email
                            </button>
                        </div>
                        <div className="container-login100-form-btn">

                        </div>
 
                   
                       
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;