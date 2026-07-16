import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { UserPlus, Heart, MessageCircle, Repeat2, Eye, Check } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const ICONS = {
  connection_request: UserPlus,
  connection_accepted: Check,
  reaction: Heart,
  comment: MessageCircle,
  share: Repeat2,
  profile_view: Eye,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications);
    setLoading(false);
    await api.put("/notifications/read-all");
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: 620, padding: "20px 20px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Notifications</h2>

        <div className="card" style={{ padding: 8 }}>
          {loading ? (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 50 }} />)}
            </div>
          ) : notifications.length === 0 ? (
            <p style={{ padding: 30, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
              You're all caught up.
            </p>
          ) : (
            notifications.map((n) => {
              const Icon = ICONS[n.type] || Heart;
              return (
                <Link
                  key={n._id}
                  to={n.sender?.username ? `/profile/${n.sender.username}` : "#"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 10px",
                    borderBottom: "1px solid var(--border-soft)",
                    background: n.read ? "transparent" : "var(--primary-soft)",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={n.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${n.sender?.name}`}
                      alt=""
                      style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        background: "var(--primary)",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                      }}
                    >
                      <Icon size={11} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5 }}>{n.message}</p>
                    <p style={{ fontSize: 11.5, color: "var(--muted-soft)" }}>
                      {formatDistanceToNowStrict(new Date(n.createdAt))} ago
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
