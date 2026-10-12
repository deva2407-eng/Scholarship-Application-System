import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role
    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/student" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;