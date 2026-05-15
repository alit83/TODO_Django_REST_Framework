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



const ForgetPasswordPage = () => {
    const navigate = useNavigate();
     let forgetpassword = async (e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/accounts/api/v1/forget-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: e.target.email.value})
        });
            if(response.status === 200){
                console.log('shod<');
                
                navigate('/login');
            }
    }
    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic js-tilt" data-tilt>

                    </div>

                    <form className="login100-form validate-form" onSubmit={forgetpassword}>
                        
                        <span className="login100-form-title">
                            forget password page
                        </span>

                        <div className="wrap-input100 validate-input">
                            <input 
                                className="input100" 
                                type="email" 
                                name="email" 
                                placeholder="Email / Username"
                                required
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>




                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" type="submit">
                                send
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

export default ForgetPasswordPage;