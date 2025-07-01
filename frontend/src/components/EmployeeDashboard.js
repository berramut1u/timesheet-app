import { useState, useEffect } from "react";
import { addTimesheet, getTimesheets, editTimesheet, deleteTimesheet } from "../api";
import TimesheetForm from "./TimesheetForm";

const EmployeeDashboard = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [editingTimesheet, setEditingTimesheet] = useState(null); // Track which timesheet is being edited
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadTimesheets();
    }, []);

    // ✅ Fetch user's timesheets from API
    const loadTimesheets = async () => {
        try {
            const data = await getTimesheets();
            if (Array.isArray(data)) {
                setTimesheets(data);
            } else {
                setMessage("Timesheet verileri yüklenirken hata oluştu.");
            }
        } catch (error) {
            console.error("Error loading timesheets:", error);
            setMessage("Sunucuya bağlanılamadı.");
        }
    };

    // ✅ Handle new timesheet submission
    const handleAddTimesheet = async (project, hours, description, date) => {
        const response = await addTimesheet(project, hours, description, date);
        if (response.message) {
            alert(response.message);
            loadTimesheets(); // Refresh the timesheet list
        }
    };

    // ✅ Handle timesheet editing
    const handleEditTimesheet = async (id, updatedData) => {
        const response = await editTimesheet(id, updatedData);
        if (response.message) {
            alert(response.message);
            setEditingTimesheet(null);
            loadTimesheets();
        }
    };

    // ✅ Handle timesheet deletion
    const handleDeleteTimesheet = async (id) => {
        if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            const response = await deleteTimesheet(id);
            if (response.message) {
                alert(response.message);
                loadTimesheets();
            }
        }
    };

    return (
        <div>
            <h2>Çalışan Paneli</h2>

            {/* ✅ Add Timesheet Form */}
            <TimesheetForm onSuccess={loadTimesheets} />

            <h3>Timesheet Kayıtlarınız</h3>
            {message && <p>{message}</p>}

            {/* ✅ List Existing Timesheets */}
            <ul>
                {timesheets.length > 0 ? (
                    timesheets.map((t) => (
                        <li key={t.id}>
                            {t.date} - {t.project} ({t.hours} saat) - {t.description}
                            
                            {/* ✅ Edit Button */}
                            <button onClick={() => setEditingTimesheet(t)}>Düzenle</button>

                            {/* ✅ Delete Button */}
                            <button onClick={() => handleDeleteTimesheet(t.id)}>Sil</button>

                            {/* ✅ Edit Form (Appears when a timesheet is being edited) */}
                            {editingTimesheet && editingTimesheet.id === t.id && (
                                <TimesheetForm
                                    initialData={t}
                                    onSubmit={(updatedData) => handleEditTimesheet(t.id, updatedData)}
                                />
                            )}

                        </li>
                    ))
                ) : (
                    <p>Henüz bir timesheet eklenmedi.</p>
                )}
            </ul>
        </div>
    );
};

export default EmployeeDashboard;
