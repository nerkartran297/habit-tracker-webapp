import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Noteboard from '../Components/Noteboard/Noteboard'
import './CSS/Notepage.css'

const Note = () => {
  return (
    <div>
      <Navbar />
      <div className="noteBoard">
        <Noteboard />
    </div>
    </div>
    
  )
}

export default Note
