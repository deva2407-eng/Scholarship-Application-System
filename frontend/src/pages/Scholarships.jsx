import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    const icons = {
        graduation: (
            <>
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c3 2 9 2 12 0v-5" />
                <path d="M22 10v6" />
            </>
        ),

        calendar: (
            <>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
            </>
        ),

        money: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M6 9h.01M18 15h.01" />
            </>
        ),

        check: (
            <>
                <path d="m5 12 4 4L19 6" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </>
        )
    };

    return (
        <svg {...common}>
            {icons[name]}
        </svg>
    );
}

function Scholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                
"https://scholarship-application-system-lern.onrender.com/api/scholarships",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to load scholarships."
                );
                return;
            }

            /*
                Backend returns:

                {
                    count: 1,
                    scholarships: [...]
                }

                We only need the scholarships array.
            */
            setScholarships(
                Array.isArray(data.scholarships)
                    ? data.scholarships
                    : []
            );

        } catch (error) {
            console.error(
                "Scholarship loading error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    if (loading) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <div>
                        <Link
                            to="/student"
                            className="back-link"
                        >
                            ← Dashboard
                        </Link>

                        <h1>Scholarships</h1>

                        <p>
                            Explore funding opportunities
                            and check your eligibility
                            before applying.
                        </p>
                    </div>
                </div>

                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Icon
                            name="search"
                            size={28}
                        />
                    </div>

                    <h2>
                        Loading scholarships...
                    </h2>

                    <p>
                        Please wait while we fetch
                        available opportunities.
                    </p>
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <div>
                        <Link
                            to="/student"
                            className="back-link"
                        >
                            ← Dashboard
                        </Link>

                        <h1>Scholarships</h1>

                        <p>
                            Explore funding opportunities
                            and check your eligibility
                            before applying.
                        </p>
                    </div>
                </div>

                <div className="empty-state">

                    <div className="empty-state-icon">
                        <Icon
                            name="search"
                            size={28}
                        />
                    </div>

                    <h2>
                        Unable to load scholarships
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={fetchScholarships}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <div>

                    <Link
                        to="/student"
                        className="back-link"
                    >
                        ← Dashboard
                    </Link>

                    <h1>
                        Scholarships
                    </h1>

                    <p>
                        Explore funding opportunities
                        and check your eligibility
                        before applying.
                    </p>

                </div>

            </div>

            {scholarships.length === 0 ? (
                <div className="empty-state">

                    <div className="empty-state-icon">
                        <Icon
                            name="graduation"
                            size={28}
                        />
                    </div>

                    <h2>
                        No scholarships available
                    </h2>

                    <p>
                        New opportunities will appear
                        here when they are created.
                    </p>

                </div>
            ) : (
                <div className="scholarship-grid">

                    {scholarships.map(
                        (scholarship) => (
                            <div
                                className="scholarship-card"
                                key={scholarship._id}
                            >

                                <div className="scholarship-card-header">

                                    <div className="scholarship-icon">
                                        <Icon
                                            name="graduation"
                                            size={24}
                                        />
                                    </div>

                                    <span
                                        className={
                                            scholarship.status === "open"
                                                ? "status-badge status-open"
                                                : "status-badge status-closed"
                                        }
                                    >
                                        {scholarship.status}
                                    </span>

                                </div>

                                <h2>
                                    {scholarship.title}
                                </h2>

                                <p className="scholarship-description">
                                    {scholarship.description}
                                </p>

                                <div className="scholarship-details">

                                    <div className="scholarship-detail">

                                        <Icon
                                            name="money"
                                            size={18}
                                        />

                                        <div>
                                            <span>
                                                Award Amount
                                            </span>

                                            <strong>
                                                {formatAmount(
                                                    scholarship.amount
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="scholarship-detail">

                                        <Icon
                                            name="graduation"
                                            size={18}
                                        />

                                        <div>
                                            <span>
                                                Minimum GPA
                                            </span>

                                            <strong>
                                                {scholarship.minGpa}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="scholarship-detail">

                                        <Icon
                                            name="calendar"
                                            size={18}
                                        />

                                        <div>
                                            <span>
                                                Deadline
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    scholarship.deadline
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                                <div className="scholarship-eligibility">

                                    <strong>
                                        Eligibility
                                    </strong>

                                    <p>
                                        {scholarship.eligibility}
                                    </p>

                                </div>

                                <Link
                                    to={`/apply?id=${scholarship._id}`}
                                    className="scholarship-apply-button"
                                >
                                    View & Apply

                                    <Icon
                                        name="arrow"
                                        size={18}
                                    />
                                </Link>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default Scholarships;