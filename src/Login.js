import React,{useState,useEffect,useCallback} from 'react'
import AMlogo from './AMLogo.svg'
import LoginImg from './LoginImg.png'
import googleImg from './GoogleImg.svg'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import http from './http'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {BsFillEyeFill , BsFillEyeSlashFill} from 'react-icons/bs'
import {GoogleLogin} from 'react-google-login'
import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils';
 
function LoginPage() 
{

    let navigate = useNavigate()
    let [Email,setEmail] = useState('')
    let [Password,setPassword] = useState('')
    let [Token,setToken] = useState('')
    let [ShowPass , setShowPass] = useState(false)
    
    const { executeRecaptcha } = useGoogleReCaptcha();
   

    // // Create an event handler so you can call the verification on button click event or form submit or gives recaptcha token
    const handleReCaptchaVerify = useCallback(async () => 
    {
        if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available');
        return;
        }

        const temp = await executeRecaptcha('LOGIN');
        
        setToken(temp)

    },[executeRecaptcha])
   

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);
    

    //------------to show or to hide password -------------------------------------------------------
    const handleShowPassword = () =>
    {

        if(ShowPass)
        {
            document.getElementById('Password').type = 'password'
            setShowPass(false)
        }
        else
        {
            document.getElementById('Password').type = 'text'
            setShowPass(true)
            
        }
    }

    //----------------------------------to check whether field is empty or not ------------------------------
    const handleError = (value,field) =>
    {
        let error =  document.getElementById(`${field}`)
        
        if((field === 'email' || field === 'password') && value === '')
        {
            error.style.display = 'block'
            field === 'email' && (document.getElementById('Email').className = 'form-control is-invalid')
            field === 'password' && (document.getElementById('Password').className = 'form-control is-invalid')
        }
        else
        {
            error.style.display = 'none'
            field === 'email' && (document.getElementById('Email').className = 'form-control')
            field === 'password' && (document.getElementById('Password').className = 'form-control')
        }
    }


    //--------------------------------after submiting details if valid then login otherwise login failed--------------
    const handleSubmit = async(e) =>
    {
        e.preventDefault();

        if(Email === '' || Password === '')
        {
            Email === '' && handleError('','email')
            Password === '' && handleError('','password')

        }
        else
        {
            let btn = document.getElementById('btn')
            btn.disabled = true  
            btn.textContent = 'Logging in...' 

            let loginDetails = {email : Email , password : Password , reCaptchaToken : Token}
            try {
                const data = await http.post('/auth/login',loginDetails)
                // console.log(data);

                localStorage.setItem('token' , JSON.stringify(data.token))
                navigate('/QuestionList')
            } 
            catch (err) {
                btn.disabled = false ;
                btn.textContent = 'Log in';
                console.log(`Error: ${err.message}`);
            }
        }
    }


    const responseGoogle = async(response) =>
    {
        let id_token = response.tokenObj.id_token
        let loginDetails = {idToken : id_token , reCaptchaToken : Token}

        try {
            const data = await http.post('/auth/google',loginDetails)
            // console.log(data);

            localStorage.setItem('googleToken' , JSON.stringify(data.token))
            navigate('/QuestionList')
        } 
        catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }

    return (

            <>
                
                <div className="container">
                    <h1 className="text-center">
                        <img style={{height:"70px",marginTop:"20px"}} className="img-fluid" alt="" src={AMlogo} />
                    </h1>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block border-right py-4 pr-5 bg-primary rounded-left">
                                <img className="img-fluid mt-5" alt='' src={LoginImg} />
                            </div>
                            
                            <div className="col-lg-6 py-5 px-lg-5">
                                <h5 className="card-title mb-4 text-center text-md-left">Login to your account</h5>
                                
                                <form noValidate="" role="form" className="ng-untouched ng-pristine ng-invalid">
                                    <div className ="form-group">
                                        <label >Email address</label>
                                        <input className="form-control ng-untouched ng-pristine ng-invalid" 
                                            formcontrolname="email" 
                                            placeholder="Enter email" 
                                            type="email"
                                            value={Email}
                                            id = "Email"
                                            onChange={(e)=>{setEmail(e.target.value);handleError(e.target.value,'email')}}
                                        />

                                        <span id="email" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}> Email is required</span>
                                    </div>
                                    &nbsp;&nbsp;
                                    
                                    <div className="form-group">
                                        <label>Password</label>
                                    
                                        <div className="input-group mb-3">
                                            <input className="form-control border-right-0 ng-untouched ng-pristine ng-invalid" 
                                                formcontrolname="password" 
                                                placeholder="Password" 
                                                type="password"
                                                value={Password}
                                                onChange={(e)=>{setPassword(e.target.value);handleError(e.target.value,'password')}}
                                                id='Password'  
                                            />
                                            

                                            <div className="input-group-append pointer">
                                                <span className="input-group-text bg-white">
                                                    { ShowPass === false ?
                                                        <BsFillEyeFill style={{cursor:"pointer"}} onClick={handleShowPassword}/>
                                                        :
                                                        <BsFillEyeSlashFill style={{cursor:"pointer"}} onClick={handleShowPassword}/>
                                                    }
                                                </span>
                                            </div>
                                            
                                        </div>
                                        <span id="password" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"-10px"}}> Password is required</span>
                                        
                                        <div>
                                            <a className="text-secondary d-inline-block mt-3" routerlink="/auth/forgot-password" href="/auth/forgot-password">
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex">

                                        <button className="btn btn-primary btn-block" id="btn" type="submit" onClick={handleSubmit}>
                                            Log In
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-center text-muted my-3 small">
                                            OR 
                                        </div>
                            
                                        {/* <button className="btn btn-light" type="button">
                                            <img style={{height: "20px" , width:"20px" ,paddingRight:"4px"}} alt='' src={googleImg}/>
                                                Log in with Google 
                                        </button> */}

                                        <div className = "text-center">
                                            <GoogleLogin 
                                                clientId = "971623344603-0qquan9pcdb9iu7oq9genvpnel77i7oa.apps.googleusercontent.com"
                                                buttonText = "Log in with Google"
                                                onSuccess = {responseGoogle}
                                                onFailure = {responseGoogle}
                                                cookiePolicy = {'single_host_origin'}
                                                
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>


                    <div className="text-center pt-4 mb-2">
                        <a routerlink="/auth/signup" href="/auth/signup">
                            Don't have account, signup now
                        </a>
                    </div>
                    
                </div>
           
            </>
    )
}

export default LoginPage

{/* <div className="container" id="container">
                
                <div className="overlay-container">
                    <div class="overlay">
                        <h1 className="text-center">
                            <img style={{height:"70px",marginTop:"20px"}} className="img-fluid" src={AMlogo} />
                        </h1>
                        <div className="overlay-panel overlay-right">
                            <img style={{height:"70px",marginTop:"20px"}} className="img-fluid" src={AMlogo} />
                        </div>
                    </div>
                </div>
                <div className="form-container log-in-container">
                    <form action="#">
                        
                        <div class="social-container">
                            <a href="#" class="social"><i class="fa fa-facebook fa-2x"></i></a>
                            <a href="#" class="social"><i class="fab fa fa-twitter fa-2x"></i></a>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <a href="#">Forgot your password?</a>
                        <button>Log In</button>
                    </form>
                </div>
        </div> */}