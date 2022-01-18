import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Login from './Login'

function RecaptchaComponent() {
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5" >
            <Login/>
        </GoogleReCaptchaProvider>
    )
}
           
export default RecaptchaComponent