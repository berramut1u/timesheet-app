import { useState, useEffect } from "react";
import { addTimesheet } from "../api";

const TimesheetForm = ({ initialData = null, onSubmit, onSuccess }) => {
    const [project, setProject] = useState("Firma A");
    const [hours, setHours] = useState(1);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");

    // ✅ Load data into form when editing
    useEffect(() => {
        if (initialData) {
            setProject(initialData.project);
            setHours(initialData.hours);
            setDescription(initialData.description);
            setDate(initialData.date);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedDate = new Date(date).toISOString().split("T")[0];

        const payload = {
            project,
            hours,
            description,
            date: formattedDate,
        };

        try {
            if (onSubmit) {
                // editing mode
                await onSubmit(payload);
            } else {
                // adding mode
                const response = await addTimesheet(project, hours, description, formattedDate);
                setMessage(response.message);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error("Form submit error:", error);
            setMessage("Hata oluştu.");
        }
    };

    return (
        <div>
            <h3>{initialData ? "Edit Timesheet" : "Add Timesheet"}</h3>
            <form onSubmit={handleSubmit}>
                <select value={project} onChange={(e) => setProject(e.target.value)}>
                    <option value="Firma A">Firma A</option>
                    <option value="Firma B">Firma B</option>
                    <option value="Firma C">Firma C</option>
                    <option value="Internal">Internal</option>
                    <option value="Resmî Tatil">Resmî Tatil</option>
                    <option value="İzin">İzin</option>
                </select>
                <input
                    type="number"
                    min="1"
                    max="8"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Açıklama"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">{initialData ? "Güncelle" : "Ekle"}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TimesheetForm;

