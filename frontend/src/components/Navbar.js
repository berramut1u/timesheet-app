import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
      <div className="w-full px-6 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-white">Timesheet App</span>

        {isLoggedIn && ( 
          <button
            onClick={handleLogout}
            className="
              bg-white
              px-4 py-2 
              rounded-lg 
              hover:bg-gray-100
              transition duration-200
            "
          >
            <span
              className="
                bg-clip-text text-transparent
                bg-gradient-to-r from-blue-500 to-purple-600
                font-bold
              "
            >
              Çıkış Yap
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
