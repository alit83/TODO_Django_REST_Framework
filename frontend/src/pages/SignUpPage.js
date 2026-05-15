import React, { useContext } from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/vendor/animate/animate.css';
import '../assets/vendor/css-hamburgers/hamburgers.min.css';
import '../assets/vendor/select2/select2.min.css';
import '../assets/css/util.css';
import '../assets/css/main2.css';

import { useAuth } from '../context/AuthContext.js';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../assets/vendor/select2/select2.min.js';
import '../assets/vendor/tilt/tilt.jquery.min.js';
import { useNavigate } from 'react-router-dom';


const SignUpPage = () => {
    const navigate = useNavigate();
    const { registerUser } = useAuth();
    
    let signup = async (e) => {
        e.preventDefault()
        const success = await registerUser(
            e.target.email.value,
            e.target.password.value,
            e.target.password1.value
        );
        
        if(success){
            console.log('User registered and logged in successfully');
            // navigate is handled inside registerUser -> loginUser
        }
    }
    
    // ... rest of your component


    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic js-tilt" data-tilt>
                        <img src={require('../assets/img/img-01.png')} alt="IMG" />
                    </div>

                    <form className="login100-form validate-form" onSubmit={signup}>
                        
                        <span className="login100-form-title">
                            Member registration
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

                        <div className="wrap-input100 validate-input" data-validate="Password is required">
                            <input 
                                className="input100" 
                                type="password" 
                                name="password" 
                                placeholder="Password"
                                required
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>
                         <div className="wrap-input100 validate-input" data-validate="Password is required">
                            <input 
                                className="input100" 
                                type="password" 
                                name="password1" 
                                placeholder="confirm Password"
                                required
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>


                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" type="submit">
                                signup
                            </button>
                        </div>
                        <div className="container-login100-form-btn">


                        </div>
                   
                       
                    </form>
                </div>
            </div>
        </div>
    );

}
export default SignUpPage;