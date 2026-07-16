import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileSidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
      <div
        style={{
          height: 64,
          background: user.coverImage
            ? `url(${user.coverImage}) center/cover`
            : "linear-gradient(120deg, var(--primary), var(--react-insightful))",
        }}
      />
      <div style={{ padding: "0 16px 16px", marginTop: -28 }}>
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt=""
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #fff",
          }}
        />
        <Link to={`/profile/${user.username}`}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginTop: 8 }}>{user.name}</h3>
        </Link>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{user.headline}</p>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Connections</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary)" }}>
            {user.connections?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
