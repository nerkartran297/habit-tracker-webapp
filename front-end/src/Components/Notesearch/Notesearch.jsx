import React from 'react'
import { Link } from 'react-router-dom'
import './Notesearch.css'

const Notesearch = () => {
  return (
    <div class="noteSearch">
            <div >
                <Link to="/noteeditor" className='createNoteBtn'>Create a new note</Link>
                <div>
                    Sort by:
                    <select id="finder">
                        <option value="date">Date</option>
                        <option value="context">Context</option>
                        <option value="image">Image</option>
                    </select>
                </div>
            </div>
        </div>
  )
}

export default Notesearch
