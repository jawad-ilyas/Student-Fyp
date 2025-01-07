import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo")); // Retrieve user info from localStorage

    // Check if user is logged in
    if (!studentInfo || !studentInfo.token) {
        return <Navigate to="/login" />;
    }



    // If authenticated and has "admin" role, render the child component
    return children;
};

export default ProtectedRoute;
