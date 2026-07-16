import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Camera, MapPin, Briefcase, GraduationCap, Sparkles, UserPlus, Check, Clock, MessageSquare, TrendingUp } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [editOpen, setEditOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const isOwnProfile = currentUser?.username === username;

  const load = async () => {
    const { data } = await api.get(`/users/${username}`);
    setProfile(data);

    const postsRes = await api.get(`/posts/user/${data._id}`);
    setPosts(postsRes.data);

    if (!isOwnProfile) {
      if (data.connections.some((c) => c._id === currentUser._id)) setConnectionStatus("connected");
      else if (currentUser.connectionRequestsSent.includes(data._id)) setConnectionStatus("sent");
      else if (currentUser.connectionRequestsReceived.includes(data._id)) setConnectionStatus("received");
      else setConnectionStatus("none");
    }

    if (isOwnProfile) {
      const { data: a } = await api.get("/users/me/analytics");
      setAnalytics(a);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleConnect = async () => {
    await api.post(`/connections/request/${profile._id}`);
    setConnectionStatus("sent");
  };

  const handleAccept = async () => {
    await api.post(`/connections/accept/${profile._id}`);
    setConnectionStatus("connected");
    await refreshUser();
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await api.post("/users/me/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await refreshUser();
      await load();
    } catch {
      Swal.fire({ icon: "error", title: "Upload failed" });
    }
  };

  const uploadCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("cover", file);
    try {
      await api.post("/users/me/cover", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await load();
    } catch {
      Swal.fire({ icon: "error", title: "Upload failed" });
    }
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ padding: 20 }}>
          <div className="skeleton" style={{ height: 220 }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, padding: "20px 20px" }}>
        <div>
          <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
            <div
              style={{
                height: 140,
                position: "relative",
                background: profile.coverImage
                  ? `url(${profile.coverImage}) center/cover`
                  : "linear-gradient(120deg, var(--primary), var(--react-insightful))",
              }}
            >
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => coverRef.current.click()}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      width: 34,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera size={16} color="var(--primary)" />
                  </button>
                  <input ref={coverRef} type="file" accept="image/*" hidden onChange={uploadCover} />
                </>
              )}
            </div>

            <div style={{ padding: "0 24px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -44 }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
                    alt=""
                    style={{ width: 104, height: 104, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff" }}
                  />
                  {isOwnProfile && (
                    <>
                      <button
                        onClick={() => avatarRef.current.click()}
                        style={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          background: "var(--primary)",
                          borderRadius: "50%",
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Camera size={14} color="#fff" />
                      </button>
                      <input ref={avatarRef} type="file" accept="image/*" hidden onChange={uploadAvatar} />
                    </>
                  )}
                </div>

                <div style={{ marginBottom: 8 }}>
                  {isOwnProfile ? (
                    <button onClick={() => setEditOpen(true)} className="btn btn-outline">
                      Edit profile
                    </button>
                  ) : connectionStatus === "connected" ? (
                    <button className="btn" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                      <Check size={15} /> Connected
                    </button>
                  ) : connectionStatus === "sent" ? (
                    <button className="btn btn-ghost" disabled>
                      <Clock size={15} /> Pending
                    </button>
                  ) : connectionStatus === "received" ? (
                    <button onClick={handleAccept} className="btn btn-primary">
                      <Check size={15} /> Accept request
                    </button>
                  ) : (
                    <button onClick={handleConnect} className="btn btn-primary">
                      <UserPlus size={15} /> Connect
                    </button>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>{profile.name}</h2>
                {profile.openToWork && (
                  <span
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent-hover)",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    #OpenToWork
                  </span>
                )}
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: 14.5, marginTop: 4 }}>{profile.headline}</p>
              {profile.location && (
                <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>
                  <MapPin size={13} /> {profile.location}
                </p>
              )}
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                {profile.connections?.length || 0} connections
              </p>

              {profile.about && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 8 }}>About</h4>
                  <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {profile.about}
                  </p>
                </div>
              )}
            </div>
          </div>

          {profile.experience?.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={17} color="var(--primary)" /> Experience
              </h4>
              {profile.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: i !== profile.experience.length - 1 ? 16 : 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{exp.title}</p>
                  <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{exp.company}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate} {exp.location && `· ${exp.location}`}
                  </p>
                  {exp.description && <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {profile.education?.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap size={17} color="var(--primary)" /> Education
              </h4>
              {profile.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: i !== profile.education.length - 1 ? 16 : 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{edu.school}</p>
                  <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                    {edu.degree} {edu.field && `· ${edu.field}`}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    {edu.startYear} — {edu.endYear}
                  </p>
                </div>
              ))}
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={17} color="var(--primary)" /> Skills
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--primary-soft)",
                      color: "var(--primary)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: 999,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, margin: "8px 0 12px" }}>Posts</h4>
            {posts.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>No posts yet.</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                />
              ))
            )}
          </div>
        </div>

        {isOwnProfile && analytics && (
          <div>
            <div className="card" style={{ padding: 18 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={16} color="var(--accent)" /> Profile analytics
              </h4>
              <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                {analytics.totalViews}
              </p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Total profile views</p>

              {analytics.recentViewers?.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <MessageSquare size={13} /> Recent viewers
                  </p>
                  {analytics.recentViewers.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <img
                        src={v.viewer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${v.viewer?.name}`}
                        alt=""
                        style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: 12.5 }}>{v.viewer?.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSaved={async () => {
            setEditOpen(false);
            await refreshUser();
            await load();
          }}
        />
      )}
    </div>
  );
};

export default Profile;
