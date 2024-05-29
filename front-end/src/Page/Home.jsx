import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Dashboard from '../Components/Dashboard/Dashboard'
import Recentdiaries from '../Components/Recentdiaries/Recentdiaries'
import Footer from '../Components/Footer/Footer'
import './CSS/Home.css'

const Home = () => {
  return (
    <div>
        <Navbar />
        <Dashboard />
        <Recentdiaries />
        <Footer />
    </div>
  )
}

export default Home
