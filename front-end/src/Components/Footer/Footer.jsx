import React from 'react'

const Footer = () => {
  return (
    <div className='footer'>
       <div>
            <p>&copy; Habit Tracker</p>
            <div className="contact" >
                <div><a href="https://www.facebook.com/nerkar297">
                    <i className="fa-brands fa-facebook"></i>
                </a></div>
                <div><a href="https://www.youtube.com">
                    <i className="fa-brands fa-twitter"></i>
                </a></div>
                <div><a href="https://www.instagram.com/nerkar.297">
                    <i className="fa-brands fa-instagram"></i>
                </a></div>
                <div><a href="https://www.linkedin.com/in/nerkar297">
                    <i className="fa-brands fa-linkedin"></i>
                </a></div>
            </div>
        </div>
    </div>
  )
}

export default Footer
