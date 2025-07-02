// src/components/AdminDashboard.js
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminUsers, getAdminTimesheets, getAdminStats } from "../api";

export default function AdminDashboard() {
  const [users, setUsers]       = useState([]);
  const [selectedUser, setUser] = useState(null);
  const [timesheets, setSheets] = useState([]);
  const [stats, setStats]       = useState([]);

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
      getAdminTimesheets(selectedUser).then(setSheets);
    }
  }, [selectedUser]);

  return (
    <div>
      <h2>Admin Paneli</h2>

      <section>
        <h3>Çalışanlar</h3>
        <ul>
          {users.map(u => (
            <li key={u.id}>
              <button onClick={() => setUser(u.id)}>
                {u.email} ({u.role})
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selectedUser && (
        <section>
          <h3>{selectedUser} no’lu çalışanın Timesheet’leri</h3>
          <table>
            <thead>
              <tr><th>Tarih</th><th>Proje</th><th>Saat</th><th>Açıklama</th></tr>
            </thead>
            <tbody>
              {timesheets.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.project}</td>
                  <td>{t.hours}</td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <h3>Çalışma Saatleri İstatistikleri</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <XAxis dataKey="user_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_hours" name="Toplam Saat" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
