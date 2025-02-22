import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit, BiSolidEyedropper } from "react-icons/bi";
import {
    getStudentProfile,
    clearStudentProfile,
    updateStudentProfileImage,
    updateStudentProfile,
} from "../features/studentPortal/studentProfileSlice";
import { useForm } from "react-hook-form";

function StudentProfilePage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isStatsOpen, setIsStatsOpen] = useState(true); // Collapsible stats
    const [isCoursesOpen, setIsCoursesOpen] = useState(true); // Collapsible courses
    const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Modal for preview
    const [imagePreview, setImagePreview] = useState(null); // Preview image
    const [selectedFile, setSelectedFile] = useState(null); // File for upload
    const [isFormOpen, setIsFormOpen] = useState(true); // Collapsible form

    const { student, loading, error } = useSelector((state) => state.studentProfile);

    // Fetch student profile on component mount
    useEffect(() => {
        dispatch(getStudentProfile());
        return () => {
            dispatch(clearStudentProfile()); // Clean up state when component unmounts
        };
    }, [dispatch]);
    const { register, handleSubmit, reset } = useForm({
        defaultValues: student || {},
    });
    useEffect(() => {
        if (student) {
            reset(student); // Populate form with fetched data
        }
    }, [student, reset]);
    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setSelectedFile(file);
        } else {
            setImagePreview(null);
            setSelectedFile(null);
        }
    };

    // Handle image upload
    const handleImageUpload = async () => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            // 2. Await the thunk, ensuring it has completed
            await dispatch(updateStudentProfileImage(formData)).unwrap();

            // 3. Now refetch the updated student profile
            await dispatch(getStudentProfile()).unwrap();

        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            // 4. Clear the local preview
            setImagePreview(null);
            setSelectedFile(null);
        }
    };


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
    const onSubmit = (data) => {
        console.log("Form Data Submitted: ", data);
        // console.log(data, " update the profile data ")
        // Dispatch form submission action here if needed
        dispatch(updateStudentProfile(data))


    };

    return (
        <div className="min-h-screen pt-16 bg-gray-900 text-gray-200 font-mono">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-500 via-green-400 to-green-500 shadow-lg">
                <div className="absolute inset-0 bg-opacity-50 bg-gray-900"></div>
                <div className="relative px-6 py-12 text-center">
                    <div className="relative w-28 h-28 mx-auto">
                        <img
                            src={imagePreview || student.imageUrl || "/images/default.jpg"}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        />
                        {/* Edit and Preview Icons */}
                        <div className="absolute inset-0 flex items-center justify-center space-x-3 bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition">
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="p-2 bg-white text-green-500  rounded-full shadow hover:bg-gray-100"
                            >
                                <BiSolidEyedropper />
                            </button>
                            <label
                                htmlFor="upload-image"
                                className="p-2 bg-white text-green-500 rounded-full shadow cursor-pointer hover:bg-gray-100"
                            >
                                <BiEdit />
                            </label>
                            <input
                                id="upload-image"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
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

            {/* Form Section */}
            <div className="px-6 py-4 bg-gray-800 mt-4 rounded-lg shadow-md">
                <div
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="text-xl font-bold text-green-400">Update Profile</h2>
                    <span className="text-green-300">{isFormOpen ? "▼" : "▲"}</span>
                </div>
                {isFormOpen && (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring focus:ring-green-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-300 mb-2">Bio</label>
                                <textarea
                                    rows="1"
                                    {...register("bio")}
                                    className="p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring focus:ring-green-500"
                                ></textarea>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-300 mb-2">Major</label>
                                <input
                                    type="text"
                                    {...register("major")}
                                    className="p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring focus:ring-green-500"
                                />
                            </div>
                            {[
                                { label: "Twitter", key: "twitter" },
                                { label: "Facebook", key: "facebook" },
                                { label: "LinkedIn", key: "linkedin" },
                            ].map((link) => (
                                <div key={link.key} className="flex flex-col">
                                    <label className="text-gray-300 mb-2">{link.label}</label>
                                    <input
                                        type="url"
                                        {...register(link.key)}
                                        className="p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring focus:ring-green-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-400 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Collapsible Stats Section */}
            <div className="px-6 py-4 bg-gray-800 mt-4 rounded-lg shadow-md">
                <div
                    onClick={() => setIsStatsOpen(!isStatsOpen)}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="text-xl font-bold text-green-400">Problem Solving Stats</h2>
                    <span className="text-green-300">{isStatsOpen ? "▼" : "▲"}</span>
                </div>
                {isStatsOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-4">

                        {[
                            { label: "Total Solved", value: student.totalSolved, color: "bg-green-400" },
                            { label: "Easy", value: student.easyCount, color: "bg-yellow-400" },
                            { label: "Medium", value: student.mediumCount, color: "bg-blue-400" },
                            { label: "Hard", value: student.hardCount, color: "bg-red-400" },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-700 p-4 rounded-lg shadow text-center hover:scale-105 transform transition"
                            >
                                <p className="text-sm text-gray-300">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value || 0}</p>
                                <div className="mt-2 h-2 bg-gray-800 rounded-full">
                                    <div
                                        className={`${stat.color} h-2 rounded-full`}
                                        style={{ width: `${Math.min(stat.value || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* Collapsible Courses Section */}
            <div className="px-6 py-4 bg-gray-800 mt-4 rounded-lg shadow-md">
                <div
                    onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="text-xl font-bold text-green-400">Enrolled Courses</h2>
                    <span className="text-green-300">{isCoursesOpen ? "▼" : "▲"}</span>
                </div>
                {isCoursesOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {student.courses?.length > 0 ? (
                            student.courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition"
                                >
                                    <h3 className="text-lg font-bold text-green-300">
                                        {course.name || "Course Name"}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {course.description || "No description available."}
                                    </p>
                                    <div className="flex flex-row justify-center space-x-6 items-center">
                                        <button
                                            className="mt-4 px-3 py-2 bg-green-500 text-gray-100 rounded hover:bg-green-400 transition"
                                            onClick={() => navigate(`/coursemodules/${course._id}`)}
                                        >
                                            View Course
                                        </button>
                                        <button
                                            className="mt-4 px-3  py-2 bg-green-500 text-gray-100 rounded hover:bg-green-400 transition"
                                            onClick={() => navigate(`/coursesresult/${course._id}`)}
                                        >
                                            View Grade
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No courses enrolled yet.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                        <img
                            src={imagePreview || student.imageUrl || "/images/default.jpg"}
                            alt="Preview"
                            className="w-full max-w-md mx-auto rounded-lg"
                        />
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="mt-4 px-4 py-2 bg-green-500 text-gray-100 rounded hover:bg-green-400 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {imagePreview && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={handleImageUpload}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-400 transition"
                    >
                        Upload Image
                    </button>
                </div>
            )}
        </div>
    );
}

export default StudentProfilePage;
