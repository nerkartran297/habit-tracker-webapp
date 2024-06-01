import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  return (
    <div className='navigationBar'>
      <div className="textLogo">
            <Link to='/'>Habit Tracker</Link>
        </div>
        <div className="sectionContainer"> 
            <div className="sectionItem">
            <Link to='/'>Ranking</Link>
            </div>
            <div className="sectionItem active">
            <Link to='/'>Home</Link>
            </div>
            <div className="sectionItem">
            <Link to='/note'>Note</Link>
            </div>
            <div className="sectionItem">
            <Link to='/habit'>Habit</Link>
            </div>
            <div id="login">
            <Link to='/login'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar
