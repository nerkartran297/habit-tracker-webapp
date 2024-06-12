import React from 'react'
import './Yourlist.css'
import Todo from '../Todo/Todo'
import Alarm from '../Alarm/Alarm'
import Description from '../Description/Description'
import Updatehabit from '../Updatehabit/Updatehabit'
const Yourlist = () => {
  return (
    <div className='habitContainer'>
      <Todo />
      <Alarm />
      <Description />
      {/* <Updatehabit /> */}
    </div>
  )
}

export default Yourlist
