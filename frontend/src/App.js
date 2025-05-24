import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './utils/auth';
import Landing from './pages/Landing';
import GuestNavbar from './components/GuestNavbar';
import Navbar from './components/Navbar';
import Calendars from './pages/Calendars';
import Invites from './pages/Invites';
import CalendarPage from './pages/CalendarPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fullcalendar/bootstrap5';

function App() {
  console.log("App component rendered");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Check for ?token= in the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    console.log('Token from URL:', token);

    if (token) {
      console.log('Token saved to localStorage:', token);
      localStorage.setItem('jwtToken', token);
      // Remove token from URL for cleanliness
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Then check auth
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
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/calendars" element={<Calendars user={user} />} />
        <Route path="/invites" element={<Invites user={user} />} />
        <Route path="/calendar/:id" element={<CalendarPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
