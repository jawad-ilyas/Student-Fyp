import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulesByCourse } from "../features/studentPortal/StudentModulesSlice";


function CourseModules() {
    const { courseId } = useParams();
    console.log(courseId)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { modules, loading, error } = useSelector((state) => state.studentModules);

    useEffect(() => {
        dispatch(fetchModulesByCourse(courseId));
    }, [dispatch, courseId]);

    if (loading) {
        return <p className="p-6 text-green-400 bg-gray-900">Loading modules...</p>;
    }
    if (error) {
        return <p className="p-6 text-red-500 bg-gray-900">{error}</p>;
    }

    // optional local states for the course info if you want to fetch course detail too
    // or you might do a separate thunk for "fetchSingleCourse(courseId)"

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
            {/* A "banner" for the course */}
            <div className="bg-green-700 px-6 py-4">
                <h1 className="text-2xl font-bold">{modules[0]?.course?.name || "Course Name Unavailable"}</h1>
                <p className="text-sm text-gray-100">{modules[0]?.course?.description || "Course Description Unavailable"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-3 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                    Back
                </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.length === 0 ? (
                    <p className="col-span-full text-center text-gray-400">
                        No modules found for this course.
                    </p>
                ) : (
                    modules.map((mod) => {
                        const now = new Date();
                        const start = new Date(mod.startTime);
                        const end = new Date(mod.endTime);

                        let statusLabel = "";
                        if (now < start) statusLabel = "Locked";
                        else if (now > end) statusLabel = "Closed";
                        else statusLabel = "Open";

                        // pick a color for the "Locked / Closed / Open" label
                        let statusColor = "text-gray-400";
                        if (statusLabel === "Open") statusColor = "text-green-400";
                        else if (statusLabel === "Locked") statusColor = "text-yellow-400";
                        else if (statusLabel === "Closed") statusColor = "text-red-400";

                        return (
                            <div
                                key={mod._id}
                                className="
            bg-gray-800
            rounded
            shadow
            border
            border-gray-700
            hover:border-green-500
            transition
            flex
            flex-col
            overflow-hidden
          "
                            >
                                {/* Module Title as a “header” */}
                                <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
                                    <h3 className="text-lg font-bold text-green-300 tracking-wide">
                                        {mod.title}

                                    </h3>
                                </div>

                                {/* Body of the card */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <p className="text-sm text-gray-400 mb-2">{mod.description}</p>

                                    {/* Time Bound Info */}
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div>
                                            <span className="font-semibold text-gray-400">Start:</span>{" "}
                                            {start.toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-400">End:</span>{" "}
                                            {end.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Status Label */}
                                    <div className="mt-2 text-xs font-semibold">
                                        Status: <span className={statusColor}>{statusLabel}</span>
                                    </div>

                                    {/* Bottom Action Row */}
                                    <div className="mt-auto pt-4 flex justify-end">
                                        <button
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-500 transition"
                                            onClick={() => navigate(`/modules/${mod._id}`)}
                                        >
                                            View Questions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}

export default CourseModules;
