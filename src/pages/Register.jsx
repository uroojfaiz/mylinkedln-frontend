import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, User, AtSign } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Registration failed", text: err.response?.data?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const field = (icon, type, placeholder, key) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
      {icon}
      <input
        type={type}
        required
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
      />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}
    >
      <div className="card fade-in" style={{ width: "100%", maxWidth: 400, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "var(--primary)" }}>
            <Compass size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26 }}>Kaarwan</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 6 }}>
            Start building your professional journey.
          </p>
        </div>

        <button onClick={googleLogin} className="btn btn-outline" style={{ width: "100%", marginBottom: 16, gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 35.5 24 35.5c-6.4 0-11.7-5.2-11.7-11.7S17.6 12 24 12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.5 0 19.1-8.1 19.1-19.5 0-1.3-.1-2.7-.4-4z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 12 24 12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 16.4 4 9.8 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.7 39.6 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.1 5.2C40.6 36 44 30.6 44 24c0-1.3-.1-2.7-.4-4z" />
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 11.5, color: "var(--muted-soft)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {field(<User size={16} color="var(--muted)" />, "text", "Full name", "name")}
          {field(<AtSign size={16} color="var(--muted)" />, "text", "Username", "username")}
          {field(<Mail size={16} color="var(--muted)" />, "email", "Email address", "email")}
          {field(<Lock size={16} color="var(--muted)" />, "password", "Password", "password")}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 4 }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 20 }}>
          Already on Kaarwan?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
