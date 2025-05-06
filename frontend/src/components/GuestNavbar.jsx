import { Link } from 'react-router-dom';

const GuestNavbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/login">Login</Link></li>
      {/* add more links to navbar */}
    </ul>
  </nav>
);

export default GuestNavbar;
