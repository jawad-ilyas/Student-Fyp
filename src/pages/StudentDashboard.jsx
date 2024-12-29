import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentCourses } from "../features/studentPortal/StudentCoursesSlice";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Grab courses from Redux
    const { courses, loading, error } = useSelector((state) => state.studentCourses);
    useEffect(() => {
        // dispatch the thunk to get enrolled courses
        dispatch(fetchStudentCourses());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="p-6 text-green-400 bg-gray-900 h-screen">
                Loading your courses...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-gray-900 h-screen">
                {typeof error === "string" ? error : "Error loading courses"}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-800 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold text-green-400">
                    My Courses
                </h1>
                {/* Optional Logout or Profile button if you want */}
            </div>

            {/* Courses Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.length === 0 ? (
                    <p className="col-span-full text-center text-gray-400">
                        You are not enrolled in any courses yet.
                    </p>
                ) : (

                    courses?.map((course) => (
                        <div
                            key={course._id}
                            className="bg-gray-800 rounded shadow hover:bg-gray-700 transition flex flex-col overflow-hidden"
                        >
                            {course.imageUrl ? (
                                <img
                                    src={course.imageUrl}
                                    alt={course.name}
                                    className="w-full h-40 object-cover"
                                />
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-gray-700 text-gray-400 text-sm">
                                    No Image
                                </div>
                            )}

                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-lg font-semibold text-green-200 mb-2">{course.name}</h2>
                                {course.teacher && (
                                    <p className="text-xs text-blue-300 mb-1">
                                        <span className="font-bold text-gray-400">Teacher: </span>
                                        {course.teacher.name}
                                    </p>
                                )}
                                <p className="text-xs text-purple-300 mb-1">
                                    <span className="font-bold text-gray-400">Enrolled: </span>
                                    {course.enrolledCount} student{course.enrolledCount === 1 ? "" : "s"}
                                </p>
                                <p className="text-xs text-yellow-300 mb-1">
                                    <span className="font-bold text-gray-400">Modules: </span>
                                    {course.modulesCount}
                                </p>
                                <p className="text-sm text-gray-400 mt-2 flex-grow">
                                    {course.description?.slice(0, 80) || "No description"}...
                                </p>
                            </div>

                            <div className="px-4 pb-4">
                                <button
                                    onClick={() => navigate(`/coursemodules/${course._id}`)}
                                    className="mt-2 w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                                >
                                    View Course
                                </button>
                                <button
                                    onClick={() => navigate(`/courses/${course._id}/submissions`)}
                                    className="mt-2 w-full px-3 py-2 bg-red-600 text-black rounded hover:bg-red-500 transition"
                                >
                                   Check Result 
                                </button>
                            </div>
                        </div>
                    ))


                )}
            </div>

        </div>
    );
}

export default StudentDashboard;
