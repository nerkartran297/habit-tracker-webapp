import React from 'react'
import './Alarm.css'

const Alarm = () => {
  return (
    <div class="alarmContainer">
    <div class="alarmLine">
        <div class="alarmInfo emergency">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Wake Up!</h3>
                <p >6:30 AM</p>
            </div>
        </div>
        <div class="alarmInfo emergency">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Go 2 school</h3>
                <p >7:30 AM</p>
            </div>
        </div>
        <div class="alarmInfo emergency">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Task 3</h3>
                <p >9:30 AM</p>
            </div>
        </div>
    </div>
    <div class="alarmLine">
        <div class="alarmInfo calm">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Have a tea</h3>
                <p >1:30 PM</p>
            </div>
        </div>
        <div class="alarmInfo calm">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Eating</h3>
                <p >4:30 PM</p>
            </div>
        </div>
        <div class="alarmInfo calm">
            <i class="fa-solid fa-bell" ></i>
            <div >
                <h3 >Go to sleep</h3>
                <p >10:30 PM</p>
            </div>
        </div>
    </div>
</div>
  )
}

export default Alarm
