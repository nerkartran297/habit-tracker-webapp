import React from 'react'
import { Link } from 'react-router-dom'
import './Note.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'

const Note = () => {
  return (
    <div className="noteContainer">
      <Link to="/noteview">
                <img src={IMG_1877}/>
                <div className="noteIntro">
                    <div >
                        <h3 >About me</h3>
                        <p >29/5</p>
                    </div>

                    <p>
                            Today I feel so happy. My mom sent me 12 cute gifts yesterday.
                    </p>
                </div>
        </Link>
    </div>
  )
}

export default Note
