import { Link, Outlet, useLocation } from "react-router-dom";

function StudentLayout() {
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "sidebar-link active"
            : "sidebar-link";
    };

    return (
        <div className="student-layout">

            {/* SIDEBAR */}

            <aside className="student-sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        🎓
                    </div>

                    <div>
                        <h2>
                            ScholarHub
                        </h2>

                        <span>
                            Student Portal
                        </span>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/student"
                        className={isActive("/student")}
                    >
                        <span>▣</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/scholarships"
                        className={isActive("/scholarships")}
                    >
                        <span>🎓</span>
                        Scholarships
                    </Link>

                    <Link
                        to="/apply"
                        className={isActive("/apply")}
                    >
                        <span>📝</span>
                        Apply
                    </Link>

                    <Link
                        to="/applications"
                        className={isActive("/applications")}
                    >
                        <span>📋</span>
                        My Applications
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                        </div>

                        <div>
                            <strong>
                                {user?.name ||
                                    "Student"}
                            </strong>

                            <span>
                                {user?.email ||
                                    "student@example.com"}
                            </span>
                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* PAGE CONTENT */}

            <main className="student-main">
                <Outlet />
            </main>

        </div>
    );
}

export default StudentLayout;