import React from 'react'
import './Calendar.css'

const Calendar = () => {
  return (
    <div className="calendar">
            <div className="calendarLine dayName">
                <div className="calendarDay">Mo</div>
                <div className="calendarDay">Tu</div>
                <div className="calendarDay">We</div>
                <div className="calendarDay">Th</div>
                <div className="calendarDay">Fr</div>
                <div className="calendarDay">Sa</div>
                <div className="calendarDay" 
                style={{ backgroundColor: 'rgb(225, 129, 129)', borderRadius: '20px', width: '50%' }}
                >Su</div>
            </div>
            <div className="calendarLine">
                <div className="calendarDay">01</div>
                <div className="calendarDay">02</div>
                <div className="calendarDay">03</div>
                <div className="calendarDay">04</div>
                <div className="calendarDay">05</div>
                <div className="calendarDay">06</div>
                <div className="calendarDay">07</div>
            </div>
            <div className="calendarLine">
                <div className="calendarDay">08</div>
                <div className="calendarDay">09</div>
                <div className="calendarDay">10</div>
                <div className="calendarDay">11</div>
                <div className="calendarDay">12</div>
                <div className="calendarDay">13</div>
                <div className="calendarDay">14</div>
            </div>
            <div className="calendarLine">
                <div className="calendarDay">15</div>
                <div className="calendarDay">16</div>
                <div className="calendarDay">17</div>
                <div className="calendarDay">18</div>
                <div className="calendarDay">19</div>
                <div className="calendarDay">20</div>
                <div className="calendarDay">21</div>
            </div>
            <div className="calendarLine">
                <div className="calendarDay">22</div>
                <div className="calendarDay">23</div>
                <div className="calendarDay" 
                style={{ backgroundColor: 'rgb(225, 129, 129)', borderRadius: '20px', animation: 'glow 2s infinite alternate' }}
                >24</div>
                <div className="calendarDay">25</div>
                <div className="calendarDay">26</div>
                <div className="calendarDay">27</div>
                <div className="calendarDay">28</div>
            </div>
            <div className="calendarLine">
                <div className="calendarDay">29</div>
                <div className="calendarDay">30</div>
                <div className="calendarDay">31</div>
                <div className="calendarDay nextMonth">01</div>
                <div className="calendarDay nextMonth">02</div>
                <div className="calendarDay nextMonth">03</div>
                <div className="calendarDay nextMonth">04</div>
            </div>
        </div>

  )
}

export default Calendar
