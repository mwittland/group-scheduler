import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = async () => {
    window.location.href = "http://localhost:3000/auth/logout";
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/invites">Invites</Link>
        </li>
        <li>
          <Link to="/calendars">Calendars</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
        {/* add more links to navbar */}
      </ul>
    </nav>
  );
};

export default Navbar;
