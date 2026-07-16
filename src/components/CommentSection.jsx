import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get(`/posts/${postId}/comments`).then(({ data }) => {
      setComments(data);
      setLoading(false);
    });
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { text });
      setComments((prev) => [...prev, data]);
      setText("");
      onCommentAdded?.();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ borderTop: "1px solid var(--border-soft)", padding: "12px 16px" }}>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt=""
          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "4px 6px 4px 14px",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5 }}
          />
          <button
            type="submit"
            disabled={!text.trim() || posting}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: text.trim() ? "var(--primary)" : "var(--border)",
              color: "#fff",
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="skeleton" style={{ height: 40 }} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {comments.map((c) => (
            <div key={c._id} style={{ display: "flex", gap: 8 }}>
              <Link to={`/profile/${c.author.username}`}>
                <img
                  src={c.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.author.name}`}
                  alt=""
                  style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                />
              </Link>
              <div
                style={{
                  background: "var(--bg)",
                  borderRadius: 14,
                  padding: "8px 12px",
                  flex: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <Link
                    to={`/profile/${c.author.username}`}
                    style={{ fontWeight: 600, fontSize: 13 }}
                  >
                    {c.author.name}
                  </Link>
                  <span style={{ fontSize: 11, color: "var(--muted-soft)" }}>
                    {formatDistanceToNowStrict(new Date(c.createdAt))} ago
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 2 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
