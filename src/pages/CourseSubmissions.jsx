import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissionsByCourse } from "../features/submissions/submissionSlice";
import { fetchStudentStats } from "../features/studentPortal/StudentStatsSlice"; // Fetch stats

function CourseSubmissions() {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { submissions, loading, error } = useSelector((state) => state.submission);
    const { easySolved, mediumSolved, hardSolved, totalSolved } = useSelector(
        (state) => state.studentStats
    );

    useEffect(() => {
        dispatch(fetchSubmissionsByCourse(courseId));
        dispatch(fetchStudentStats()); // Fetch user stats for problems solved
    }, [dispatch, courseId]);

    if (loading) return <p>Loading submissions...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!submissions || submissions.length === 0) {
        return <p>No submissions found for this course.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
            >
                &larr; Back
            </button>

            {/* Solved Problems Overview */}
            <div className="mb-6 bg-gray-800 p-4 rounded shadow text-center">
                <h2 className="text-lg font-bold text-green-400 mb-2">Your Problem Solving Stats</h2>
                <p>
                    <span className="font-semibold text-green-300">Total Solved:</span>{" "}
                    {totalSolved || 0}
                </p>
                <p>
                    <span className="font-semibold text-yellow-400">Easy:</span>{" "}
                    {easySolved || 0}, <span className="font-semibold text-blue-400">Medium:</span>{" "}
                    {mediumSolved || 0}, <span className="font-semibold text-red-400">Hard:</span>{" "}
                    {hardSolved || 0}
                </p>
            </div>

            <h1 className="text-2xl font-bold text-green-400 mb-6">
                Submissions for Course {submissions[0]?.course?.name || "Unavailable"}
            </h1>

            {submissions.map((submission) => (
                <div key={submission._id} className="mb-6 bg-gray-800 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold text-green-300 mb-2">
                        Module: {submission.module?.title || "Module Name Unavailable"}
                    </h2>
                    <p>Total Marks: {submission.totalMarks} / {submission.maxTotalMarks}</p>
                    <p>Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
                    <ul className="mt-4 space-y-4">
                        {submission.questions.map((q) => (
                            <li key={q._id} className="text-sm text-gray-400">
                                {/* Question Title as a Link */}
                                <strong>
                                    <Link
                                        to={`/questions/${q.question?._id}`}
                                        className="text-blue-400 underline hover:text-blue-300"
                                    >
                                        {q.question?.title || "Question Name Unavailable"}
                                    </Link>
                                </strong>

                                {/* User Submitted Code */}
                                <div className="mt-2">
                                    <span className="font-semibold text-gray-300">Code Submitted:</span>
                                    <pre className="bg-gray-900 text-gray-200 p-2 rounded text-xs mt-1 overflow-auto">
                                        {q.code || "No code submitted"}
                                    </pre>
                                </div>

                                {/* Marks and Remarks */}
                                <div className="mt-2">
                                    <p>
                                        <span className="font-semibold text-gray-300">Marks Awarded:</span>{" "}
                                        {q.marksAwarded} marks
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-300">Remarks:</span>{" "}
                                        {q.remarks || "No remarks provided"}
                                    </p>
                                </div>

                                {/* Test Cases */}
                                <div className="mt-2">
                                    <span className="font-semibold text-gray-300">Test Cases:</span>
                                    <ul className="bg-gray-900 text-gray-300 p-2 rounded mt-1 text-xs">
                                        {q.question?.sampleTestCases?.map((tc, index) => (
                                            <li key={index} className="mb-1">
                                                <strong>Sample Test {index + 1}:</strong>{" "}
                                                <span className="text-gray-200">
                                                    <strong>Input:</strong> {tc.input}, <strong>Expected Output:</strong> {tc.output}
                                                </span>
                                            </li>
                                        ))}
                                        {q.question?.hiddenTestCases?.map((tc, index) => (
                                            <li key={`hidden-${index}`} className="mb-1">
                                                <strong>Hidden Test {index + 1}:</strong>{" "}
                                                <span className="text-gray-200">
                                                    <strong>Input:</strong> {tc.input}, <strong>Expected Output:</strong> {tc.output}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default CourseSubmissions;
