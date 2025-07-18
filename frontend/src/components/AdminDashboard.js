import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  deleteAdminUser,
  getAdminUsers,
  getAdminTimesheets,
  getAdminStats,
} from "../api";
import Navbar from "./Navbar";
import { Bar } from "react-chartjs-2"; // Assuming you have react-chartjs-2 installed
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [stats, setStats] = useState([]);

  // Decode token to get logged in admin info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setMe({
          id: decoded.sub || decoded.identity || decoded.user_id,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          role: decoded.role,
          email: decoded.email,
        });
      } catch (err) {
        console.error("Token çözülürken hata:", err);
      }
    }
  }, []);

  // Load users and stats once admin info is ready
  useEffect(() => {
    if (!me) return;

    getAdminUsers()
      .then((data) => setUsers(data))
      .catch((e) => console.error("Kullanıcıları getirme hatası:", e));

    getAdminStats()
      .then((data) => setStats(data))
      .catch((e) => console.error("İstatistikleri getirme hatası:", e));
  }, [me]);

  // Load selected user's timesheets
  useEffect(() => {
    if (!selectedUser) {
      setTimesheets([]);
      return;
    }
    getAdminTimesheets(selectedUser.id)
      .then((data) => setTimesheets(data))
      .catch((e) => console.error("Timesheetleri getirme hatası:", e));
  }, [selectedUser]);

  // Delete currently logged-in admin account
  const handleDeleteMyAccount = async () => {
    if (!window.confirm("Hesabınızı silmek istediğinize emin misiniz?")) return;

    const res = await deleteAdminUser(me.id);
    if (res.success) {
      alert("Hesabınız silindi. Çıkış yapılıyor...");
      localStorage.removeItem("token");
      window.location.href = "/";
    } else {
      alert(res.error || "Silme sırasında hata oluştu.");
    }
  };

  // Delete selected user account (employees only)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    const res = await deleteAdminUser(userId);
    if (res.success) {
      alert("Kullanıcı silindi.");
      setUsers(users.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    } else {
      alert(res.error || "Silme sırasında hata oluştu.");
    }
  };

  // Prepare data for the bar chart: names/emails with total hours
  const chartData = {
    labels: stats.map((s) => `${s.name} (${s.email || "email yok"})`),
    datasets: [
      {
        label: "Toplam Saat",
        data: stats.map((s) => s.total_hours),
        backgroundColor: "rgba(67, 17, 195, 0.7)", // blue-ish
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Paneli
        </h2>

        {/* Admin's own delete button */}
        <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md text-center mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Hoşgeldiniz {me?.first_name} {me?.last_name}
          </h3>
          <p className="text-gray-600 mb-6">
            Buradan kendi hesabınızı yönetebilirsiniz.
          </p>

          <button
            onClick={handleDeleteMyAccount}
            className="bg-gradient-to-r from-purple-500 to-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Hesabımı Sil
          </button>
        </div>

        {/* Users list */}
        <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Çalışanlar</h3>
          {users.length === 0 ? (
            <p>Çalışan bulunamadı.</p>
          ) : (
            <ul className="text-left">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                    selectedUser?.id === user.id ? "bg-blue-100" : ""
                  } flex justify-between items-center`}
                  onClick={() => setSelectedUser(user)}
                >
                  <span>
                    {user.first_name} {user.last_name} ({user.email})
                  </span>

                  {/* Delete button for users (not for self/admins) */}
                  {user.id !== me.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                      className="bg-gradient-to-r from-purple-500 to-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      title="Kullanıcıyı Sil"
                    >
                      Sil
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected user's timesheets */}
        {selectedUser && (
          <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md mb-8 text-left">
            <h3 className="text-xl font-semibold mb-4">
              {selectedUser.first_name} {selectedUser.last_name} - Timesheetler
            </h3>
            {timesheets.length === 0 ? (
              <p>Bu kullanıcı için timesheet bulunamadı.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Proje</th>
                    <th className="border px-2 py-1">Saat</th>
                    <th className="border px-2 py-1">Tarih</th>
                    <th className="border px-2 py-1">Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-100">
                      <td className="border px-2 py-1">{t.project}</td>
                      <td className="border px-2 py-1">{t.hours}</td>
                      <td className="border px-2 py-1">{t.date}</td>
                      <td className="border px-2 py-1">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Stats bar chart */}
        <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Çalışan İstatistikleri</h3>
          {stats.length === 0 ? (
            <p>İstatistik bulunamadı.</p>
          ) : (
            <Bar data={chartData} />
          )}
        </div>
      </div>
    </>
  );
}
