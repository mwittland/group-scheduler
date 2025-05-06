import { useState, useEffect } from "react";
import api from "../utils/axios";
const Invites = ({ user }) => {
  const [receivedInvites, setReceivedInvites] = useState([]);
  useEffect(() => {
    const fetchReceivedInvites = async () => {
      if (!user) return; // wait until user is loaded
      try {
        const res = await api.get(`/api/invites/view/${user.id}`);
        setReceivedInvites(res.data);
      } catch (err) {
        console.error("Failed to fetch owned calendars:", err);
      }
    };
    fetchReceivedInvites();
  }, [user]);
  return (
    <div>
      <h1>Invites</h1>
      <h2>Sent Invites (to be implemented in future)</h2>
      <h2>Received Invites</h2>
      <ul>
        {receivedInvites.map((inv) => (
          <div>
            <p>Invite To {inv.calendar.title}</p>
            <p>Status: {inv.status}</p>
            <button>Accept</button>
            <button>Reject</button>
          </div>
        ))}
      </ul>
    </div>
  );
};
export default Invites;
