import { useState, useEffect } from "react";
import { addTimesheet } from "../api";


const TimesheetForm = ({ initialData = null, onSubmit, onSuccess, onCancel }) => {
  const [project, setProject] = useState("Firma A");
  const [hours, setHours] = useState(1);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  // Set max date to today in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

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
        // Assuming addTimesheet returns a message
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
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="project">Proje</label>
          <select
            id="project"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="Firma A">Firma A</option>
            <option value="Firma B">Firma B</option>
            <option value="Firma C">Firma C</option>
            <option value="Internal">Internal</option>
            <option value="Resmî Tatil">Resmî Tatil</option>
            <option value="İzin">İzin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="hours">Çalışma Saati (1-8)</label>
          <input
            id="hours"
            type="number"
            min="1"
            max="8"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="date">Tarih</label>
          <input
            id="date"
            type="date"
            value={date}
            max={today}  // restrict future dates
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">Açıklama</label>
          <input
            id="description"
            type="text"
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            {initialData ? "Güncelle" : "Ekle"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              İptal
            </button>
          )}
        </div>

        {message && <p className="text-red-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default TimesheetForm;
