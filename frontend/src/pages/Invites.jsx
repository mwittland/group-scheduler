import { useState, useEffect } from "react";
import api from "../utils/axios";
const Invites = ({ user }) => {
  const [receivedInvites, setReceivedInvites] = useState([]);
  const fetchReceivedInvites = async () => {
    if (!user) return; // wait until user is loaded
    try {
      const res = await api.get(`/api/invites/view/${user.id}`);
      setReceivedInvites(res.data);
    } catch (err) {
      console.error("Failed to fetch owned calendars:", err);
    }
  };
  useEffect(() => {
    fetchReceivedInvites();
    // eslint-disable-next-line
  }, [user]);
  const handleAcceptInvite = async (id) => {
    try {
      await api.delete("/api/invites/accept", {
        data: { inviteId: id },
      });
      fetchReceivedInvites();
    } catch (err) {
      console.error("Error accepting invite: ", err);
    }
  };
  const handleDeclineInvite = async (id) => {
    try {
      await api.delete("/api/invites/decline", {
        data: { inviteId: id },
      });
      fetchReceivedInvites();
    } catch (err) {
      console.error("Error declining invite: ", err);
    }
  };
  return (
    <div>
      <h1>Invites</h1>
      <h2>Pending Outgoing Invites (to be implemented later)</h2>
      <h2>Received Invites</h2>
      <ul>
        {receivedInvites.map((inv) => (
          <div>
            <p>Invite To {inv.calendar.title}</p>
            <button onClick={() => handleAcceptInvite(inv.id)}>Accept</button>
            <button onClick={() => handleDeclineInvite(inv.id)}>Decline</button>
          </div>
        ))}
      </ul>
    </div>
  );
};
export default Invites;
