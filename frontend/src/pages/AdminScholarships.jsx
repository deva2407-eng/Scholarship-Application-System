import { useEffect, useState } from "react";

function Icon({ name, size = 18 }) {
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
        scholarship: (
            <svg {...common}>
                <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
                <path d="M6 11.5V17c3 2 9 2 12 0v-5.5" />
                <path d="M21 10v6" />
            </svg>
        ),

        plus: (
            <svg {...common}>
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </svg>
        ),

        close: (
            <svg {...common}>
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
            </svg>
        ),

        edit: (
            <svg {...common}>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
            </svg>
        ),

        trash: (
            <svg {...common}>
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
            </svg>
        ),

        refresh: (
            <svg {...common}>
                <path d="M20 11a8 8 0 0 0-14.9-4" />
                <path d="M4 4v5h5" />
                <path d="M4 13a8 8 0 0 0 14.9 4" />
                <path d="M20 20v-5h-5" />
            </svg>
        ),

        image: (
            <svg {...common}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9" r="1.5" />
                <path d="m21 15-5-5L5 20" />
            </svg>
        ),

        building: (
            <svg {...common}>
                <path d="M3 21h18" />
                <path d="M5 21V5l7-3 7 3v16" />
                <path d="M9 9h1" />
                <path d="M14 9h1" />
                <path d="M9 13h1" />
                <path d="M14 13h1" />
                <path d="M10 21v-4h4v4" />
            </svg>
        ),

        tag: (
            <svg {...common}>
                <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
                <circle cx="8" cy="8" r="1" />
            </svg>
        ),

        document: (
            <svg {...common}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h6" />
            </svg>
        ),

        rupee: (
            <svg {...common}>
                <path d="M6 5h12" />
                <path d="M6 9h9" />
                <path d="M8 5c4 0 6 2 6 5s-2 5-6 5l8 5" />
            </svg>
        ),

        calendar: (
            <svg {...common}>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 9h18" />
            </svg>
        )
    };

    return icons[name] || null;
}

function AdminScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        title: "",
        provider: "",
        imageUrl: "",
        category: "Academic",
        description: "",
        amount: "",
        eligibility: "",
        minGpa: "",
        deadline: "",
        requiredDocuments: "",
        applicationInstructions: "",
        status: "open"
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
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

            setScholarships(
                Array.isArray(data.scholarships)
                    ? data.scholarships
                    : []
            );

        } catch (error) {
            console.error(
                "Admin scholarships error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    };

    const openCreateForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError("");
    };

    const openEditForm = (scholarship) => {
        setEditingId(scholarship._id);

        setForm({
            title: scholarship.title || "",
            provider: scholarship.provider || "",
            imageUrl: scholarship.imageUrl || "",
            category: scholarship.category || "Academic",
            description: scholarship.description || "",
            amount: scholarship.amount ?? "",
            eligibility: scholarship.eligibility || "",
            minGpa: scholarship.minGpa ?? "",
            deadline: scholarship.deadline
                ? scholarship.deadline.split("T")[0]
                : "",
            requiredDocuments: Array.isArray(
                scholarship.requiredDocuments
            )
                ? scholarship.requiredDocuments.join(", ")
                : "",
            applicationInstructions:
                scholarship.applicationInstructions || "",
            status: scholarship.status || "open"
        });

        setShowForm(true);
        setError("");
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            const requiredDocuments = form.requiredDocuments
                .split(",")
                .map((document) => document.trim())
                .filter(Boolean);

            const payload = {
                title: form.title.trim(),
                provider: form.provider.trim(),
                imageUrl: form.imageUrl.trim(),
                category: form.category.trim(),
                description: form.description.trim(),
                amount: Number(form.amount),
                eligibility: form.eligibility.trim(),
                minGpa: Number(form.minGpa),
                deadline: form.deadline,
                requiredDocuments,
                applicationInstructions:
                    form.applicationInstructions.trim(),
                status: form.status
            };

            const url = editingId
                ? `https://scholarship-application-system-lern.onrender.com/api/scholarships/${editingId}`
                : "https://scholarship-application-system-lern.onrender.com/api/scholarships";

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to save scholarship."
                );
                return;
            }

            closeForm();
            await fetchScholarships();

        } catch (error) {
            console.error(
                "Save scholarship error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setSaving(false);
        }
    };

    const deleteScholarship = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this scholarship?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://scholarship-application-system-lern.onrender.com/api/scholarships/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to delete scholarship."
                );
                return;
            }

            setScholarships((currentScholarships) =>
                currentScholarships.filter(
                    (scholarship) =>
                        scholarship._id !== id
                )
            );

        } catch (error) {
            console.error(
                "Delete scholarship error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    };

    const formatDeadline = (deadline) => {
        if (!deadline) {
            return "—";
        }

        return new Date(deadline).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div className="admin-scholarships-page">

            <header className="admin-scholarships-header">

                <div>
                    <p className="dashboard-label">
                        SCHOLARSHIP MANAGEMENT
                    </p>

                    <h1>
                        Scholarships
                    </h1>

                    <p>
                        Create and manage scholarship
                        opportunities for students.
                    </p>
                </div>

                <button
                    className="create-scholarship-button"
                    onClick={openCreateForm}
                >
                    <Icon name="plus" size={17} />
                    Create Scholarship
                </button>

            </header>


            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {showForm && (
                <section className="scholarship-form-card">

                    <div className="scholarship-form-header">

                        <div>
                            <span className="section-label">
                                {editingId
                                    ? "EDIT SCHOLARSHIP"
                                    : "NEW SCHOLARSHIP"}
                            </span>

                            <h2>
                                {editingId
                                    ? "Edit Scholarship"
                                    : "Create Scholarship"}
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="close-form-button"
                            onClick={closeForm}
                            aria-label="Close form"
                        >
                            <Icon name="close" size={19} />
                        </button>

                    </div>


                    <form
                        className="scholarship-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-field">

                            <label>
                                Scholarship Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Academic Excellence Scholarship"
                                required
                            />

                        </div>


                        <div className="form-grid">

                            <div className="form-field">

                                <label>
                                    Provider / Organization
                                </label>

                                <input
                                    type="text"
                                    name="provider"
                                    value={form.provider}
                                    onChange={handleChange}
                                    placeholder="e.g. Reliance Foundation"
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    <option value="Academic">
                                        Academic
                                    </option>

                                    <option value="Merit">
                                        Merit
                                    </option>

                                    <option value="Financial Aid">
                                        Financial Aid
                                    </option>

                                    <option value="Research">
                                        Research
                                    </option>

                                    <option value="Sports">
                                        Sports
                                    </option>

                                    <option value="Technology">
                                        Technology
                                    </option>

                                    <option value="Women">
                                        Women
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="form-field">

                            <label>
                                Scholarship Image URL
                            </label>

                            <input
                                type="url"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/scholarship-image.jpg"
                            />

                            <small className="form-help">
                                Add a public image URL. The image
                                will appear on the student scholarship
                                page.
                            </small>

                        </div>


                        {form.imageUrl && (
                            <div className="scholarship-image-preview">

                                <img
                                    src={form.imageUrl}
                                    alt="Scholarship preview"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            </div>
                        )}


                        <div className="form-field">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe what this scholarship provides and who it is intended for..."
                                rows="4"
                                required
                            />

                        </div>


                        <div className="form-grid">

                            <div className="form-field">

                                <label>
                                    Award Amount (₹)
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="75000"
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Minimum GPA
                                </label>

                                <input
                                    type="number"
                                    name="minGpa"
                                    value={form.minGpa}
                                    onChange={handleChange}
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="8.0"
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Application Deadline
                                </label>

                                <input
                                    type="date"
                                    name="deadline"
                                    value={form.deadline}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="open">
                                        Open
                                    </option>

                                    <option value="closed">
                                        Closed
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="form-field">

                            <label>
                                Eligibility Criteria
                            </label>

                            <textarea
                                name="eligibility"
                                value={form.eligibility}
                                onChange={handleChange}
                                placeholder="Students with CGPA above 8.0, enrolled in an undergraduate program..."
                                rows="3"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Required Documents
                            </label>

                            <input
                                type="text"
                                name="requiredDocuments"
                                value={form.requiredDocuments}
                                onChange={handleChange}
                                placeholder="Marksheet, ID Proof, Income Certificate"
                            />

                            <small className="form-help">
                                Separate multiple documents with commas.
                            </small>

                        </div>


                        <div className="form-field">

                            <label>
                                Application Instructions
                            </label>

                            <textarea
                                name="applicationInstructions"
                                value={form.applicationInstructions}
                                onChange={handleChange}
                                placeholder="Upload the required documents and submit the application before the deadline..."
                                rows="4"
                            />

                        </div>


                        <div className="scholarship-form-actions">

                            <button
                                type="button"
                                className="cancel-scholarship-button"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-scholarship-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Scholarship"
                                    : "Create Scholarship"}
                            </button>

                        </div>

                    </form>

                </section>
            )}


            <section className="admin-scholarship-list">

                <div className="admin-scholarship-list-header">

                    <div>
                        <span className="section-label">
                            ALL OPPORTUNITIES
                        </span>

                        <h2>
                            {scholarships.length} Scholarships
                        </h2>
                    </div>

                    <button
                        className="admin-refresh"
                        onClick={fetchScholarships}
                    >
                        <Icon name="refresh" size={16} />
                        Refresh
                    </button>

                </div>


                {loading && (
                    <div className="admin-state">

                        <div className="admin-state-icon">
                            <Icon
                                name="scholarship"
                                size={25}
                            />
                        </div>

                        <h2>
                            Loading scholarships...
                        </h2>

                    </div>
                )}


                {!loading &&
                    scholarships.length === 0 && (
                        <div className="admin-state">

                            <div className="admin-state-icon">
                                <Icon
                                    name="scholarship"
                                    size={25}
                                />
                            </div>

                            <h2>
                                No scholarships found
                            </h2>

                            <p>
                                Create your first scholarship
                                opportunity.
                            </p>

                        </div>
                    )}


                {!loading &&
                    scholarships.length > 0 && (

                        <div className="admin-scholarship-grid">

                            {scholarships.map(
                                (scholarship) => (

                                    <article
                                        className="admin-scholarship-card"
                                        key={scholarship._id}
                                    >

                                        {scholarship.imageUrl && (
                                            <div className="admin-scholarship-image">

                                                <img
                                                    src={
                                                        scholarship.imageUrl
                                                    }
                                                    alt={
                                                        scholarship.title
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            </div>
                                        )}


                                        <div className="admin-scholarship-top">

                                            <div className="admin-scholarship-icon">
                                                <Icon
                                                    name="scholarship"
                                                    size={22}
                                                />
                                            </div>

                                            <span
                                                className={
                                                    scholarship.status ===
                                                    "open"
                                                        ? "scholarship-open"
                                                        : "scholarship-closed"
                                                }
                                            >
                                                {scholarship.status}
                                            </span>

                                        </div>


                                        <div className="admin-scholarship-category">

                                            <Icon
                                                name="tag"
                                                size={13}
                                            />

                                            {scholarship.category ||
                                                "Academic"}

                                        </div>


                                        <h3>
                                            {scholarship.title}
                                        </h3>


                                        <div className="admin-scholarship-provider">

                                            <Icon
                                                name="building"
                                                size={14}
                                            />

                                            <span>
                                                {scholarship.provider ||
                                                    "Provider not specified"}
                                            </span>

                                        </div>


                                        <p className="admin-scholarship-description">
                                            {scholarship.description}
                                        </p>


                                        <div className="admin-scholarship-details">

                                            <div>

                                                <span>
                                                    <Icon
                                                        name="rupee"
                                                        size={13}
                                                    />
                                                    AMOUNT
                                                </span>

                                                <strong>
                                                    ₹
                                                    {scholarship.amount?.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    MIN GPA
                                                </span>

                                                <strong>
                                                    {scholarship.minGpa}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    <Icon
                                                        name="calendar"
                                                        size={13}
                                                    />
                                                    DEADLINE
                                                </span>

                                                <strong>
                                                    {formatDeadline(
                                                        scholarship.deadline
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="admin-eligibility">

                                            <span>
                                                ELIGIBILITY
                                            </span>

                                            <p>
                                                {scholarship.eligibility}
                                            </p>

                                        </div>


                                        {Array.isArray(
                                            scholarship.requiredDocuments
                                        ) &&
                                            scholarship
                                                .requiredDocuments
                                                .length > 0 && (

                                                <div className="admin-required-documents">

                                                    <span>
                                                        REQUIRED DOCUMENTS
                                                    </span>

                                                    <div>

                                                        {scholarship.requiredDocuments.map(
                                                            (
                                                                document,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        `${scholarship._id}-document-${index}`
                                                                    }
                                                                >
                                                                    <Icon
                                                                        name="document"
                                                                        size={12}
                                                                    />

                                                                    {
                                                                        document
                                                                    }
                                                                </span>
                                                            )
                                                        )}

                                                    </div>

                                                </div>
                                            )}


                                        {scholarship.applicationInstructions && (
                                            <div className="admin-application-instructions">

                                                <span>
                                                    APPLICATION INSTRUCTIONS
                                                </span>

                                                <p>
                                                    {
                                                        scholarship.applicationInstructions
                                                    }
                                                </p>

                                            </div>
                                        )}


                                        <div className="admin-scholarship-actions">

                                            <button
                                                className="edit-scholarship-button"
                                                onClick={() =>
                                                    openEditForm(
                                                        scholarship
                                                    )
                                                }
                                            >
                                                <Icon
                                                    name="edit"
                                                    size={15}
                                                />
                                                Edit
                                            </button>

                                            <button
                                                className="delete-scholarship-button"
                                                onClick={() =>
                                                    deleteScholarship(
                                                        scholarship._id
                                                    )
                                                }
                                            >
                                                <Icon
                                                    name="trash"
                                                    size={15}
                                                />
                                                Delete
                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </section>

        </div>
    );
}

export default AdminScholarships;