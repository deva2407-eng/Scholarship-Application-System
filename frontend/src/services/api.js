
const API_URL = "https://scholarship-application-system-lern.onrender.com/api";

const apiRequest = async (endpoint, data) => {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Network/API connection error:", error);
        throw new Error(
            "Could not reach the backend. Check the browser console for details."
        );
    }

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error(`Server returned an unreadable response (${response.status}).`);
    }

    if (!response.ok) {
        throw new Error(
            result.message || result.error || `Request failed (${response.status}).`
        );
    }

    return result;
};

export const registerUser = (userData) =>
    apiRequest("/auth/register", userData);

export const loginUser = (loginData) =>
    apiRequest("/auth/login", loginData);

export const getToken = () => localStorage.getItem("token");

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
