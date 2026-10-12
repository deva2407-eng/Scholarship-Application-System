import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Icon({ name, size = 18 }) {

    const paths = {

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

        check: (
            <>
                <path d="m5 12 4 4L19 6" />
            </>
        ),

        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),

        x: (
            <>
                <path d="m7 7 10 10M17 7 7 17" />
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
        >
            {paths[name]}
        </svg>
    );
}


function MyApplications() {

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const load = async () => {

            try {

                const response =
                    await fetch(
                        "https://scholarship-application-system-lern.onrender.com/api/applications/my",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load applications."
                    );

                }

                setApplications(
    Array.isArray(data.applications)
        ? data.applications
        : []
);


            } catch (err) {

                setError(
                    err.message ||
                    "Unable to load applications."
                );

            } finally {

                setLoading(false);

            }

        };


        load();

    }, []);


    const formatStatus =
        (status) =>
            status.charAt(0).toUpperCase() +
            status.slice(1);


    const timelineClass =
        (status, step) => {

            if (status === "rejected") {

                return step === "pending"
                    ? "timeline-step complete"
                    : "timeline-step rejected-step";
            }


            if (status === "approved") {

                return "timeline-step complete";

            }


            return step === "pending"
                ? "timeline-step active"
                : "timeline-step";

        };


    return (

        <div className="applications-page">

            <div className="applications-header">

                <div>

                    <Link
                        className="applications-back"
                        to="/student"
                    >
                        Dashboard
                    </Link>

                    <h1>
                        My applications
                    </h1>

                    <p>
                        Track every scholarship application
                        from submission to decision.
                    </p>

                </div>


                <Link
                    className="browse-button"
                    to="/scholarships"
                >

                    Browse scholarships

                    <Icon
                        name="arrow"
                        size={16}
                    />

                </Link>

            </div>


            {error && (
                <div className="applications-error">
                    {error}
                </div>
            )}


            {loading ? (

                <div className="applications-state">

                    <div className="state-icon">
                        <Icon
                            name="applications"
                            size={36}
                        />
                    </div>

                    <h2>
                        Loading applications...
                    </h2>

                    <p>
                        Fetching your scholarship
                        application history.
                    </p>

                </div>

            ) : applications.length === 0 ? (

                <div className="applications-state">

                    <div className="state-icon">
                        <Icon
                            name="applications"
                            size={36}
                        />
                    </div>

                    <h2>
                        No applications yet
                    </h2>

                    <p>
                        Choose a scholarship to submit
                        your first application.
                    </p>


                    <Link
                        className="browse-button"
                        to="/scholarships"
                    >

                        Explore scholarships

                        <Icon
                            name="arrow"
                            size={16}
                        />

                    </Link>

                </div>

            ) : (

                <div className="applications-list">

                    {applications.map(
                        (application) => {

                            const scholarship =
                                application.scholarship ||
                                {};


                            return (

                                <article
                                    className="application-card"
                                    key={application._id}
                                >

                                    <div className="application-icon">

                                        <Icon
                                            name="applications"
                                            size={22}
                                        />

                                    </div>


                                    <div className="application-main">

                                        <div className="application-title-row">

                                            <div>

                                                <span className="application-label">
                                                    SCHOLARSHIP
                                                </span>

                                                <h2>
                                                    {scholarship.title ||
                                                        "Scholarship"}
                                                </h2>

                                            </div>


                                            <span
                                                className={
                                                    `application-status ${application.status}`
                                                }
                                            >
                                                {formatStatus(
                                                    application.status
                                                )}
                                            </span>

                                        </div>


                                        <div className="application-details">

                                            <div>

                                                <span>
                                                    AWARD
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        scholarship.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    MIN GPA
                                                </span>

                                                <strong>
                                                    {scholarship.minGpa ??
                                                        "—"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    DEADLINE
                                                </span>

                                                <strong>

                                                    {scholarship.deadline
                                                        ? new Date(
                                                            scholarship.deadline
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )
                                                        : "—"}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    APPLIED ON
                                                </span>

                                                <strong>

                                                    {new Date(
                                                        application.appliedAt ||
                                                        application.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                </strong>

                                            </div>

                                        </div>


                                        <div className="application-timeline">

                                            <div
                                                className={
                                                    timelineClass(
                                                        application.status,
                                                        "pending"
                                                    )
                                                }
                                            >

                                                <span>
                                                    <Icon
                                                        name="clock"
                                                        size={13}
                                                    />
                                                </span>

                                                <div>

                                                    <strong>
                                                        Submitted
                                                    </strong>

                                                    <small>
                                                        Application received
                                                    </small>

                                                </div>

                                            </div>


                                            <div
                                                className={
                                                    application.status ===
                                                    "approved"
                                                        ? "timeline-step complete"
                                                        : "timeline-step"
                                                }
                                            >

                                                <span>

                                                    <Icon
                                                        name={
                                                            application.status ===
                                                            "rejected"
                                                                ? "x"
                                                                : "check"
                                                        }
                                                        size={13}
                                                    />

                                                </span>


                                                <div>

                                                    <strong>
                                                        Decision
                                                    </strong>

                                                    <small>
                                                        {formatStatus(
                                                            application.status
                                                        )}
                                                    </small>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </article>

                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
}


export default MyApplications;