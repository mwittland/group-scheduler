import { useState, useEffect } from "react";
import api from "../utils/axios";
import { Link } from 'react-router-dom';

const Calendars = ({ user }) => {
  const [ownedCalendars, setOwnedCalendars] = useState([]);
  const [joinedCalendars, setJoinedCalendars] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const fetchOwnedCalendars = async () => {
    if (!user) return; // wait until user is loaded
    try {
      const res = await api.get(`/api/calendars/owned/${user.id}`);
      setOwnedCalendars(res.data);
    } catch (err) {
      console.error("Failed to fetch owned calendars:", err);
    }
  };
  useEffect(() => {
    fetchOwnedCalendars();
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    const fetchJoinedCalendars = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/api/calendars/participant/${user.id}`);
        setJoinedCalendars(res.data);
      } catch (err) {
        console.error("Failed to fetch owned calendars:", err);
      }
    };
    fetchJoinedCalendars();
  }, [user]);
  const handleCreateCalendar = async (e) => {
    e.preventDefault();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      alert("Start date must be before end date.");
      return;
    }
    try {
      const newCalendar = {
        title,
        startDate,
        endDate,
        ownerId: user.id,
      };
      await api.post("/api/calendars", newCalendar);
      setTitle("");
      setStart("");
      setEnd("");
      fetchOwnedCalendars();
    } catch (err) {
      console.error("Failed to create calendar:", err);
    }
  };
  const handleDeleteCalendar = async (calendarId) => {
    try {
      await api.delete(`/api/calendars/${calendarId}`);
      fetchOwnedCalendars();
    } catch (err) {
      console.error("Failed to delete calendar");
    }
  };
  return (
    <div>
      <h1>Calendars</h1>
      <h2>Owned Calendars</h2>
      <ul>
        {ownedCalendars.map((cal) => (
          <div>
            <Link to={`/calendar/${cal.id}`}>
              <button>Open Calendar {cal.title}</button>
            </Link>
            <button onClick={() => handleDeleteCalendar(cal.id)}>Delete</button>
          </div>
        ))}
      </ul>
      <h2>Joined Calendars</h2>
      <ul>
        {joinedCalendars.map((cal) => (
          <div>
            <Link to={`/calendar/${cal.id}`}>
              <button>Open Calendar {cal.title}</button>
            </Link>
            <button>Leave(to be implemented)</button>
          </div>
        ))}
      </ul>
      <h2>Create New Calendar</h2>
      <form onSubmit={handleCreateCalendar}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Calendar Title"
          required
        />
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default Calendars;
