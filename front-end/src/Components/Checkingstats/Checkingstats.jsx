import React from 'react'
import './Checkingstats.css'
import Currentprogress from '../Currentprogress/Currentprogress'
import Calendar from '../Calendar/Calendar'
import Pinned from '../Pinned/Pinned'

const Checkingstats = () => {
  return (
    <div className='habitContainer'>
        <Currentprogress />
        <Calendar />
        <Pinned />
        
    </div>
  )
}

export default Checkingstats
