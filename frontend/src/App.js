import {
  BrowserRouter as Router,
  Routes,
  Route
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
        <Route path="/calendars" element={<Calendars user={user}/>} />
        <Route path="/invites" element={<Invites user={user}/>} />
        <Route path="/calendar/:id" element={<CalendarPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
