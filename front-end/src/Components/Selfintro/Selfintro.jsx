import React from 'react'
import './Selfintro.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';

const Selfintro = () => {
  const {User} = useContext(UserContext);
  return (
    <div className="selfIntro">
            <img src={IMG_1877}/>
            <div>
                <h3>About me</h3>
                <p>
                    {User.description}
                </p>
            </div>
    </div>
  )
}

export default Selfintro
