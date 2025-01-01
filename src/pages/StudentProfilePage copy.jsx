import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentProfile, clearStudentProfile } from "../features/studentPortal/studentProfileSlice";

function StudentProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { student, loading, error } = useSelector((state) => state.studentProfile);

    // Fetch student profile on component mount
    useEffect(() => {
        dispatch(getStudentProfile());
        return () => {
            dispatch(clearStudentProfile()); // Clean up state when component unmounts
        };
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
                <p className="text-green-400 animate-pulse">Loading student profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
                <p className="text-red-400">Error: {error}</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
                <p className="text-red-400">Student data not available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-500 via-green-400 to-green-500 shadow-lg">
                <div className="absolute inset-0 bg-opacity-50 bg-gray-900"></div>
                <div className="relative px-6 py-12 text-center">
                    <img
                        src={student.imageUrl || "/images/default.jpg"}
                        alt="Profile"
                        className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-md"
                    />
                    <h1 className="text-3xl font-bold text-white mt-4">{student.name || "N/A"}</h1>
                    <p className="text-gray-200">{student.email}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-4 py-2 bg-white text-green-500 rounded-lg hover:bg-gray-200 transition"
                    >
                        &larr; Back
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-8 bg-gray-800 mt-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-green-400 mb-4">Problem Solving Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                        { label: "Total Solved", value: student.totalSolved, icon: "✔️", color: "text-green-400" },
                        { label: "Easy", value: student.easyCount, icon: "🟢", color: "text-yellow-400" },
                        { label: "Medium", value: student.mediumCount, icon: "🟠", color: "text-blue-400" },
                        { label: "Hard", value: student.hardCount, icon: "🔴", color: "text-red-400" },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-700 p-4 rounded-lg shadow text-center hover:scale-105 transform transition"
                        >
                            <div className="text-3xl">{stat.icon}</div>
                            <p className="text-sm text-gray-300 mt-2">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bio Section */}
            <div className="px-6 py-8 bg-gray-800 mt-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-green-400 mb-4">About</h2>
                <p className="text-gray-300 text-lg">{student.bio || "No bio available."}</p>
                <div className="flex gap-6 mt-6">
                    {student.twitter && (
                        <a
                            href={student.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-lg"
                        >
                            Twitter
                        </a>
                    )}
                    {student.facebook && (
                        <a
                            href={student.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 text-lg"
                        >
                            Facebook
                        </a>
                    )}
                    {student.linkedin && (
                        <a
                            href={student.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-600 text-lg"
                        >
                            LinkedIn
                        </a>
                    )}
                </div>
            </div>

            {/* Enrolled Courses Section */}
            <div className="px-6 py-8 bg-gray-800 mt-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-green-400 mb-4">Enrolled Courses</h2>
                {student.courses?.length > 0 ? (
                    <ul className="space-y-4">
                        {student.courses.map((course) => (
                            <li
                                key={course._id}
                                className="bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center hover:bg-gray-600 transition"
                            >
                                <span className="text-lg font-semibold text-gray-300">
                                    {course.name || "Course Name"}
                                </span>
                                <button
                                    onClick={() => navigate(`/courses/${course._id}`)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                                >
                                    View Course
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No courses enrolled yet.</p>
                )}
            </div>
        </div>
    );
}

export default StudentProfilePage;
