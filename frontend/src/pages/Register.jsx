
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gpa: "8.5"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://scholarship-application-system-lern.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        gpa: Number(formData.gpa)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed.");
                return;
            }

            setMessage("Registration successful! Redirecting...");

            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Scholarship Application System</h1>
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>GPA (0–10)</label>
                        <input
                            type="number"
                            name="gpa"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.gpa}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                {message && <p className="message">{message}</p>}

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
