import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import SuggestionCard from "../components/SuggestionCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const loadFeed = useCallback(async (pageNum) => {
    const { data } = await api.get(`/posts/feed?page=${pageNum}&limit=8`);
    setPosts((prev) => (pageNum === 1 ? data.posts : [...prev, ...data.posts]));
    setHasMore(data.hasMore);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFeed(1);
    api.get("/connections/suggestions").then(({ data }) => setSuggestions(data.slice(0, 4)));
  }, [loadFeed]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadFeed(next);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="container" style={{ display: "grid", gridTemplateColumns: "260px 1fr 280px", gap: 20, padding: "20px 20px" }}>
        <div>
          <ProfileSidebar />
        </div>

        <div>
          <CreatePost onPostCreated={(post) => setPosts((prev) => [post, ...prev])} />

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 180 }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 6, color: "var(--ink)" }}>
                Your feed is quiet
              </p>
              <p style={{ fontSize: 13.5 }}>Connect with people or share your first post to get started.</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={() => loadFeed(1)}
                  onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                />
              ))}
              {hasMore && (
                <button onClick={loadMore} className="btn btn-outline" style={{ width: "100%", marginTop: 4 }}>
                  Show more
                </button>
              )}
            </>
          )}
        </div>

        <div>
          <div className="card" style={{ padding: 16 }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 4 }}>
              People you may know
            </h4>
            {suggestions.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>No suggestions right now.</p>
            ) : (
              <div style={{ marginTop: 4 }}>
                {suggestions.map((s) => (
                  <SuggestionCard
                    key={s._id}
                    person={s}
                    onHandled={(id) => setSuggestions((prev) => prev.filter((p) => p._id !== id))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
