import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './utils/auth';
import Landing from './pages/Landing';
import GuestNavbar from './components/GuestNavbar';
import Navbar from './components/Navbar';
import About from './pages/About';
import Login from './pages/Login';
import Calendars from './pages/Calendars';
import Invites from './pages/Invites';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const user = await fetchCurrentUser();
      setUser(user);
    };
    checkAuth();
  }, []);
  return (
    <Router>
      {user ? <Navbar /> : <GuestNavbar />}
      <Routes>
        <Route path="/" element={<Landing user={user}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendars" element={<Calendars user={user}/>} />
        <Route path="/invites" element={<Invites user={user}/>} />
      </Routes>
    </Router>
  );
}

export default App;
