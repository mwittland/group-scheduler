import { useState, useEffect } from "react";
import api from "../utils/axios";

const Calendars = ({ user }) => {
  const [ownedCalendars, setOwnedCalendars] = useState([]);
  const [joinedCalendars, setJoinedCalendars] = useState([]);
  useEffect(() => {
    const fetchOwnedCalendars = async () => {
      if (!user) return; // wait until user is loaded
      try {
        const res = await api.get(`/api/calendars/owned/${user.id}`);
        setOwnedCalendars(res.data);
      } catch (err) {
        console.error("Failed to fetch owned calendars:", err);
      }
    };
    fetchOwnedCalendars();
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
  return (
    <div>
      <h1>Calendars</h1>
      <h2>Owned Calendars</h2>
      <ul>
        {ownedCalendars.map((cal) => (
          <div>
            <button>Open Calendar {cal.title}</button>
          </div>
        ))}
      </ul>
      <h2>Joined Calendars</h2>
      <ul>
        {joinedCalendars.map((cal) => (
          <div>
            <button>Open Calendar {cal.title}</button>
          </div>
        ))}
      </ul>
      <h2>Create New Calendar</h2>
      <p>add form here to make a calendar</p>
    </div>
  );
};
export default Calendars;
