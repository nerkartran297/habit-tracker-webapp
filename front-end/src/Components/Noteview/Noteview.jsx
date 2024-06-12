import React from 'react'
import './Noteview.css'
import IMG_1878 from '../../Assets/IMG_1878.JPG'
import { Link } from 'react-router-dom'

const Noteview = ({note}) => {
    if (!note) {
        return null; // Return null if the note prop is null or undefined
      }

      
  return (
    <div className="editorContainer">
        <div className="viewContainer">
            <div className="noteCover">
                {/* <img src={note.image}/> */}
            </div>
            <div className="notePreview">
                <div >
                    <div >
                        <div className="noteHeader">
                            <p id="previewDate">{note.createdAt}</p>
                        </div>
                        <Link to={`/noteeditor/${note.id}`} className='enterEdit'>Click here to edit</Link>
                    </div>
                    <div className="noteClassName">
                        <p id="previewTitle" >{note.title}</p> 
                    </div>
                    <div className="noteBody">
                        <p id="previewBody">{note.content}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Noteview
