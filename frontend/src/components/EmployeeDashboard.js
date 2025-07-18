import { useState, useEffect } from "react";
import {
  addTimesheet,
  getTimesheets,
  editTimesheet,
  deleteTimesheet,
} from "../api";
import TimesheetForm from "./TimesheetForm";
import Navbar from "./Navbar";

export default function EmployeeDashboard() {
  const [timesheets, setTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [addingTimesheet, setAddingTimesheet] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    try {
      const data = await getTimesheets();
      if (Array.isArray(data)) {
        setTimesheets(data);
        setMessage("");
      } else {
        setMessage("Timesheet verileri yüklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error loading timesheets:", error);
      setMessage("Sunucuya bağlanılamadı.");
    }
  };

  const handleAddTimesheet = async (project, hours, description, date) => {
    const response = await addTimesheet(project, hours, description, date);
    if (response.message) {
      alert(response.message);
      loadTimesheets();
    }
  };

  const handleEditTimesheet = async (id, updatedData) => {
    const response = await editTimesheet(id, updatedData);
    if (response.message) {
      alert(response.message);
      setEditingTimesheet(null);
      loadTimesheets();
    }
  };

  const handleDeleteTimesheet = async (id) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      const response = await deleteTimesheet(id);
      if (response.message) {
        alert(response.message);
        loadTimesheets();
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // If adding, show only the add form
  if (addingTimesheet) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Yeni Timesheet Ekle
            </h3>
            <TimesheetForm
              onSuccess={() => {
                loadTimesheets();
                setAddingTimesheet(false);
              }}
              onCancel={() => setAddingTimesheet(false)}
            />
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // If editing, show only the edit form
  if (editingTimesheet) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Timesheet Düzenle
            </h3>
            <TimesheetForm
              initialData={editingTimesheet}
              onSubmit={(updatedData) =>
                handleEditTimesheet(editingTimesheet.id, updatedData)
              }
              onCancel={() => setEditingTimesheet(null)}
            />
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Otherwise, render the dashboard normally
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Çalışan Paneli
        </h2>

        {/* Button to open Add Timesheet form */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-center">
          <button
            onClick={() => setAddingTimesheet(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
          >
            + Yeni Timesheet Ekle
          </button>
        </div>

        {/* Timesheet List */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Timesheet Kayıtlarınız</h3>
          {message && <p className="text-red-600 mb-4">{message}</p>}

          {timesheets.length > 0 ? (
            <ul className="space-y-4">
              {timesheets.map((t) => (
                <li
                  key={t.id}
                  className="border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <span>
                      <strong>Tarih:</strong> {t.date}
                    </span>
                    <span>
                      <strong>Proje:</strong> {t.project}
                    </span>
                    <span>
                      <strong>Saat:</strong> {t.hours} saat
                    </span>
                    <span>
                      <strong>Açıklama:</strong> {t.description}
                    </span>
                  </div>

                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <button
                      onClick={() => setEditingTimesheet(t)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteTimesheet(t.id)}
                      className="bg-gradient-to-r from-purple-500 to-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Henüz bir timesheet eklenmedi.</p>
          )}
        </div>
      </div>
    </>
  );
}
