import { useEffect, useState } from "react";
import { getTimesheets } from "../api";

const TimesheetList = () => {
    const [timesheets, setTimesheets] = useState([]);

    useEffect(() => {
        loadTimesheets();
    }, []);

    const loadTimesheets = async () => {
        const data = await getTimesheets();
        setTimesheets(data);
    };

    return (
        <div>
            <h3>Timesheet Kayıtlarınız</h3>
            <ul>
                {timesheets.map((t) => (
                    <li key={t.id}>
                        {t.date} - {t.project} ({t.hours} saat) - {t.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TimesheetList;
