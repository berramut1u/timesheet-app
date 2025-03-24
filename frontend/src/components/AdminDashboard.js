import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "Yönetici") {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div>
            <h2>Yönetici Timesheet Paneli</h2>
            <p>Çalışanların timesheet kayıtlarını burada yönetebilirsiniz.</p>
        </div>
    );
};

export default AdminDashboard;
