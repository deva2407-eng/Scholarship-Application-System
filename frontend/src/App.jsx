import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import Scholarships from "./pages/Scholarships";
import ApplyScholarship from "./pages/ApplyScholarship";
import MyApplications from "./pages/MyApplications";
import AdminApplications from "./pages/AdminApplications";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/AdminDashboard";
import AdminScholarships from "./pages/AdminScholarships";

import StudentLayout from "./layouts/StudentLayout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ========================= */}
                {/* PUBLIC ROUTES */}
                {/* ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                 <Route
                 path="/admin-login"
                  element={<AdminLogin />}
                  />


                {/* ========================= */}
                {/* STUDENT ROUTES */}
                {/* ========================= */}

                <Route element={<ProtectedRoute allowedRole="student" />}>

                    <Route element={<StudentLayout />}>

                        <Route
                            path="/student"
                            element={<StudentDashboard />}
                        />

                        <Route
                            path="/scholarships"
                            element={<Scholarships />}
                        />

                        <Route
                            path="/apply"
                            element={<ApplyScholarship />}
                        />

                        <Route
                            path="/applications"
                            element={<MyApplications />}
                        />

                    </Route>

                </Route>


                {/* ========================= */}
                {/* ADMIN ROUTES */}
                {/* ========================= */}
                <Route element={<ProtectedRoute allowedRole="admin" />}>

    <Route element={<AdminLayout />}>

        <Route
            path="/admin"
            element={<AdminDashboard />}
        />

        <Route
            path="/admin/scholarships"
            element={<AdminScholarships />}
        />

        <Route
            path="/admin/applications"
            element={<AdminApplications />}
        />

    </Route>

</Route>


                {/* ========================= */}
                {/* DEFAULT ROUTE */}
                {/* ========================= */}

                <Route
                    path="*"
                    element={<RoleRedirect />}
                />

            </Routes>
        </BrowserRouter>
    );
}


/*
    Sends an already logged-in user
    to the correct portal.
*/

function RoleRedirect() {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role === "admin") {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/student"
            replace
        />
    );
}

export default App;