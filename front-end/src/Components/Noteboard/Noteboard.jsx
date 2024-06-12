import React from 'react'
import './Noteboard.css'
import Notesearch from '../Notesearch/Notesearch'
import Note from '../Note/Note'
import { useContext } from 'react'
import { NoteContext } from '../../Context/NoteContext'
const Noteboard = () => {
  const { notes } = useContext(NoteContext)
  return (
    <div>
      <Notesearch />
      <div class="noteLine">
      {notes.map((note, i) => (
      <Note key={i} notes={note}/>
        ))}
      </div>
      
      
    </div>
  )
}

export default Noteboard
