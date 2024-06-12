import React, { useContext } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Dashboard from '../Components/Dashboard/Dashboard';
import Recentdiaries from '../Components/Recentdiaries/Recentdiaries';
import Footer from '../Components/Footer/Footer';
import './CSS/Home.css';
import { NoteContext } from '../Context/NoteContext';

const Home = () => {
  const { notes } = useContext(NoteContext);

  return (
    <div>
      <Navbar />
      <Dashboard />
      <Recentdiaries notes={notes} />
      <Footer />
    </div>
  );
};

export default Home;
