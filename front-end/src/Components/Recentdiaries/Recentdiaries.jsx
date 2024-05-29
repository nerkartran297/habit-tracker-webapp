import React from 'react'
import './Recentdiaries.css'
import IMG_1877 from '../../Assets/IMG_1877.JPG'

const Recentdiaries = () => {
  return (
    <div className='pinnedDoc'>
      <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 23/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 22/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 21/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 20/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 19/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 20/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
        <div className="document">
            <img src={IMG_1877} className="docImage"/>
            <h4 className="docTitle">Diary: 19/04/2024</h4>
            <p className="docShort">This is a good day...</p>
        </div>
    </div>
  )
}

export default Recentdiaries
