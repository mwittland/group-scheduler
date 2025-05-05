import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
function App() {
  const isAuthenticated = true; // add auth check later
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* add more routes*/}
      </Routes>
    </Router>
  );
}

export default App;
