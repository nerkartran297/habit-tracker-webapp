import React from 'react'
import './Noteview.css'
import IMG_1878 from '../../Assets/IMG_1878.JPG'
import { Link } from 'react-router-dom'

const Noteview = () => {
  return (
    <div className="editorContainer">
        <div className="viewContainer">
            <div className="noteCover">
                <img src={IMG_1878}/>
            </div>
            <div className="notePreview">
                <div >
                    <div >
                        <div className="noteHeader">
                            <p id="previewDate">27-04-2024</p>
                        </div>
                        <Link to="/noteeditor" className='enterEdit'>Click here to edit</Link>
                    </div>
                    <div className="noteClassName">
                        <p id="previewTitle" >Diary</p> 
                    </div>
                    <div className="noteBody">
                        <p id="previewBody">Today is a good day and I love that.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Noteview
