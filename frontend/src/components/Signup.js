import { useState } from "react";
import { signup } from "../api";

const Signup = ({ onSignupSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Çalışan"); // Default role: Çalışan
    const [message, setMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("Signup request started...");
    
        try {
            const data = await signup(email, password, role);
            console.log("Signup response:", data); // ✅ Log the response
    
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("role", data.role);
                setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
                setTimeout(() => onSignupSuccess(), 2000);
            } else {
                setMessage(data.message || "Kayıt başarısız.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setMessage("Sunucu hatası, lütfen tekrar deneyin.");
        }
    };
    
    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Çalışan">Çalışan</option>
                    <option value="Yönetici">Yönetici</option>
                </select>
                <button type="submit">Kayıt Ol</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Signup;
