import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();          // remove token & role
    navigate("/");                // redirect to login
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-white">Timesheet App</span>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}
