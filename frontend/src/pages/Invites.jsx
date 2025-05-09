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
  if (!user) {
    return <p>Loading Your Invites</p>;
  }
  return (
    <div>
      <h1 className="text-center">Pending Invites</h1>
      <div className="row">
        <div>
          {receivedInvites.length === 0 && (
            <p className="text-center">You have no pending invites</p>
          )}
          {receivedInvites.map((inv) => (
            <div className="col d-flex justify-content-center">
              <div className="card bg-dark text-white w-75">
                <div className="card-header text-center">
                  <h3>Invite To {inv.calendar.title}</h3>
                </div>
                <button className="btn btn-success" onClick={() => handleAcceptInvite(inv.id)}>
                  Accept
                </button>
                <button className="btn btn-danger" onClick={() => handleDeclineInvite(inv.id)}>
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Invites;
