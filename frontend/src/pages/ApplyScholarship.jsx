import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";

function Icon({ name, size = 18 }) {

    const paths = {

        back: (
            <>
                <path d="m15 18-6-6 6-6" />
            </>
        ),

        file: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8M8 17h6" />
            </>
        ),

        upload: (
            <>
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M5 20h14" />
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


function ApplyScholarship() {

    const [searchParams] =
        useSearchParams();

    const scholarshipId =
        searchParams.get("id");


    const [scholarship, setScholarship] =
        useState(null);

    const [file, setFile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    useEffect(() => {

        const token =
            localStorage.getItem("token");


        const loadScholarship = async () => {

            if (!scholarshipId) {

                setError(
                    "No scholarship was selected."
                );

                setLoading(false);

                return;
            }


            try {

                const response =
                    await fetch(
                        `https://scholarship-application-system-lern.onrender.com/api/scholarships/${scholarshipId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load scholarship."
                    );

                }


                setScholarship(data.scholarship);


            } catch (err) {

                setError(
                    err.message ||
                    "Unable to load scholarship."
                );

            } finally {

                setLoading(false);

            }

        };


        loadScholarship();

    }, [scholarshipId]);


    const handleSubmit =
        async (event) => {

            event.preventDefault();


            if (!file) {

                setError(
                    "Please select a PDF, JPG, or PNG document."
                );

                return;
            }


            if (file.size > 5 * 1024 * 1024) {

                setError(
                    "File size must be 5 MB or smaller."
                );

                return;
            }


            setSubmitting(true);

            setError("");

            setMessage("");


            try {

                const formData =
                    new FormData();

                formData.append(
                    "document",
                    file
                );


                const response =
                    await fetch(
                        `https://scholarship-application-system-lern.onrender.com/api/scholarships/${scholarshipId}/apply`,
                        {
                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${localStorage.getItem("token")}`
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Application failed."
                    );

                }


                setMessage(
                    "Application submitted successfully. Your status is now pending."
                );

                setFile(null);


            } catch (err) {

                setError(
                    err.message ||
                    "Application failed."
                );

            } finally {

                setSubmitting(false);

            }

        };


    if (loading) {

        return (
            <div className="apply-page">

                <div className="apply-card">

                    <p>
                        Loading scholarship...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="apply-page">

            <div className="apply-card">

                <Link
                    className="applications-back"
                    to="/scholarships"
                >

                    <Icon
                        name="back"
                        size={15}
                    />

                    {" "}
                    Back to scholarships

                </Link>


                {error && (
                    <div className="scholarship-error">
                        {error}
                    </div>
                )}


                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}


                {scholarship && (

                    <>

                        <div className="apply-header">

                            <p className="dashboard-label">
                                APPLICATION
                            </p>

                            <h1>
                                Apply for scholarship
                            </h1>

                            <h2>
                                {scholarship.title}
                            </h2>

                        </div>


                        <div className="apply-details">

                            <div>
                                <strong>
                                    Award amount
                                </strong>

                                <span>
                                    ₹
                                    {Number(
                                        scholarship.amount || 0
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>


                            <div>
                                <strong>
                                    Minimum GPA
                                </strong>

                                <span>
                                    {scholarship.minGpa}
                                </span>
                            </div>


                            <div>
                                <strong>
                                    Deadline
                                </strong>

                                <span>
                                    {new Date(
                                        scholarship.deadline
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )}
                                </span>
                            </div>


                            <div>
                                <strong>
                                    Status
                                </strong>

                                <span>
                                    {scholarship.status}
                                </span>
                            </div>

                        </div>


                        <div className="application-info">

                            <h3>
                                Eligibility
                            </h3>

                            <p>
                                {scholarship.eligibility}
                            </p>

                        </div>


                        <form
                            className="application-form"
                            onSubmit={handleSubmit}
                        >

                            <label htmlFor="document">
                                Supporting document
                            </label>


                            <input
                                id="document"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                    setFile(
                                        event.target.files?.[0] ||
                                        null
                                    )
                                }
                                required
                            />


                            {file && (

                                <p className="selected-file">

                                    <Icon
                                        name="file"
                                        size={15}
                                    />

                                    {" "}
                                    {file.name}

                                </p>

                            )}


                            <small>
                                Accepted: PDF, JPG, PNG.
                                Maximum file size: 5 MB.
                            </small>


                            <button
                                className="submit-button"
                                type="submit"
                                disabled={
                                    submitting ||
                                    scholarship.status !== "open"
                                }
                            >

                                <Icon
                                    name="upload"
                                    size={17}
                                />

                                {submitting
                                    ? "Submitting..."
                                    : "Submit application"}

                            </button>

                        </form>

                    </>

                )}

            </div>

        </div>
    );
}


export default ApplyScholarship;