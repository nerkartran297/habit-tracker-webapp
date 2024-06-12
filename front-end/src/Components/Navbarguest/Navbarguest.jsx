import React from 'react'
import './Navbarguest.css'
import { Link } from 'react-router-dom'

const Navbarguest = () => {
    return (
        <div  className='navigationBarguets'>
            <div className="textLogo">
                <Link to='/' style={{textDecoration: 'none'}}>Habit Tracker</Link>
            </div>
            <div className="sectionContainerguest"> 
                <div  id="loginguest">
                    <Link to='/login'>Login</Link>
                </div>
             </div>
        </div>
              
    )
}

export default Navbarguest
