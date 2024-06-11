import React from 'react'
import './Currentprogress.css'
import { Link } from 'react-router-dom'
const Currentprogress = () => {
  return (
    <div className="currentProgress">
    <p>
        My progress in learning some skills:
    </p>
    <Link to='/habit' style={{color: 'rgb(47, 99, 204)'}}>Click here for a full view:</Link>
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
