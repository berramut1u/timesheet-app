import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminUsers, getAdminTimesheets, getAdminStats } from "../api";
import Navbar from "./Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setUser] = useState(null);
  const [selectedUserName, setUserName] = useState("");
  const [timesheets, setSheets] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function load() {
      const u = await getAdminUsers();
      setUsers(u);
      const s = await getAdminStats();
      setStats(s);
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const user = users.find(u => u.id === selectedUser);
      setUserName(user ? `${user.first_name} ${user.last_name}` : "");
      getAdminTimesheets(selectedUser).then(setSheets);
    } else {
      setSheets([]);
      setUserName("");
    }
  }, [selectedUser, users]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Paneli</h2>

        <section className="max-w-6xl mx-auto mb-8">
          <h3 className="text-2xl font-semibold mb-4">Çalışanlar</h3>
          <ul className="flex flex-wrap gap-3">
            {users.map(u => (
              <li key={u.id}>
                <button
                  onClick={() => setUser(u.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedUser === u.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                  } transition`}
                >
                  {u.first_name} {u.last_name} ({u.role})
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selectedUser && (
          <section className="max-w-6xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">{selectedUserName} Timesheet’leri</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Tarih</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Proje</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Saat</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map(t => (
                    <tr key={t.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{t.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{t.project}</td>
                      <td className="border border-gray-300 px-4 py-2">{t.hours}</td>
                      <td className="border border-gray-300 px-4 py-2">{t.description}</td>
                    </tr>
                  ))}
                  {timesheets.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-4">
                        Seçilen kullanıcıya ait timesheet bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Çalışma Saatleri İstatistikleri</h3>
          {stats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_hours" name="Toplam Saat" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">İstatistik verisi bulunamadı.</p>
          )}
        </section>
      </div>
    </>
  );
}
