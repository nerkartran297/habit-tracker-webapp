import React from 'react'
import Loginsignup from '../Components/Loginsignup/Loginsignup'
import './CSS/Login.css'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'

const Loginsignuppage = () => {
  return (
    <div>
      <Navbar />
    <div className='loginSignup'>
      <Loginsignup />
    </div>
    <Footer />
    </div>
    
  )
}

export default Loginsignuppage
