import { Link } from "react-router-dom";
import { UserPlus, Check } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

const SuggestionCard = ({ person, onHandled }) => {
  const [status, setStatus] = useState("idle");

  const sendRequest = async () => {
    setStatus("sending");
    try {
      await api.post(`/connections/request/${person._id}`);
      setStatus("sent");
      onHandled?.(person._id);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
      <Link to={`/profile/${person.username}`}>
        <img
          src={person.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
          alt=""
          style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
        />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/profile/${person.username}`} style={{ fontWeight: 600, fontSize: 13.5, display: "block" }}>
          {person.name}
        </Link>
        <p style={{ fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {person.headline}
        </p>
        {person.mutualCount > 0 && (
          <p style={{ fontSize: 10.5, color: "var(--accent)", marginTop: 1 }}>
            {person.mutualCount} mutual connection{person.mutualCount > 1 ? "s" : ""}
          </p>
        )}
      </div>
      <button
        onClick={sendRequest}
        disabled={status !== "idle"}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid var(--primary)",
          color: status === "sent" ? "var(--success)" : "var(--primary)",
          flexShrink: 0,
        }}
      >
        {status === "sent" ? <Check size={15} /> : <UserPlus size={15} />}
      </button>
    </div>
  );
};

export default SuggestionCard;
