import { useState } from "react";
import { addTimesheet } from "../api"; // Ensure this is correctly imported

const TimesheetForm = ({ onSuccess }) => {
    const [project, setProject] = useState("Firma A");
    const [hours, setHours] = useState(1);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState(""); // For debugging

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting timesheet..."); // ✅ Debugging log

        try {
            const response = await addTimesheet(project, hours, description, date);
            console.log("Response:", response); // ✅ Debugging log

            if (response.message) {
                setMessage(response.message);
                onSuccess();
            } else {
                setMessage("Failed to add timesheet.");
            }
        } catch (error) {
            console.error("Error adding timesheet:", error);
            setMessage("An error occurred.");
        }
    };

    return (
        <div>
            <h3>Add Timesheet</h3>
            <form onSubmit={handleSubmit}>
                <select value={project} onChange={(e) => setProject(e.target.value)}>
                    <option value="Firma A">Firma A</option>
                    <option value="Firma B">Firma B</option>
                    <option value="Firma C">Firma C</option>
                    <option value="Internal">Internal</option>
                    <option value="Resmî Tatil">Resmî Tatil</option>
                    <option value="İzin">İzin</option>
                </select>
                <input type="number" min="1" max="8" value={hours} onChange={(e) => setHours(Number(e.target.value))} required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="text" placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Ekle</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TimesheetForm;
