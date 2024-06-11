import React from 'react'
import { Link } from 'react-router-dom'
import './Note.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'

const Note = (props) => {
  return (
    <div className="noteContainer">
      <Link to="/noteview">
                <img src={props.image}/>
                <div className="noteIntro">
                    <div >
                        <h3 >{props.title}</h3>
                        <p >{props.createdAt}</p>
                    </div>
                    <p>
                            {props.content}
                    </p>
                </div>
        </Link>
    </div>
  )
}

export default Note
