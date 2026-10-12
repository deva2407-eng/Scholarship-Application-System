import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5001/api";
const SERVER_BASE_URL = "http://localhost:5001";

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
        applications: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
            </>
        ),

        student: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
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

        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
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

function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    const token = localStorage.getItem("token");

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

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
                    data.message || "Failed to fetch applications."
                );
            }

            setApplications(
                Array.isArray(data.applications)
                    ? data.applications
                    : []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update application."
                );
            }

            setApplications((current) =>
                current.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status: data.application?.status || status
                          }
                        : application
                )
            );

            setSelectedApplication((current) =>
                current && current._id === applicationId
                    ? {
                          ...current,
                          status: data.application?.status || status
                      }
                    : current
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId("");
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getDocumentUrl = (application) => {
        if (!application?.document?.path) {
            return "";
        }

        const cleanPath = application.document.path
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");

        return `${SERVER_BASE_URL}/${cleanPath}`;
    };

    const getStatusClass = (status) => {
        if (status === "approved") {
            return "admin-application-status approved";
        }

        if (status === "rejected") {
            return "admin-application-status rejected";
        }

        return "admin-application-status pending";
    };

    return (
        <div className="admin-applications-page">
            <div className="admin-applications-header">
                <div>
                    <div className="admin-applications-title-row">
                        <span className="admin-applications-title-icon">
                            <Icon name="applications" size={24} />
                        </span>

                        <div>
                            <h1>Applications</h1>
                            <p>
                                Review scholarship applications and manage
                                their status.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-refresh-button"
                    onClick={fetchApplications}
                    disabled={loading}
                >
                    <Icon name="refresh" size={17} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="admin-application-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-application-empty">
                    <Icon name="refresh" size={28} />
                    <h3>Loading applications...</h3>
                    <p>Please wait while applications are loaded.</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="admin-application-empty">
                    <Icon name="applications" size={32} />
                    <h3>No applications yet</h3>
                    <p>
                        Student scholarship applications will appear here.
                    </p>
                </div>
            ) : (
                <div className="admin-application-list">
                    {applications.map((application) => {
                        const student = application.student || {};
                        const scholarship =
                            application.scholarship || {};

                        return (
                            <div
                                className="admin-application-card"
                                key={application._id}
                            >
                                <div className="admin-application-card-top">
                                    <div className="admin-application-student">
                                        <div className="admin-student-avatar">
                                            <Icon name="student" size={21} />
                                        </div>

                                        <div>
                                            <h2>
                                                {student.name ||
                                                    "Unknown Student"}
                                            </h2>

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
                                        {application.status}
                                    </span>
                                </div>

                                <div className="admin-application-info-grid">
                                    <div className="admin-application-info">
                                        <span className="admin-info-icon">
                                            <Icon
                                                name="scholarship"
                                                size={17}
                                            />
                                        </span>

                                        <div>
                                            <small>Scholarship</small>
                                            <strong>
                                                {scholarship.title ||
                                                    "Not available"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-application-info">
                                        <span className="admin-info-icon">
                                            <Icon
                                                name="student"
                                                size={17}
                                            />
                                        </span>

                                        <div>
                                            <small>Student GPA</small>
                                            <strong>
                                                {student.gpa ?? "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-application-info">
                                        <span className="admin-info-icon">
                                            <Icon
                                                name="calendar"
                                                size={17}
                                            />
                                        </span>

                                        <div>
                                            <small>Applied On</small>
                                            <strong>
                                                {formatDate(
                                                    application.appliedAt ||
                                                        application.createdAt
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-application-info">
                                        <span className="admin-info-icon">
                                            <Icon
                                                name="document"
                                                size={17}
                                            />
                                        </span>

                                        <div>
                                            <small>Document</small>
                                            <strong>
                                                {application.document
                                                    ?.filename ||
                                                    "Not available"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-application-actions">
                                    <button
                                        type="button"
                                        className="admin-view-button"
                                        onClick={() =>
                                            setSelectedApplication(
                                                application
                                            )
                                        }
                                    >
                                        <Icon name="eye" size={17} />
                                        Review
                                    </button>

                                    <a
                                        className="admin-contact-button"
                                        href={`mailto:${
                                            student.email || ""
                                        }`}
                                    >
                                        <Icon name="mail" size={17} />
                                        Contact
                                    </a>

                                    {application.status !== "approved" && (
                                        <button
                                            type="button"
                                            className="admin-approve-button"
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
                                            <Icon name="check" size={17} />
                                            Approve
                                        </button>
                                    )}

                                    {application.status !== "rejected" && (
                                        <button
                                            type="button"
                                            className="admin-reject-button"
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
                                            <Icon name="close" size={17} />
                                            Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedApplication && (
                <div
                    className="admin-application-modal-overlay"
                    onClick={() => setSelectedApplication(null)}
                >
                    <div
                        className="admin-application-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-application-modal-header">
                            <div>
                                <span className="admin-modal-label">
                                    APPLICATION REVIEW
                                </span>

                                <h2>Application Details</h2>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() =>
                                    setSelectedApplication(null)
                                }
                            >
                                <Icon name="close" size={20} />
                            </button>
                        </div>

                        <div className="admin-modal-content">
                            <section className="admin-modal-section">
                                <h3>
                                    <Icon name="student" size={18} />
                                    Student Details
                                </h3>

                                <div className="admin-modal-detail-grid">
                                    <div>
                                        <span>Name</span>
                                        <strong>
                                            {selectedApplication.student
                                                ?.name ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {selectedApplication.student
                                                ?.email ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>GPA</span>
                                        <strong>
                                            {selectedApplication.student
                                                ?.gpa ?? "N/A"}
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="admin-modal-section">
                                <h3>
                                    <Icon
                                        name="scholarship"
                                        size={18}
                                    />
                                    Scholarship Details
                                </h3>

                                <div className="admin-modal-detail-grid">
                                    <div>
                                        <span>Scholarship</span>
                                        <strong>
                                            {selectedApplication
                                                .scholarship?.title ||
                                                "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Amount</span>
                                        <strong>
                                            ₹
                                            {Number(
                                                selectedApplication
                                                    .scholarship?.amount || 0
                                            ).toLocaleString("en-IN")}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Minimum GPA</span>
                                        <strong>
                                            {selectedApplication
                                                .scholarship?.minGpa ??
                                                "N/A"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Deadline</span>
                                        <strong>
                                            {formatDate(
                                                selectedApplication
                                                    .scholarship?.deadline
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="admin-modal-section">
                                <h3>
                                    <Icon name="document" size={18} />
                                    Supporting Document
                                </h3>

                                {selectedApplication.document ? (
                                    <div className="admin-document-box">
                                        <div>
                                            <strong>
                                                {
                                                    selectedApplication
                                                        .document.filename
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    selectedApplication
                                                        .document.mimetype
                                                }
                                            </span>
                                        </div>

                                        {getDocumentUrl(
                                            selectedApplication
                                        ) ? (
                                            <a
                                                href={getDocumentUrl(
                                                    selectedApplication
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="admin-document-button"
                                            >
                                                <Icon
                                                    name="eye"
                                                    size={17}
                                                />
                                                View Document
                                            </a>
                                        ) : (
                                            <span>
                                                Document unavailable
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="admin-no-document">
                                        No supporting document was uploaded.
                                    </p>
                                )}
                            </section>

                            <section className="admin-modal-status-section">
                                <div>
                                    <span>Current Status</span>
                                    <strong
                                        className={getStatusClass(
                                            selectedApplication.status
                                        )}
                                    >
                                        {selectedApplication.status}
                                    </strong>
                                </div>

                                <div className="admin-modal-status-actions">
                                    <button
                                        type="button"
                                        className="admin-approve-button"
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
                                        <Icon name="check" size={17} />
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-reject-button"
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
                                        <Icon name="close" size={17} />
                                        Reject
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminApplications;