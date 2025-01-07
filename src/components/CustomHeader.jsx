import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import your thunk to fetch the student profile
import { getStudentProfile } from "../features/studentPortal/studentProfileSlice";

const CustomHeader = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Grab the student info from Redux store
    const { student, loading, error } = useSelector((state) => state.studentProfile);

    // Fetch student profile on mount if it doesn't exist
    useEffect(() => {
        // If you haven't fetched it yet, or want to ensure it's always up to date:
        if (!student) {
            dispatch(getStudentProfile());
        }
    }, [student, dispatch]);

    const handleLogout = () => {
        // Clear user information from localStorage if you are still using it
        localStorage.removeItem("studentInfo");
        // Redirect to login page
        navigate("/login");
    };

    // Safely handle name and image
    const name = student?.name || "Student Dashboard";
    const imageUrl = student?.imageUrl || "https://via.placeholder.com/150";

    return (
        <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg py-4 px-6 fixed top-0 left-0 w-full z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Student Name / Dashboard Link */}
                <h1 className="text-3xl font-extrabold cursor-pointer">
                    <Link to="/dashboard">{name}</Link>
                </h1>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-6">
                    <p
                        onClick={() => navigate("/dashboard")}
                        className="cursor-pointer text-white font-medium hover:text-yellow-300 transition duration-300"
                    >
                        Dashboard
                    </p>

                    <p
                        onClick={() => navigate("/problems")}
                        className="cursor-pointer text-white font-medium hover:text-yellow-300 transition duration-300"
                    >
                        Problems
                    </p>


                    {/* Profile and Logout Dropdown */}
                    <div className="relative">
                        {/* Display the student’s profile image from the slice */}
                        <div
                            className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <img
                                src={imageUrl}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {dropdownVisible && (
                            <div className="absolute right-0 mt-2 w-48 text-black bg-white border rounded-lg shadow-lg">
                                <ul className="py-2">
                                    <li
                                        onClick={() => {
                                            navigate("/profile");
                                            setDropdownVisible(false);
                                        }}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Profile
                                    </li>
                                    <li
                                        onClick={handleLogout}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default CustomHeader;
