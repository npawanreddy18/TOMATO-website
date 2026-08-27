import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({setShowLogin}) => {

const [currState,setCurrState] = useState("Login")

  return (
    <div className='login-popup'>
      <form className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            {currState==="Login"?<></> :<input type="text" placeholder='Your name' required />}           
            <input type="email" placeholder='email' required />
            <input type="Password" placeholder='Password' required />
        </div>
        <button>{currState==="sign up"?"Create account":"Login"}</button>
        <div className="login-popup-codition">
            <input type="checkbox" required/>
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
        ?<p>Create a new Account?<span onClick={()=>setCurrState("Sign up")}> Click here</span></p>
        : 
        <p>Already have a Account?<span onClick={()=>setCurrState("Login")}> Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
