import React from 'react'
import Noteview from '../Components/Noteview/Noteview'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import {useContext} from 'react'
import {NoteContext} from '../Context/NoteContext'
import { useParams } from 'react-router-dom'
const Noteviewpage = () => {
  const {noteId} = useParams();
  const {notes} = useContext(NoteContext)
  const note = notes.find((e)=> e.id === noteId);
  return (
    <div>
      <Navbar />
      <Noteview  />
      <Footer />
    </div>
  )
}

export default Noteviewpage
