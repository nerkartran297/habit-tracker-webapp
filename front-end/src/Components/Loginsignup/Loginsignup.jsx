import React from 'react'
import './Loginsignup.css'
import { useState } from 'react'

const Loginsignup = () => {
    const [isActive, setIsActive] = useState(false);

    const [formData,setFormData] = useState({
      username:"",
      password:"",
      email:""
    })

    const handleRegisterClick = () => {
      setIsActive(true);
    };
  
    const handleLoginClick = () => {
      setIsActive(false);
    };
  
   
  
    const changeHandler = (e) =>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    const signup = async () =>{
      console.log("signup Function Excuted",formData);
      let responseData;
      await fetch('/signup',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      }).then((response)=> response.json()).then((data)=>responseData=data)
    
      if(responseData.success) {
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      }
      else {
        alert(responseData.errors)
      }
    
    }

    const login = async () =>{
      console.log("Login Function Excuted",formData)
      let responseData;
      await fetch('/login',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      }).then((response)=> response.json()).then((data)=>responseData=data)
    
      if(responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      }
      else {
        alert(responseData.message)
      }
    }

    return (
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fab fa-github"></i></a>
              <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Name" />
            <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email" />
            <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
            <button onClick={()=>{signup()}}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fab fa-github"></i></a>
              <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email password</span>
            <input name='email' type="email" value={formData.email} onChange={changeHandler} placeholder="Email" />
            <input name='password' type="password" value={formData.password} onChange={changeHandler} placeholder="Password" />
            <a href="#">Forget Your Password?</a>
            <button onClick={()=>{login()}} >Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Loginsignup
