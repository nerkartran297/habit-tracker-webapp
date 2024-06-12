import React from 'react'
import './Guest.css'
import IMG_1886 from '../../Assets/IMG_1886.JPG'
import { Link } from 'react-router-dom'
const Guest = () => {
  return (
    <div className='bodymain'>
    <div className='main'>
       <section className="hero"> 
                <div className="hero-content">
                    <h1>Theo dõi và Xây dựng Thói quen Tích cực</h1>
                    <p>Habit Tracker giúp bạn thiết lập, theo dõi và duy trì các thói quen tốt để đạt được mục tiêu của mình.</p>
                </div>
                <div className="hero-image"> 
                    <img src={IMG_1886} alt="Người đang theo dõi thói quen"/>  
                </div>
            </section>
    
            <section className="features">
                <div className="feature-grid">
                    <div className="feature">
                        <i className="fas fa-calendar-check"></i>
                        <h3>Lịch trình rõ ràng</h3>
                        <p>Lên lịch trình cho các thói quen một cách dễ dàng và trực quan.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-chart-line"></i>
                        <h3>Theo dõi tiến trình</h3>
                        <p>Xem biểu đồ tiến trình của bạn và luôn có động lực để tiếp tục.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-trophy"></i>
                        <h3>Phần thưởng hấp dẫn</h3>
                        <p>Nhận phần thưởng khi đạt được các cột mốc quan trọng trong hành trình xây dựng thói quen.</p>
                    </div>
                </div>
            </section>
            <section className="testimonials">
                <h2>Cảm nhận của người dùng</h2>
                <div className="testimonial-slider">
                    <div className="testimonial">
                        <p>"Habit Tracker đã thay đổi cuộc sống của tôi! Tôi đã giảm cân thành công và xây dựng được thói quen tập thể dục đều đặn."</p>
                        <p className="author">- Nguyễn Văn A</p>
                    </div>
                    <div className="testimonial">
                        <p>"Giao diện trực quan và dễ sử dụng. Tôi đặc biệt thích tính năng nhắc nhở hàng ngày."</p>
                        <p className="author">- Trần Thị B</p>
                    </div>
                </div>
            </section>
        
            <section className="call-to-action">
                <h2>Bạn đã sẵn sàng thay đổi?</h2>
                <p>Hãy tham gia cùng hàng ngàn người dùng khác và bắt đầu hành trình xây dựng thói quen tốt ngay hôm nay!</p>
                <Link className="cta-button" to='/login'>Đăng ký miễn phí</Link> 
            </section>
    </div>
  </div>
  )
}

export default Guest
