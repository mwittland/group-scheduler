import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
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
  const [userAvailability, setUserAvailability] = useState([]);
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
    const availabilityList = res.data;

    const groupedByDate = {};
    const userDates = [];
    const currentUser = user;

    availabilityList.forEach(({ date, user }) => {
      const dayOnly = new Date(date).toISOString().split("T")[0];

      if (!groupedByDate[dayOnly]) {
        groupedByDate[dayOnly] = { date: dayOnly, users: [] };
      }
      groupedByDate[dayOnly].users.push(user);

      if (currentUser.id === user.id) {
        userDates.push(dayOnly);
      }
    });

    const formatted = Object.values(groupedByDate).map(({ date, users }) => ({
      title: `${users.length} available`,
      date,
      users,
      type: "availability",
    }));

    const userEvents = userDates.map((date) => ({
      start: date,
      display: "background",
      backgroundColor: "lightgreen",
      type: "user",
    }));

    setAvailabilityEvents(formatted);
    setUserAvailability(userEvents);
  };
  const handleInviteSent = async (e) => {
    e.preventDefault();
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
    if (info.event.extendedProps.type !== "availability") return;
    const dateHovered = info.event.start.toISOString().split("T")[0];
    const event = availabilityEvents.find(
      (event) => event.date === dateHovered
    );
    if (event) {
      const rect = info.el.getBoundingClientRect();
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
  const handleDateClick = async (info) => {
    const clickedDate = info.dateStr;
    try {
      await api.post("/api/availability/toggle", {
        calendarId: calendar.id,
        userId: user.id,
        date: clickedDate,
      });

      fetchAvailability();
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
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
      <div className="col d-flex justify-content-center">
        <div className="card bg-dark text-white w-75">
          <div className="card-header">
            <h2 className="text-center">Details</h2>
          </div>
          <p>Name: {calendar.title}</p>
          <p>Owner: {calendar.owner.email}</p>
          <p>Participant Count: {calendar.participants.length + 1}</p>
          <p>
            Start Date:{" "}
            {new Date(calendar.startDate).toISOString().split("T")[0]}
          </p>
          <p>
            End Date: {new Date(calendar.endDate).toISOString().split("T")[0]}
          </p>
        </div>
      </div>
      {user.id === calendar.ownerId && (
        <div className="d-flex justify-content-center">
          <div className="card bg-dark text-white w-75">
            <div className="card-header">
              <h2 className="text-center">Invite Users</h2>
            </div>
            <form onSubmit={handleInviteSent}>
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  value={emailToInvite}
                  onChange={(e) => setEmailToInvite(e.target.value)}
                  placeholder="User Email"
                  required
                />
                <button className="btn btn-success" type="submit">
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-dark text-white p-3">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
          initialDate={calendar.startDate}
          initialView="dayGridMonth"
          themeSystem="bootstrap5"
          validRange={{
            start: calendar.startDate,
            end: calendar.endDate,
          }}
          events={[...availabilityEvents, ...userAvailability]}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          dateClick={handleDateClick}
        />
      </div>
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
          <h4 className="text-black">Available on {hoverBox.date}</h4>
          <ul className="list-unstyled mb-0 text-black">
            {hoverBox.users.length > 0 ? (
              hoverBox.users.map((user, index) => (
                <li key={index}>{user.email}</li>
              ))
            ) : (
              <li className="text-muted">No users available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
