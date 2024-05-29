import React from 'react'
import './Noteeditor.css'
const Noteeditor = () => {
  return (
    <div className="editorContainer">
        <div className="ideContainer">
            <div className="noteIDE">
                <div >
                    <div className="noteImg">
                        <input type="text" id="noteImg" value="Image's link" />
                    </div>
                    <div className="noteHeader">
                        <input type="text" id="noteDate" value="27-04-2024" />
                    </div>
                    <div className="noteClass">
                        <input type="text" id="noteTitle" value="Diary" />
                    </div>
                    <div className="noteBody">
                        <textarea id="noteBodyID" name="body">Today is a good day and I love that.</textarea>
                    </div>
                </div>
            </div>
            <div className="notePreview">
                <div className="noteHeader">
                    <p id="previewDate">27-04-2024</p>
                </div>
                <div className="noteClass">
                    <p id="previewTitle">Diary</p> 
                </div>
                <div className="noteBody">
                    <p id="previewBody">Today is a good day and I love that.</p>
                </div>
            </div>
        </div>
        <button id="noteSave" href="noteView.html">Save & go to view mode</button>
    </div>
  )
}

export default Noteeditor
