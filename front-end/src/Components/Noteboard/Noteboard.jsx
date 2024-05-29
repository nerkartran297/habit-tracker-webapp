import React from 'react'
import './Noteboard.css'
import Notesearch from '../Notesearch/Notesearch'
import Note from '../Note/Note'

const Noteboard = () => {
  return (
    <div>
      <Notesearch />
      <div class="noteLine">
      <Note />
      </div>
      
    </div>
  )
}

export default Noteboard
