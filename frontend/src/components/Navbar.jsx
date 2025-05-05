// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/login">Login</Link></li>
      {/* add more links to navbar */}
    </ul>
  </nav>
);

export default Navbar;
