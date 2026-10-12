
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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

            // Save authentication information
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect according to the user's role
            if (data.user.role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/student", { replace: true });
            }

        } catch (error) {
            console.error("Login error:", error);
            setError("Unable to connect to the server. Please try again.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-logo">
                    🎓
                </div>

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Sign in to your ScholarHub account
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-field">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
