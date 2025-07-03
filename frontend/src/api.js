const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export const signup = async (email, password, role) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
    });
    return response.json();
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

// Add timesheet
export const addTimesheet = async (project, hours, description, date) => {
    const token = localStorage.getItem("token");

    const payload = {
        project: String(project),
        hours: Number(hours),
        description: String(description),
        date: String(date)
        };

    console.log("📤 Gönderilen Timesheet JSON:", JSON.stringify(payload, null, 2));  // Debugging için

    const response = await fetch(`${API_URL}/timesheet/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),  
    });

    const responseData = await response.json();
    console.log("📥 API Yanıtı:", responseData);  // API'den dönen cevabı gösterelim.

    return responseData;
};




// Get user's timesheets
export const getTimesheets = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/timesheet/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
};

// Edit a timesheet
export const editTimesheet = async (id, updatedData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/timesheet/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
    });
    return response.json();
};

// Delete a timesheet
export const deleteTimesheet = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/timesheet/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
};


export const getDashboard = async (token) => {
    const response = await fetch(`${API_URL}/protected/dashboard`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });
    return response.json();
};

export const getAdminUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getAdminTimesheets = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/admin/timesheets?user_id=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getAdminStats = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

