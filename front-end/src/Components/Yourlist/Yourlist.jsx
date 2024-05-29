import React from 'react'
import './Yourlist.css'
import Todo from '../Todo/Todo'
import Alarm from '../Alarm/Alarm'
import Description from '../Description/Description'
const Yourlist = () => {
  return (
    <div className='habitContainer'>
      <Todo />
      <Alarm />
      <Description />
    </div>
  )
}

export default Yourlist
