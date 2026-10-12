
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://scholarship-application-system-lern.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed.");
                return;
            }

            if (!data.token || !data.user) {
                setError("Login response is missing authentication information.");
                return;
            }

            // Only an actual admin account can enter this portal.
            if (data.user.role !== "admin") {
                setError("Access denied. Please use a registered admin account.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/admin", { replace: true });

        } catch (error) {
            console.error("Admin login error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🛡️</div>

                <h1>Admin Login</h1>

                <p className="auth-subtitle">
                    Sign in to manage scholarships and applications
                </p>

                {error && (
                    <div className="auth-error">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="admin-email">Admin Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter admin password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Sign In as Admin"}
                    </button>
                </form>

                <p className="auth-footer">
                    Student? <Link to="/login">Return to student login</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;
