import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Page/Home';
import Habit from './Page/Habit'
import Notepage from './Page/Notepage'
import Noteviewpage from './Page/Noteviewpage'
import Noteeditorpage from './Page/Noteeditorpage'
import './styles.css'
import Loginsignuppage from './Page/Loginsignuppage';
import Homeguest from './Page/Homeguest';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      {localStorage.getItem('auth-token') ? <Route path="/" element={<Home />} />:<Route path="/" element={<Homeguest />}  />}
        
        <Route path="/login" element={<Loginsignuppage />} />
        <Route path="/habit" element={<Habit />} />
        <Route path="/habit/:id" element={<Habit />} />
        <Route path="/note" element={<Notepage />} />
        <Route path="noteview">
          <Route path=":noteviewid" element={<Noteviewpage />} />
        </Route>
        <Route path="/noteeditor/:id" element={<Noteeditorpage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
