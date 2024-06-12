import React from 'react'
import Loginsignup from '../Components/Loginsignup/Loginsignup'
import './CSS/Login.css'
import Footer from '../Components/Footer/Footer'
import Navbarguest from '../Components/Navbarguest/Navbarguest'

const Loginsignuppage = () => {
  return (
    <div>
      <Navbarguest />
    <div className='loginSignup'>
      <Loginsignup />
    </div>
    <Footer />
    </div>
    
  )
}

export default Loginsignuppage
