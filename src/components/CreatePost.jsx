import { useState, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!text.trim() && !image) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(data);
      setText("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Couldn't publish post", text: err.response?.data?.message || "" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt=""
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${user.name.split(" ")[0]}?`}
          rows={2}
          style={{
            flex: 1,
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "12px 14px",
            fontSize: 14,
            resize: "none",
            outline: "none",
            background: "var(--bg)",
          }}
        />
      </div>

      {preview && (
        <div style={{ position: "relative", marginTop: 12 }}>
          <img src={preview} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 12 }} />
          <button
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--border-soft)",
        }}
      >
        <button
          onClick={() => fileRef.current.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--muted)",
            padding: "6px 10px",
            borderRadius: 8,
          }}
        >
          <ImageIcon size={18} color="var(--react-insightful)" /> Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

        <button
          onClick={submit}
          disabled={(!text.trim() && !image) || posting}
          className="btn btn-primary"
          style={{ opacity: (!text.trim() && !image) || posting ? 0.5 : 1 }}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
