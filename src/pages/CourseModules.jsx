import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulesByCourse } from "../features/studentPortal/StudentModulesSlice";

function CourseModules() {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { modules, loading ,error } = useSelector((state) => state.studentModules);

    useEffect(() => {
        dispatch(fetchModulesByCourse(courseId));
    }, [dispatch, courseId]);

    const getStatusLabel = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return { label: "Locked", color: "text-yellow-400" };
        if (now > end) return { label: "Closed", color: "text-red-400" };
        return { label: "Open", color: "text-green-400" };
    };

    if (loading) {
        return <p className="p-6 text-green-400 bg-gray-900">Loading modules...</p>;
    }

    if (error?.message) {
        return (
            <div className="p-6 bg-gray-900">
                <p className="text-red-500 mb-4">{error?.message}</p>
                <button
                    onClick={() => dispatch(fetchModulesByCourse(courseId))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-mono">
            {/* Course Header */}
            <div className="pt-20 px-6 py-4">
                {/* <h1 className="text-2xl font-bold">
                    {modules[0]?.course?.name || "Course Name Unavailable"}
                </h1>
                <p className="text-sm text-gray-100">
                    {modules[0]?.course?.description || "Course Description Unavailable"}
                </p> */}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-3 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    aria-label="Go back to previous page"
                >
                    Back
                </button>
            </div>

            {/* Modules List */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules?.length === 0 ? (
                    <p className="col-span-full text-center text-gray-400">
                        No modules found for this course.
                    </p>
                ) : (
                    modules?.map((mod) => {
                        const { label: statusLabel, color: statusColor } = getStatusLabel(
                            mod.startTime,
                            mod.endTime
                        );

                        return (
                            <div
                                key={mod?._id}
                                className="bg-gray-800 rounded shadow border border-gray-700 hover:border-green-500 transition flex flex-col overflow-hidden"
                            >
                                {/* Module Title */}
                                <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
                                    <h3 className="text-lg font-bold text-green-300 tracking-wide">
                                        {mod?.title}
                                    </h3>
                                </div>

                                {/* Module Details */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <p className="text-sm text-gray-400 mb-2">{mod?.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div>
                                            <span className="font-semibold text-gray-400">
                                                Start:
                                            </span>{" "}
                                            {new Date(mod?.startTime).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-400">
                                                End:
                                            </span>{" "}
                                            {new Date(mod?.endTime).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Status Label */}
                                    <div className="mt-2 text-xs font-semibold">
                                        Status: <span className={statusColor}>{statusLabel}</span>
                                    </div>

                                    {/* View Button */}
                                    <div className="mt-auto pt-4 flex justify-end">
                                        <button
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-500 transition"
                                            onClick={() => navigate(`/modules/${mod?._id}`)}
                                            aria-label={`View module ${mod?.title}`}
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
