import { useEffect, useState } from "react";

const API_BASE_URL = "https://scholarship-application-system-lern.onrender.com/api";
const SERVER_BASE_URL = "http://https://scholarship-application-system-lern.onrender.com";

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    const icons = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        applications: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
            </>
        ),

        scholarship: (
            <>
                <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
                <path d="M6 11.5V16c3.5 2.5 8.5 2.5 12 0v-4.5" />
                <path d="M21 10v5" />
            </>
        ),

        document: (
            <>
                <path d="M7 3h7l4 4v14H7z" />
                <path d="M14 3v5h4" />
                <path d="M10 12h5" />
                <path d="M10 16h5" />
            </>
        ),

        student: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
            </>
        ),

        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M3 10h18" />
            </>
        ),

        check: (
            <>
                <path d="m5 12 4 4L19 6" />
            </>
        ),

        close: (
            <>
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
            </>
        ),

        eye: (
            <>
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" />
            </>
        ),

        external: (
            <>
                <path d="M14 4h6v6" />
                <path d="m20 4-9 9" />
                <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
            </>
        ),

        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
            </>
        ),

        refresh: (
            <>
                <path d="M20 11a8 8 0 0 0-14-4l-2 2" />
                <path d="M4 5v4h4" />
                <path d="M4 13a8 8 0 0 0 14 4l2-2" />
                <path d="M20 19v-4h-4" />
            </>
        )
    };

    return <svg {...common}>{icons[name]}</svg>;
}

function AdminDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedApplication, setSelectedApplication] =
        useState(null);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

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
        } catch (error) {
            console.error(
                "Admin applications error:",
                error
            );

            setError(
                error.message ||
                    "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (
        applicationId,
        status
    ) => {
        try {
            setUpdatingId(applicationId);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to update application status."
                );
            }

            setApplications(
                (currentApplications) =>
                    currentApplications.map(
                        (application) =>
                            application._id ===
                            applicationId
                                ? {
                                      ...application,
                                      status:
                                          data.application
                                              ?.status ||
                                          status
                                  }
                                : application
                    )
            );

            setSelectedApplication(
                (currentApplication) =>
                    currentApplication &&
                    currentApplication._id ===
                        applicationId
                        ? {
                              ...currentApplication,
                              status:
                                  data.application
                                      ?.status ||
                                  status
                          }
                        : currentApplication
            );
        } catch (error) {
            console.error(
                "Status update error:",
                error
            );

            setError(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const pendingCount = applications.filter(
        (application) =>
            application.status === "pending"
    ).length;

    const approvedCount = applications.filter(
        (application) =>
            application.status === "approved"
    ).length;

    const rejectedCount = applications.filter(
        (application) =>
            application.status === "rejected"
    ).length;

    const getStatusClass = (status) => {
        if (status === "approved") {
            return "admin-status approved";
        }

        if (status === "rejected") {
            return "admin-status rejected";
        }

        return "admin-status pending";
    };

    const formatStatus = (status) => {
        if (!status) return "Pending";

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getDocumentUrl = (application) => {
    if (!application?.document?.filename) {
        return "";
    }

    return `http://https://scholarship-application-system-lern.onrender.com/uploads/documents/${encodeURIComponent(
        application.document.filename
    )}`;
};
    const getDocumentType = (application) => {
        const mimetype =
            application?.document?.mimetype || "";

        if (mimetype === "application/pdf") {
            return "pdf";
        }

        if (mimetype.startsWith("image/")) {
            return "image";
        }

        return "other";
    };

    const closeReview = () => {
        setSelectedApplication(null);
    };

    return (
        <main className="admin-main">
            <header className="admin-header">
                <div>
                    <p className="dashboard-label">
                        ADMIN DASHBOARD
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {user?.name || "Administrator"}
                    </h1>

                    <p>
                        Review scholarship applications
                        and manage student decisions.
                    </p>
                </div>

                <div className="admin-profile-chip">
                    <div className="admin-avatar">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}
                    </div>

                    <div>
                        <strong>
                            {user?.name ||
                                "Administrator"}
                        </strong>

                        <span>Administrator</span>
                    </div>
                </div>
            </header>

            <section className="admin-stats">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon purple">
                        <Icon
                            name="applications"
                            size={20}
                        />
                    </div>

                    <div>
                        <span>
                            Total Applications
                        </span>

                        <strong>
                            {applications.length}
                        </strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange">
                        <Icon
                            name="calendar"
                            size={20}
                        />
                    </div>

                    <div>
                        <span>Pending Review</span>

                        <strong>
                            {pendingCount}
                        </strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon green">
                        <Icon
                            name="check"
                            size={20}
                        />
                    </div>

                    <div>
                        <span>Approved</span>

                        <strong>
                            {approvedCount}
                        </strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon red">
                        <Icon
                            name="close"
                            size={20}
                        />
                    </div>

                    <div>
                        <span>Rejected</span>

                        <strong>
                            {rejectedCount}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <span className="section-label">
                            APPLICATION MANAGEMENT
                        </span>

                        <h2>
                            Scholarship Applications
                        </h2>
                    </div>

                    <button
                        className="admin-refresh"
                        onClick={fetchApplications}
                        type="button"
                    >
                        <Icon
                            name="refresh"
                            size={16}
                        />
                        Refresh
                    </button>
                </div>

                {loading && (
                    <div className="admin-state">
                        <div>
                            <Icon
                                name="applications"
                                size={25}
                            />
                        </div>

                        <h2>
                            Loading applications...
                        </h2>

                        <p>
                            Fetching student
                            applications.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    applications.length === 0 && (
                        <div className="admin-state">
                            <div>
                                <Icon
                                    name="applications"
                                    size={25}
                                />
                            </div>

                            <h2>
                                No applications yet
                            </h2>

                            <p>
                                Student applications
                                will appear here.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    applications.length > 0 && (
                        <div className="admin-applications">
                            {applications.map(
                                (application) => {
                                    const student =
                                        application.student ||
                                        {};

                                    const scholarship =
                                        application.scholarship ||
                                        {};

                                    return (
                                        <article
                                            className="admin-application"
                                            key={
                                                application._id
                                            }
                                        >
                                            <div className="admin-application-top">
                                                <div className="admin-student-info">
                                                    <div className="admin-large-avatar">
                                                        {student
                                                            ?.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase() ||
                                                            "S"}
                                                    </div>

                                                    <div>
                                                        <span className="application-label">
                                                            STUDENT
                                                        </span>

                                                        <h3>
                                                            {student.name ||
                                                                "Unknown Student"}
                                                        </h3>

                                                        <p>
                                                            {student.email ||
                                                                "No email available"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={getStatusClass(
                                                        application.status
                                                    )}
                                                >
                                                    {formatStatus(
                                                        application.status
                                                    )}
                                                </span>
                                            </div>

                                            <div className="admin-application-details">
                                                <div>
                                                    <span>
                                                        SCHOLARSHIP
                                                    </span>

                                                    <strong>
                                                        {scholarship.title ||
                                                            "Unknown Scholarship"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        STUDENT GPA
                                                    </span>

                                                    <strong>
                                                        {student.gpa ??
                                                            "—"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        AWARD AMOUNT
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {scholarship.amount
                                                            ? Number(
                                                                  scholarship.amount
                                                              ).toLocaleString(
                                                                  "en-IN"
                                                              )
                                                            : "—"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        MINIMUM GPA
                                                    </span>

                                                    <strong>
                                                        {scholarship.minGpa ??
                                                            "—"}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        APPLIED ON
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            application.appliedAt ||
                                                                application.createdAt
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        DOCUMENT
                                                    </span>

                                                    <strong>
                                                        {application
                                                            .document
                                                            ?.filename ||
                                                            "Not available"}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="admin-application-actions">
                                                <button
                                                    className="admin-review-button"
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedApplication(
                                                            application
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="eye"
                                                        size={16}
                                                    />
                                                    Review Application
                                                </button>

                                                <a
                                                    className="admin-contact-button"
                                                    href={`mailto:${
                                                        student.email ||
                                                        ""
                                                    }`}
                                                >
                                                    <Icon
                                                        name="mail"
                                                        size={16}
                                                    />
                                                    Contact
                                                </a>

                                                {application.status ===
                                                "pending" ? (
                                                    <>
                                                        <button
                                                            className="admin-approve"
                                                            type="button"
                                                            disabled={
                                                                updatingId ===
                                                                application._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    application._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                name="check"
                                                                size={15}
                                                            />
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="admin-reject"
                                                            type="button"
                                                            disabled={
                                                                updatingId ===
                                                                application._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    application._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                name="close"
                                                                size={15}
                                                            />
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="admin-reset"
                                                        type="button"
                                                        disabled={
                                                            updatingId ===
                                                            application._id
                                                        }
                                                        onClick={() =>
                                                            updateStatus(
                                                                application._id,
                                                                "pending"
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            name="refresh"
                                                            size={15}
                                                        />
                                                        Move to Pending
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
            </section>

            {selectedApplication && (
                <div
                    className="application-review-overlay"
                    onClick={closeReview}
                >
                    <div
                        className="application-review-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="application-review-header">
                            <div>
                                <span>
                                    APPLICATION REVIEW
                                </span>

                                <h2>
                                    Application Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="application-review-close"
                                onClick={closeReview}
                            >
                                <Icon
                                    name="close"
                                    size={20}
                                />
                            </button>
                        </div>

                        <div className="application-review-body">
                            <section className="review-section">
                                <div className="review-section-title">
                                    <Icon
                                        name="student"
                                        size={18}
                                    />

                                    <h3>
                                        Student Information
                                    </h3>
                                </div>

                                <div className="review-grid">
                                    <div>
                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {selectedApplication
                                                .student
                                                ?.name ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>

                                        <strong>
                                            {selectedApplication
                                                .student
                                                ?.email ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Student GPA
                                        </span>

                                        <strong>
                                            {selectedApplication
                                                .student
                                                ?.gpa ??
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Application Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedApplication.appliedAt ||
                                                    selectedApplication.createdAt
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="review-section">
                                <div className="review-section-title">
                                    <Icon
                                        name="scholarship"
                                        size={18}
                                    />

                                    <h3>
                                        Scholarship Information
                                    </h3>
                                </div>

                                <div className="review-grid">
                                    <div>
                                        <span>
                                            Scholarship
                                        </span>

                                        <strong>
                                            {selectedApplication
                                                .scholarship
                                                ?.title ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Award Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {selectedApplication
                                                .scholarship
                                                ?.amount
                                                ? Number(
                                                      selectedApplication
                                                          .scholarship
                                                          .amount
                                                  ).toLocaleString(
                                                      "en-IN"
                                                  )
                                                : "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Minimum GPA
                                        </span>

                                        <strong>
                                            {selectedApplication
                                                .scholarship
                                                ?.minGpa ??
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Deadline
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedApplication
                                                    .scholarship
                                                    ?.deadline
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="review-section">
                                <div className="review-section-title">
                                    <Icon
                                        name="document"
                                        size={18}
                                    />

                                    <h3>
                                        Supporting Document
                                    </h3>
                                </div>

                                {selectedApplication.document ? (
                                    <>
                                        <div className="document-toolbar">
                                            <div>
                                                <strong>
                                                    {
                                                        selectedApplication
                                                            .document
                                                            .filename
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        selectedApplication
                                                            .document
                                                            .mimetype
                                                    }
                                                </span>
                                            </div>

                                            {getDocumentUrl(
                                                selectedApplication
                                            ) && (
                                                <a
                                                    href={getDocumentUrl(
                                                        selectedApplication
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="document-open-button"
                                                >
                                                    <Icon
                                                        name="external"
                                                        size={16}
                                                    />
                                                    Open in New Tab
                                                </a>
                                            )}
                                        </div>

                                        <div className="document-preview">
                                            {getDocumentType(
                                                selectedApplication
                                            ) === "pdf" && (
                                                <iframe
                                                    src={getDocumentUrl(
                                                        selectedApplication
                                                    )}
                                                    title="Supporting document preview"
                                                />
                                            )}

                                            {getDocumentType(
                                                selectedApplication
                                            ) === "image" && (
                                                <img
                                                    src={getDocumentUrl(
                                                        selectedApplication
                                                    )}
                                                    alt="Supporting document"
                                                />
                                            )}

                                            {getDocumentType(
                                                selectedApplication
                                            ) === "other" && (
                                                <div className="document-no-preview">
                                                    <Icon
                                                        name="document"
                                                        size={35}
                                                    />

                                                    <h3>
                                                        Preview
                                                        unavailable
                                                    </h3>

                                                    <p>
                                                        This file type
                                                        cannot be previewed
                                                        inside the dashboard.
                                                    </p>

                                                    <a
                                                        href={getDocumentUrl(
                                                            selectedApplication
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="document-open-button"
                                                    >
                                                        Open Document
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="document-no-preview">
                                        <Icon
                                            name="document"
                                            size={30}
                                        />

                                        <h3>
                                            No document available
                                        </h3>

                                        <p>
                                            This application does not
                                            contain a supporting document.
                                        </p>
                                    </div>
                                )}
                            </section>

                            <section className="review-decision">
                                <div>
                                    <span>
                                        CURRENT STATUS
                                    </span>

                                    <strong
                                        className={getStatusClass(
                                            selectedApplication.status
                                        )}
                                    >
                                        {formatStatus(
                                            selectedApplication.status
                                        )}
                                    </strong>
                                </div>

                                <div className="review-decision-actions">
                                    <button
                                        className="admin-approve"
                                        type="button"
                                        disabled={
                                            updatingId ===
                                            selectedApplication._id
                                        }
                                        onClick={() =>
                                            updateStatus(
                                                selectedApplication._id,
                                                "approved"
                                            )
                                        }
                                    >
                                        <Icon
                                            name="check"
                                            size={16}
                                        />
                                        Approve Application
                                    </button>

                                    <button
                                        className="admin-reject"
                                        type="button"
                                        disabled={
                                            updatingId ===
                                            selectedApplication._id
                                        }
                                        onClick={() =>
                                            updateStatus(
                                                selectedApplication._id,
                                                "rejected"
                                            )
                                        }
                                    >
                                        <Icon
                                            name="close"
                                            size={16}
                                        />
                                        Reject Application
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminDashboard;