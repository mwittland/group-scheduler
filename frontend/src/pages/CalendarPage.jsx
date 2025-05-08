import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axios";

const CalendarPage = ({ user }) => {
  const { id } = useParams();
  const [calendar, setCalendar] = useState(null);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [availabilityEvents, setAvailabilityEvents] = useState([]);
  const [hoverBox, setHoverBox] = useState({
    visible: false,
    x: 0,
    y: 0,
    users: [],
    date: "",
  });
  const getCalendarDetails = async () => {
    try {
      const res = await api.get(`/api/calendars/${id}`);
      setCalendar(res.data);
    } catch (err) {
      console.error("Failed to fetch calendar information:", err);
    }
  };
  const fetchAvailability = async () => {
    const res = await api.get(`/api/availability/${calendar.id}`);
    const availabilityList = res.data; // array of { date, userId }
    const groupedByDate = availabilityList.reduce((acc, { date, user }) => {
      const dayOnly = new Date(date).toISOString().split("T")[0]; // Normalize to YYYY-MM-DD
      if (!acc[dayOnly]) {
        acc[dayOnly] = { date: dayOnly, users: [] };
      }
      acc[dayOnly].users.push(user);
      return acc;
    }, {});

    // Convert the grouped object to an array of events
    const formatted = Object.values(groupedByDate).map(({ date, users }) => ({
      title: `${users.length} available`,
      date,
      users, // Store the list of users directly here
    }));
    setAvailabilityEvents(formatted);
  };
  const handleInviteSent = async (e) => {
    e.preventDefault();
    //get user from email
    try {
      const newUser = await api.get("/api/users", {
        params: { userEmail: emailToInvite },
      });
      if (
        newUser.data.id === calendar.ownerId ||
        calendar.participants.some((p) => p.id === newUser.id)
      ) {
        alert("User is already part of the calendar.");
        return;
      }
      try {
        const data = {
          cId: calendar.id,
          rId: newUser.data.id,
        };
        await api.post("/api/invites/send", data);
        alert("Invite sent");
        setEmailToInvite("");
      } catch (err) {
        alert("Already invited user");
        return;
      }
    } catch (err) {
      alert("User does not exist");
      return;
    }
  };
  const handleEventMouseEnter = (info) => {
    const dateHovered = info.event.start.toISOString().split("T")[0];
    const event = availabilityEvents.find(
      (event) => event.date === dateHovered
    );
    if (event) {
      const rect = info.el.getBoundingClientRect(); // position of the calendar event element
      setHoverBox({
        visible: true,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        users: event.users,
        date: dateHovered,
      });
    }
  };

  const handleEventMouseLeave = () => {
    setHoverBox({ visible: false, x: 0, y: 0, users: [], date: "" });
  };
  useEffect(() => {
    getCalendarDetails();
    if (calendar) {
      fetchAvailability();
    }
    // eslint-disable-next-line
  }, [user, calendar]);

  if (!calendar || !user) {
    return <p>Loading calendar</p>;
  }

  return (
    <div>
      <h1>{calendar.title}</h1>
      <h2>Details</h2>
      <p>Owner: {calendar.owner.email}</p>
      <p>Participant Count: {calendar.participants.length + 1}</p>
      <p>
        Start Date: {new Date(calendar.startDate).toISOString().split("T")[0]}
      </p>
      <p>End Date: {new Date(calendar.endDate).toISOString().split("T")[0]}</p>
      {user.id === calendar.ownerId && (
        <div>
          <h2>Invite Users</h2>
          <form onSubmit={handleInviteSent}>
            <input
              type="text"
              value={emailToInvite}
              onChange={(e) => setEmailToInvite(e.target.value)}
              placeholder="User Email"
              required
            />
            <button type="submit">Invite</button>
          </form>
        </div>
      )}
      <h2>Availability</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: calendar.startDate,
          end: calendar.endDate,
        }}
        events={availabilityEvents}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
      />
      {hoverBox.visible && (
        <div
          style={{
            position: "absolute",
            top: hoverBox.y + 20,
            left: hoverBox.x + 20,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <h4>Available on {hoverBox.date}</h4>
          <ul>
            {hoverBox.users.length > 0 ? (
              hoverBox.users.map((user, index) => (
                <li key={index}>{user.email}</li>
              ))
            ) : (
              <p>No users available</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
