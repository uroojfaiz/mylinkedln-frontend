import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X, UserPlus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SuggestionCard from "../components/SuggestionCard";

const Connections = () => {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);

  const load = async () => {
    const [reqRes, sugRes, meRes] = await Promise.all([
      api.get("/connections/requests"),
      api.get("/connections/suggestions"),
      api.get(`/users/${user.username}`),
    ]);
    setRequests(reqRes.data);
    setSuggestions(sugRes.data);
    setConnections(meRes.data.connections);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = async (id) => {
    await api.post(`/connections/accept/${id}`);
    await refreshUser();
    load();
  };

  const reject = async (id) => {
    await api.post(`/connections/reject/${id}`);
    load();
  };

  const tabs = [
    { key: "requests", label: `Requests (${requests.length})` },
    { key: "connections", label: `Connections (${connections.length})` },
    { key: "discover", label: "Discover" },
  ];

  return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 700, padding: "20px 20px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Your Network</h2>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border-soft)" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 16px",
                fontSize: 13.5,
                fontWeight: 600,
                color: tab === t.key ? "var(--primary)" : "var(--muted)",
                borderBottom: tab === t.key ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "requests" && (
          <div className="card" style={{ padding: 8 }}>
            {requests.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
                No pending connection requests.
              </p>
            ) : (
              requests.map((r) => (
                <div key={r._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: "1px solid var(--border-soft)" }}>
                  <Link to={`/profile/${r.username}`}>
                    <img src={r.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${r.name}`} alt="" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/profile/${r.username}`} style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</Link>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{r.headline}</p>
                  </div>
                  <button onClick={() => accept(r._id)} className="btn btn-primary" style={{ padding: "7px 14px" }}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => reject(r._id)} className="btn btn-ghost" style={{ padding: "7px 14px", border: "1px solid var(--border)" }}>
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "connections" && (
          <div className="card" style={{ padding: 8 }}>
            {connections.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
                You haven't connected with anyone yet.
              </p>
            ) : (
              connections.map((c) => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: "1px solid var(--border-soft)" }}>
                  <Link to={`/profile/${c.username}`}>
                    <img src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} alt="" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/profile/${c.username}`} style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</Link>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{c.headline}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "discover" && (
          <div className="card" style={{ padding: 8 }}>
            {suggestions.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
                No new people to suggest right now.
              </p>
            ) : (
              suggestions.map((s) => (
                <div key={s._id} style={{ padding: "0 8px" }}>
                  <SuggestionCard person={s} onHandled={(id) => setSuggestions((prev) => prev.filter((p) => p._id !== id))} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
