import React from 'react'
import { Link } from 'react-router-dom'
import './Note.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'

const Note = ({notes}) => {
  return (
    <div className="noteContainer">
      
      <Link to="/noteview">
                <img src={notes.image}/>
                <div className="noteIntro">
                    <div >
                        <h3 >{notes.title}</h3>
                        <p >{notes.createdAt}</p>
                    </div>
                    <p>
                            {notes.content}
                    </p>
                </div>
        </Link>
    </div>
  )
}

export default Note
