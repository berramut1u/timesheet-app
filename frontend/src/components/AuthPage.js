import { useState } from "react";
import { login, signup } from "../api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Çalışan");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        const data = await signup(firstName, lastName, email, password, role);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.role);
          navigate(data.role === "Yönetici" ? "/admin-dashboard" : "/employee-dashboard");
        } else {
          setMessage(data.message || "Kayıt başarısız.");
        }
      } else {
        const data = await login(email, password);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.role);
          navigate(data.role === "Yönetici" ? "/admin-dashboard" : "/employee-dashboard");
        } else {
          setMessage(data.message || "Giriş başarısız.");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isSignup ? "Kayıt Ol" : "Giriş Yap"}
          </h2>

          {message && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <>
                <div>
                  <label className="block text-gray-700 mb-1">İsim</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="İsim"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Soyisim</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Soyisim"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 mb-1">E‑posta</label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E‑posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-gray-700 mb-1">Rol</label>
                <select
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Çalışan">Çalışan</option>
                  <option value="Yönetici">Yönetici</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {isSignup ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-700">
            {isSignup ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
            <button
              className="text-blue-600 hover:underline font-semibold focus:outline-none"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
            >
              {isSignup ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}