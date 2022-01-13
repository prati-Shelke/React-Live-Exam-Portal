import React,{useState,useEffect,useCallback} from 'react'
import AMlogo from './AMlogo.svg'
import LoginImg from './LoginImg.png'
import googleImg from './googleImg.svg'
import eyeImg from './eye.svg'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

 
function LoginPage() 
{


    let [Email,setEmail] = useState('')
    let [Password,setPassword] = useState('')
    let [reCaptchaToken,setreCaptchaToken] = useState('')
    let [ShowPass , setShowPass] = useState(false)
    
    const { executeRecaptcha } = useGoogleReCaptcha();
    console.log(Email,Password);

    // // Create an event handler so you can call the verification on button click event or form submit or gives recaptcha token
    const handleReCaptchaVerify = useCallback(async () => 
    {
        if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available');
        return;
        }

        const token = await executeRecaptcha('LOGIN');
        // console.log(token);
        setreCaptchaToken(token)

    },[executeRecaptcha])


    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);
    

    const showPassword = () =>
    {
        setShowPass(!ShowPass)

        if(ShowPass === true)
        {
            document.getElementById('password').type = 'text'
        }
        else
        {
            document.getElementById('password').type = 'password'
        }
    }


    return (

            <>
                
                <div className="container">
                    <h1 className="text-center">
                        <img style={{height:"70px",marginTop:"20px"}} className="img-fluid" src={AMlogo} />
                    </h1>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block border-right py-4 pr-5 bg-primary rounded-left">
                                <img className="img-fluid mt-5" src={LoginImg} />
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
                                            onChange={(e)=>setEmail(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Password</label>
                                    
                                        <div className="input-group mb-3">
                                            <input className="form-control border-right-0 ng-untouched ng-pristine ng-invalid" 
                                                formcontrolname="password" 
                                                placeholder="Password" 
                                                type="password"
                                                value={Password}
                                                onChange={(e)=>setPassword(e.target.value)}
                                                id='password'  
                                            />
                                            
                                            <div className="input-group-append pointer">
                                                <span className="input-group-text bg-white">
                                                    <img style={{height: "18px" , width: "18px"}} style={{cursor:"pointer"}} onClick={showPassword} src={eyeImg}/>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <a className="text-secondary d-inline-block mt-3" routerlink="/auth/forgot-password" href="/auth/forgot-password">
                                            Forgot password?
                                        </a>
                                    </div>
                                    
                                    <div className="d-flex">
                                        <button className="btn btn-primary btn-block" type="submit">
                                            Log In
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-center text-muted my-3 small">
                                            OR 
                                        </div>
                            
                                        <button className="btn btn-light" type="button">
                                            <img style={{height: "20px" , width:"20px" ,paddingRight:"4px"}} src={googleImg}/>
                                                Log in with Google 
                                        </button>
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