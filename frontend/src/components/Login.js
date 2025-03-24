import { useState } from "react";
import { login, getDashboard } from "../api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await login(email, password);
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            setMessage("Giriş başarılı! Şimdi dashboard verisini çekiyoruz...");
            fetchDashboard(data.access_token);
        } else {
            setMessage(data.message || "Giriş başarısız.");
        }
    };

    const fetchDashboard = async (token) => {
        const data = await getDashboard(token);
        setMessage(data.message || "Dashboard yüklenemedi.");
    };

    return (
        <div>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Giriş Yap</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;
