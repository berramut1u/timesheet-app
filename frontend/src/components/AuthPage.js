import { useState } from "react";
import { login, signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("Çalışan");
  const [message, setMessage]   = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        const data = await signup(email, password, role);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.role);
          navigate(data.role === "Yönetici" ? "/admin-dashboard" : "/employee-dashboard");
        } else {
          setMessage(data.message);
        }
      } else {
        const data = await login(email, password);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.role);
          navigate(data.role === "Yönetici" ? "/admin-dashboard" : "/employee-dashboard");
        } else {
          setMessage(data.message);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="auth-page">
      <h2>{isSignup ? "Kayıt Ol" : "Giriş Yap"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="E‑posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {isSignup && (
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="Çalışan">Çalışan</option>
            <option value="Yönetici">Yönetici</option>
          </select>
        )}

        <button type="submit">
          {isSignup ? "Kayıt Ol" : "Giriş Yap"}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}

      <p className="auth-toggle">
        {isSignup
          ? "Zaten hesabın var mı?"
          : "Hesabın yok mu?"}{" "}
        <button onClick={() => { setIsSignup(!isSignup); setMessage(""); }}>
          {isSignup ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </p>
    </div>
  );
}
