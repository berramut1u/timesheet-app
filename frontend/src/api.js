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

export const getDashboard = async (token) => {
    const response = await fetch(`${API_URL}/protected/dashboard`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });
    return response.json();
};
