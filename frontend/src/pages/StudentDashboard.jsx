import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://scholarship-application-system-lern.onrender.com/api";

function Icon({ name, size = 20 }) {
    const paths = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        scholarship: (
            <>
                <path d="M3 7.5 12 3l9 4.5L12 12 3 7.5Z" />
                <path d="M6 10v5.5c2.8 2.2 9.2 2.2 12 0V10" />
                <path d="M21 8v6" />
            </>
        ),

        applications: (
            <>
                <path d="M7 3h10l4 4v14H3V3h4Z" />
                <path d="M7 12h10M7 16h7M7 8h4" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
            </>
        ),

        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),

        check: (
            <>
                <path d="m5 12 4 4L19 6" />
            </>
        ),

        x: (
            <>
                <path d="m7 7 10 10M17 7 7 17" />
            </>
        ),

        logout: (
            <>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 3v18" />
            </>
        )
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    );
}

function StudentDashboard() {
    const [user, setUser] = useState({});
    const [scholarships, setScholarships] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [
                    scholarshipResponse,
                    applicationResponse
                ] = await Promise.all([
                    fetch(`${API}/scholarships`, {
                        headers
                    }),

                    fetch(`${API}/applications/my`, {
                        headers
                    })
                ]);

                const scholarshipData =
                    await scholarshipResponse.json();

                const applicationData =
                    await applicationResponse.json();

                if (!scholarshipResponse.ok) {
                    throw new Error(
                        scholarshipData.message ||
                        "Unable to load scholarships."
                    );
                }

                if (!applicationResponse.ok) {
                    throw new Error(
                        applicationData.message ||
                        "Unable to load applications."
                    );
                }

                setScholarships(
                    Array.isArray(scholarshipData)
                        ? scholarshipData
                        : []
                );

                setApplications(
    Array.isArray(applicationData.applications)
        ? applicationData.applications
        : []
);
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load dashboard."
                );

            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadDashboard();
        } else {
            setLoading(false);
            setError("Please sign in again.");
        }

    }, [token]);

    const openScholarships =
        scholarships.filter(
            (item) => item.status === "open"
        );

    const pending =
        applications.filter(
            (item) => item.status === "pending"
        ).length;

    const approved =
        applications.filter(
            (item) => item.status === "approved"
        ).length;

    const rejected =
        applications.filter(
            (item) => item.status === "rejected"
        ).length;

    const initials = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "S";

    return (
        <div className="student-dashboard-page">

            <div className="dashboard-topbar">

                <div>

                    <p className="dashboard-label">
                        STUDENT PORTAL
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {user?.name || "Student"}
                    </h1>

                    <p className="dashboard-subtitle">
                        Discover scholarships, submit
                        applications, and track every decision.
                    </p>

                </div>

                <div className="profile-chip">

                    <div className="avatar">
                        {initials}
                    </div>

                    <div>

                        <strong>
                            {user?.name || "Student"}
                        </strong>

                        <span>
                            {user?.email ||
                                "Student account"}
                        </span>

                    </div>

                </div>

            </div>


            {error && (
                <div className="applications-error">
                    {error}
                </div>
            )}


            <section className="stats-grid">

                <div className="stat-card purple">

                    <div className="stat-icon">
                        <Icon name="scholarship" />
                    </div>

                    <div>
                        <span>
                            Open Scholarships
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : openScholarships.length}
                        </strong>
                    </div>

                </div>


                <div className="stat-card blue">

                    <div className="stat-icon">
                        <Icon name="applications" />
                    </div>

                    <div>
                        <span>
                            Total Applications
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : applications.length}
                        </strong>
                    </div>

                </div>


                <div className="stat-card orange">

                    <div className="stat-icon">
                        <Icon name="clock" />
                    </div>

                    <div>
                        <span>
                            Pending
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : pending}
                        </strong>
                    </div>

                </div>


                <div className="stat-card green">

                    <div className="stat-icon">
                        <Icon name="check" />
                    </div>

                    <div>
                        <span>
                            Approved
                        </span>

                        <strong>
                            {loading
                                ? "—"
                                : approved}
                        </strong>
                    </div>

                </div>

            </section>


            <section className="dashboard-columns">

                <div className="dashboard-card">

                    <div className="card-heading">

                        <div>

                            <span className="section-label">
                                PROFILE
                            </span>

                            <h2>
                                Your student profile
                            </h2>

                        </div>

                    </div>


                    <div className="profile-info">

                        <div>
                            <span>Name</span>
                            <strong>
                                {user?.name || "—"}
                            </strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>
                                {user?.email || "—"}
                            </strong>
                        </div>

                        <div>
                            <span>GPA</span>
                            <strong>
                                {user?.gpa ?? "—"}
                            </strong>
                        </div>

                        <div>
                            <span>Account status</span>
                            <strong className="profile-status">
                                Active
                            </strong>
                        </div>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-heading">

                        <div>

                            <span className="section-label">
                                QUICK ACTIONS
                            </span>

                            <h2>
                                Move faster
                            </h2>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            className="quick-action purple-action"
                            to="/scholarships"
                        >

                            <span>
                                <Icon name="scholarship" />
                            </span>

                            <div>

                                <strong>
                                    Browse scholarships
                                </strong>

                                <small>
                                    Explore available funding
                                    opportunities
                                </small>

                            </div>

                            <b>
                                <Icon
                                    name="arrow"
                                    size={17}
                                />
                            </b>

                        </Link>


                        <Link
                            className="quick-action blue-action"
                            to="/applications"
                        >

                            <span>
                                <Icon name="applications" />
                            </span>

                            <div>

                                <strong>
                                    Track applications
                                </strong>

                                <small>
                                    See your current
                                    application status
                                </small>

                            </div>

                            <b>
                                <Icon
                                    name="arrow"
                                    size={17}
                                />
                            </b>

                        </Link>

                    </div>

                </div>

            </section>


            <section className="scholarship-preview">

                <div className="card-heading">

                    <div>

                        <span className="section-label">
                            OPPORTUNITIES
                        </span>

                        <h2>
                            Latest scholarships
                        </h2>

                    </div>

                    <Link
                        className="view-all"
                        to="/scholarships"
                    >
                        View all
                    </Link>

                </div>


                {loading ? (

                    <div className="dashboard-loading">
                        Loading scholarships...
                    </div>

                ) : openScholarships.length === 0 ? (

                    <div className="dashboard-empty">
                        <p>
                            No open scholarships are
                            available right now.
                        </p>
                    </div>

                ) : (

                    <div className="mini-scholarship-grid">

                        {openScholarships
                            .slice(0, 3)
                            .map((scholarship) => (

                                <article
                                    className="mini-scholarship"
                                    key={scholarship._id}
                                >

                                    <div className="mini-icon">
                                        <Icon name="scholarship" />
                                    </div>

                                    <span className="open-badge">
                                        OPEN
                                    </span>

                                    <div className="mini-content">

                                        <h3>
                                            {scholarship.title}
                                        </h3>

                                        <p>
                                            ₹
                                            {Number(
                                                scholarship.amount || 0
                                            ).toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                    <Link
                                        className="mini-apply"
                                        to={`/apply?id=${scholarship._id}`}
                                    >
                                        View & apply
                                    </Link>

                                </article>

                            ))}

                    </div>

                )}

            </section>


            <div className="dashboard-summary-line">

                <span>
                    <Icon
                        name="check"
                        size={15}
                    />
                    {" "}
                    {approved} approved
                </span>

                <span>
                    <Icon
                        name="clock"
                        size={15}
                    />
                    {" "}
                    {pending} pending
                </span>

                <span>
                    <Icon
                        name="x"
                        size={15}
                    />
                    {" "}
                    {rejected} rejected
                </span>

            </div>

        </div>
    );
}

export default StudentDashboard;