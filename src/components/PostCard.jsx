import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Repeat2, MoreHorizontal, Trash2 } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import Swal from "sweetalert2";
import ReactionPicker, { REACTIONS } from "./ReactionPicker";
import CommentSection from "./CommentSection";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ReactionSummary = ({ reactions }) => {
  if (!reactions?.length) return null;
  const counts = {};
  reactions.forEach((r) => (counts[r.type] = (counts[r.type] || 0) + 1));
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex" }}>
        {top.map(([type], i) => {
          const r = REACTIONS.find((x) => x.type === type);
          const Icon = r.icon;
          return (
            <div
              key={type}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: i === 0 ? 0 : -6,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Icon size={11} color={r.color} fill={r.color} />
            </div>
          );
        })}
      </div>
      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{reactions.length}</span>
    </div>
  );
};

const PostBody = ({ post }) => (
  <>
    {post.text && (
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
        {post.text}
      </p>
    )}
    {post.image && (
      <img
        src={post.image}
        alt=""
        style={{
          width: "100%",
          maxHeight: 460,
          objectFit: "cover",
          borderRadius: 12,
          marginTop: post.text ? 10 : 0,
        }}
      />
    )}
  </>
);

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [reactions, setReactions] = useState(post.reactions || []);
  const [menuOpen, setMenuOpen] = useState(false);

  const myReaction = reactions.find((r) => r.user === user._id || r.user?._id === user._id)?.type;

  const handleReact = async (type) => {
    const prev = reactions;
    // optimistic update
    const withoutMine = reactions.filter((r) => (r.user?._id || r.user) !== user._id);
    if (myReaction === type) {
      setReactions(withoutMine);
    } else {
      setReactions([...withoutMine, { user: user._id, type }]);
    }
    try {
      const { data } = await api.post(`/posts/${post._id}/react`, { type });
      setReactions(data);
    } catch {
      setReactions(prev);
    }
  };

  const handleShare = async () => {
    try {
      await api.post(`/posts/${post._id}/share`, {});
      Swal.fire({
        icon: "success",
        title: "Shared to your profile",
        timer: 1400,
        showConfirmButton: false,
      });
      onUpdate?.();
    } catch {
      Swal.fire({ icon: "error", title: "Could not share post" });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete this post?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B3492F",
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      await api.delete(`/posts/${post._id}`);
      onDelete?.(post._id);
    }
  };

  const displayPost = post.sharedFrom || post;
  const author = post.author;

  return (
    <div className="card fade-in" style={{ marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to={`/profile/${author.username}`}>
              <img
                src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`}
                alt=""
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
              />
            </Link>
            <div>
              <Link to={`/profile/${author.username}`} style={{ fontWeight: 700, fontSize: 14.5 }}>
                {author.name}
              </Link>
              <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{author.headline}</p>
              <p style={{ fontSize: 11.5, color: "var(--muted-soft)" }}>
                {formatDistanceToNowStrict(new Date(post.createdAt))} ago
                {post.sharedFrom && " · reposted"}
              </p>
            </div>
          </div>
          {author._id === user._id && (
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen((v) => !v)} style={{ padding: 6 }}>
                <MoreHorizontal size={18} color="var(--muted)" />
              </button>
              {menuOpen && (
                <div
                  className="card"
                  style={{ position: "absolute", right: 0, top: 32, width: 150, padding: 6, zIndex: 10 }}
                >
                  <button
                    onClick={handleDelete}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--danger)",
                      width: "100%",
                    }}
                  >
                    <Trash2 size={14} /> Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          {post.sharedFrom ? (
            <>
              {post.text && <p style={{ fontSize: 14, marginBottom: 10 }}>{post.text}</p>}
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  background: "var(--bg)",
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <img
                    src={
                      post.sharedFrom.author.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${post.sharedFrom.author.name}`
                    }
                    alt=""
                    style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{post.sharedFrom.author.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>{post.sharedFrom.author.headline}</p>
                  </div>
                </div>
                <PostBody post={post.sharedFrom} />
              </div>
            </>
          ) : (
            <PostBody post={post} />
          )}
        </div>
      </div>

      <div style={{ padding: "6px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ReactionSummary reactions={reactions} />
        <div style={{ display: "flex", gap: 4, fontSize: 12, color: "var(--muted)" }}>
          {commentCount > 0 && <span>{commentCount} comments</span>}
          {post.shareCount > 0 && <span>· {post.shareCount} shares</span>}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          padding: "4px 8px",
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <ReactionPicker myReaction={myReaction} onReact={handleReact} />
        </div>
        <button
          onClick={() => setShowComments((v) => !v)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px 0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: showComments ? "var(--primary)" : "var(--muted)",
          }}
        >
          <MessageCircle size={17} /> Comment
        </button>
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px 0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--muted)",
          }}
        >
          <Repeat2 size={17} /> Share
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post._id} onCommentAdded={() => setCommentCount((c) => c + 1)} />
      )}
    </div>
  );
};

export default PostCard;
