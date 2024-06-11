import React from 'react'
import './Updatehabit.css'

const Updatehabit = () => {
  return (
    <div className='habitcontainer' >
      <div className="habitEditor">
            <h3 >HABIT CREATOR</h3>
            <div >
                <input type="text" id="habitName" placeholder="Habit Name"/>
                <input type="text" id="habitTime" placeholder="Habit Time"/>
                <input type="checkbox" id="important" name="important"/>
            </div>
            <textarea id="habitDetail" name="body" placeholder="Habit Detail"></textarea>
            <button type="submit" id="habitBTN">CREATE</button>
        </div>
    </div>
  )
}

export default Updatehabit
