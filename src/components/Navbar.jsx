import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Bell, Search, LogOut, User as UserIcon, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const poll = async () => {
      try {
        const { data } = await api.get("/notifications");
        setUnread(data.unreadCount);
      } catch {
        /* silent */
      }
    };
    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 20, height: 64 }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Compass size={24} strokeWidth={2.2} />
          Kaarwan
        </Link>

        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: 380,
            display: "flex",
            alignItems: "center",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "8px 14px",
            gap: 8,
          }}
        >
          <Search size={16} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, skills..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              width: "100%",
              color: "var(--ink)",
            }}
          />
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <Link
            to="/"
            className="btn-ghost"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              color: isActive("/") ? "var(--primary)" : "var(--muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 600,
              gap: 2,
            }}
          >
            <Home size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
            Feed
          </Link>

          <Link
            to="/connections"
            className="btn-ghost"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              color: isActive("/connections") ? "var(--primary)" : "var(--muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 600,
              gap: 2,
            }}
          >
            <Users size={20} strokeWidth={isActive("/connections") ? 2.5 : 2} />
            Network
          </Link>

          <Link
            to="/notifications"
            className="btn-ghost"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              position: "relative",
              color: isActive("/notifications") ? "var(--primary)" : "var(--muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 600,
              gap: 2,
            }}
          >
            <Bell size={20} strokeWidth={isActive("/notifications") ? 2.5 : 2} />
            Alerts
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: 6,
                  background: "var(--danger)",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 10,
                  minWidth: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>

          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--border)",
                }}
              />
            </button>
            {menuOpen && (
              <div
                className="card fade-in"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 46,
                  width: 200,
                  padding: 8,
                }}
              >
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <UserIcon size={16} /> View profile
                </Link>
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    navigate("/login");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--danger)",
                    width: "100%",
                  }}
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
