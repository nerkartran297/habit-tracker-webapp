import React from 'react'
import './Selfintro.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'
const Selfintro = () => {
  return (
    <div className="selfIntro">
            <img src={IMG_1877}/>
            <div>
                <h3>About me</h3>
                <p>
                    Hi, I'm Tran Nhat Khanh, a second-year
                    college student with a passion for coding.
                </p>
            </div>
    </div>
  )
}

export default Selfintro
