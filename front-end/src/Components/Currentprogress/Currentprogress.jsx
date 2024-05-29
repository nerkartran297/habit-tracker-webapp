import React from 'react'
import './Currentprogress.css'
const Currentprogress = () => {
  return (
    <div className="currentProgress">
    <p>
        My progress in learning some skills:
    </p>
    <a href="habit.html">Click here for a full view:</a>
    <div className="skillBoard">
        <div className="skillStat">
            <div className="skillName">JS: </div>
            <div className="progressBar">
                <div className="progressStat" style={{ width: '50%' }}></div>
            </div>
        </div>
        <div className="skillStat">
            <div className="skillName">HTML: </div>
            <div className="progressBar">
                <div className="progressStat" style={{ width: '30%' }}></div>
            </div>
        </div>
        <div className="skillStat">
            <div className="skillName">CSS: </div>
            <div className="progressBar">
                <div className="progressStat" style={{ width: '40%' }}></div>
            </div>
        </div>
    </div>
    
</div>
  )
}

export default Currentprogress
