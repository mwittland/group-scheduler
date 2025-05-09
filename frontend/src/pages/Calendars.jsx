import { useState, useEffect } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";

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

  if (!user) {
    return <p>Loading Your Calendars</p>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card bg-dark text-white">
            <div className="card-header text-center">
              <h2>Owned Calendars</h2>
            </div>
            <div>
              {ownedCalendars.length === 0 && (
                <p className="text-center">You do not own any calendars</p>
              )}
              {ownedCalendars.map((cal) => (
                <div className="d-flex justify-content-center">
                  <div className="card bg-secondary text-white w-75">
                    <div className="card-header text-center">
                      <h3>{cal.title}</h3>
                    </div>
                    <Link
                      to={`/calendar/${cal.id}`}
                      className="btn btn-success"
                    >
                      Open
                    </Link>
                    <button
                      className="btn btn-outline-danger bg-danger text-white"
                      onClick={() => handleDeleteCalendar(cal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card bg-dark text-white">
            <div className="card-header text-center">
              <h2>Joined Calendars</h2>
            </div>
            <div>
              {joinedCalendars.length === 0 && (
                <p className="text-center">You are not a participant in any calendars</p>
              )}
              {joinedCalendars.map((cal) => (
                <div className="d-flex justify-content-center">
                  <div className="card bg-secondary text-white w-75">
                    <div className="card-header text-center">
                      <h3>{cal.title}</h3>
                    </div>
                    <Link
                      to={`/calendar/${cal.id}`}
                      className="btn btn-success"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card bg-dark text-white">
            <div className="card-header text-center">
              <h2>Create New Calendar</h2>
            </div>
            <form onSubmit={handleCreateCalendar}>
              <div className="form-group">
                <label for="calTitle">Calendar Title</label>
                <input
                  type="text"
                  value={title}
                  className="form-control"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter calendar title"
                  id="calTitle"
                  required
                />
              </div>
              <div className="form-group">
                <label for="start">Start Date</label>
                <input
                  type="date"
                  value={start}
                  id="start"
                  className="form-control"
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label for="end">End Date</label>
                <input
                  type="date"
                  id="end"
                  className="form-control"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-success" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Calendars;
