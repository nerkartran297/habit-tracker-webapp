import React from 'react'
import './Dashboard.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'
import Calendar from '../Calendar/Calendar'
import Selfintro from '../Selfintro/Selfintro'
import Currentprogress from '../Currentprogress/Currentprogress'
import Webintro from '../Webintro/Webintro'

const Dashboard = () => {
  return (
    <div className='dashBoard'>
        <Selfintro />
        <Currentprogress />
        <Calendar />
        <Webintro />
    </div>
  )
}

export default Dashboard
