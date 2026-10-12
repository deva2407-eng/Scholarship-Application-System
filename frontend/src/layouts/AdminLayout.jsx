import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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

        scholarship: (
            <>
                <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
                <path d="M6 11.5V16c3.5 2.5 8.5 2.5 12 0v-4.5" />
                <path d="M21 10v5" />
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

        logout: (
            <>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 3v18" />
            </>
        )
    };

    return <svg {...common}>{icons[name]}</svg>;
}

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <div className="admin-brand-icon">
                        <Icon name="scholarship" size={23} />
                    </div>

                    <div>
                        <h2>ScholarHub</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <nav className="admin-sidebar-nav">
                    <p className="admin-nav-label">MANAGEMENT</p>

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <Icon name="dashboard" size={19} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/scholarships"
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <Icon name="scholarship" size={19} />
                        <span>Scholarships</span>
                    </NavLink>

                    <NavLink
                        to="/admin/applications"
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <Icon name="applications" size={19} />
                        <span>Applications</span>
                    </NavLink>
                </nav>

                <div className="admin-sidebar-bottom">
                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        <Icon name="logout" size={19} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;