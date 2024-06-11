import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useState,useRef } from 'react'

const Navbar = () => {
  const [menu,setMenu] = useState("shop");
  const menuRef = useRef();
  return (
    <div ref={menuRef} className='navigationBar'>
      <div className="textLogo">
            <Link to='/'>Habit Tracker</Link>
        </div>
            <div className="sectionContainer"> 
            <div onClick={()=>{setMenu("rank")}}style={
              menu === 'rank'
                ? {
                    backgroundColor: 'rgb(62, 164, 189)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    color: 'rgb(235, 242, 250)'
                  }
                : {
                }
            } className="sectionItem">
            <Link
             to='/'>Ranking</Link>
            
            </div>
            <div onClick={()=>{setMenu("home")}} className="sectionItem">
            <Link style={
            menu === 'rank'
              ? {
                  backgroundColor: 'rgb(62, 164, 189)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  color: 'rgb(235, 242, 250)'
                }
              : {}
          } to='/'>Home</Link>
            </div>
            <div onClick={()=>{setMenu("note")}} className="sectionItem">
            <Link style={
            menu === 'rank'
              ? {
                  backgroundColor: 'rgb(62, 164, 189)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  color: 'rgb(235, 242, 250)'
                }
              : {}
          } to='/note'>Note</Link>
            </div>
            <div onClick={()=>{setMenu("habit")}} className="sectionItem">
            <Link style={
            menu === 'rank'
              ? {
                  backgroundColor: 'rgb(62, 164, 189)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  color: 'rgb(235, 242, 250)'
                }
              : {}
          } to='/habit'>Habit</Link>
            </div>
            {localStorage.getItem('auth-token')
            ? <div id='login' onClick={()=>{localStorage.removeItem('auth-token');window.location.replace("/")}}>Logout</div> 
      :
          <div onClick={()=>{setMenu("login")}} id="login"><Link to='/login'>Login</Link>
          </div>}
            
        </div>
    </div>
  )
}

export default Navbar
