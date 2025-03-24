import { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login request started...");
    
        try {
            const data = await login(email, password);
            console.log("Login response:", data); // ✅ Log response for debugging
    
            if (data.access_token && data.role) {  // ✅ Ensure role is present
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("role", data.role);  // ✅ Store role
    
                setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
    
                setTimeout(() => {
                    if (data.role === "Yönetici") {
                        navigate("/admin-dashboard");
                    } else {
                        navigate("/employee-dashboard");
                    }
                }, 500);
            } else {
                setMessage(data.message || "Giriş başarısız.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Sunucu hatası, lütfen tekrar deneyin.");
        }
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
