import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axios";

const CalendarPage = ({ user }) => {
  const { id } = useParams();
  const [calendar, setCalendar] = useState(null);
  const [emailToInvite, setEmailToInvite] = useState("");
  const getCalendarDetails = async () => {
    try {
      const res = await api.get(`/api/calendars/${id}`);
      setCalendar(res.data);
    } catch (err) {
      console.error("Failed to fetch calendar information:", err);
    }
  };
  const handleInviteSent = async (e) => {
    e.preventDefault();
    //get user from email
    try {
      const newUser = await api.get("/api/users", {
        params: { userEmail: emailToInvite },
      });
      console.log(newUser);
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
            rId: newUser.data.id
        }
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
  useEffect(() => {
    getCalendarDetails();
    // eslint-disable-next-line
  }, [user]);

  // fetch calendar with useEffect using `id`
  // render calendar details
  if (!calendar || !user) {
    return <p>Loading calendar</p>;
  }

  return (
    <div>
      <h1>{calendar.title}</h1>
      <h2>Event Details</h2>
      <p>Owner: incomplete</p>
      <p>Participant Count: </p>
      <p>Start Date: </p>
      <p>End Date: </p>
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
    </div>
  );
};

export default CalendarPage;
