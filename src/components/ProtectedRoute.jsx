import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // read from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
        // not logged in
        return <Navigate to="/login" replace />;
    }

    // or if userInfo.role !== "student", 
    // you might do additional checks for student role
    return children;
}

export default ProtectedRoute;
