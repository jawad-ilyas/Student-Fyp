// src/pages/ModuleDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
    ArrowLeftIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify"; // <-- Import from react-toastify

import { fetchSingleModule } from "../features/studentPortal/StudentModuleDetailSlice";
import { submitSubmission, clearSubmissionState } from "../features/submissions/submissionSlice";
import { runCode } from "../features/compiler/compilerSlice";

function ModuleDetail() {
    const { moduleId } = useParams();
    const navigate = useNavigate(); // For navigation
    const dispatch = useDispatch();

    const {
        module,
        loading,
        error,
    } = useSelector((state) => state.moduleDetail);

    const {
        loading: submissionLoading,
        error: submissionError,
        success: submissionSuccess,
    } = useSelector((state) => state.submission);

    const { runLoading, runError, statusAfterRunning } = useSelector((state) => state.compiler);

    // Local state for solutions
    const [solutions, setSolutions] = useState([]);
    const [solutionsToPass, setSolutionsToPass] = useState([]);
    const [showTestCases, setShowTestCases] = useState(false);

    useEffect(() => {
        dispatch(fetchSingleModule(moduleId));
        return () => {
            dispatch(clearSubmissionState());
        };
    }, [dispatch, moduleId]);

    useEffect(() => {
        if (module && module?.questions) {
            const initial = module?.questions?.map((qObj) => ({
                questionId: qObj?.question?._id,
                code: "",
                text: "",
                output: "",
                score: 0,
            }));
            setSolutions(initial);
            setSolutionsToPass(initial);
        }
    }, [module]);

    // Watch for submission success or errors, and show toast notifications
    useEffect(() => {
        if (submissionSuccess) {
            toast.success(submissionSuccess);
        }
    }, [submissionSuccess]);

    useEffect(() => {
        if (submissionError) {
            // If submissionError is an object with a "message" property,
            // display that. Otherwise, show a generic error.
            const errorMsg =
                typeof submissionError === "string"
                    ? submissionError
                    : submissionError?.message || "Submission failed";
            toast.error(errorMsg);
        }
    }, [submissionError]);

    const now = new Date();
    let timeStatus = "Closed";
    let timeRemainingLabel = "";
    if (module) {
        const start = new Date(module?.startTime);
        const end = new Date(module?.endTime);

        if (now < start) {
            timeStatus = "Locked";
            timeRemainingLabel = `Starts in ${formatTimeDiff(now, start)}`;
        } else if (now > end) {
            timeStatus = "Closed";
            timeRemainingLabel = `Ended on ${end.toLocaleString()}`;
        } else {
            timeStatus = "Open";
            timeRemainingLabel = `Ends in ${formatTimeDiff(now, end)}`;
        }
    }

    const isWithinTime = timeStatus === "Open";

    function formatTimeDiff(from, to) {
        const diffMs = to - from;
        if (diffMs <= 0) return "";
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

        let str = "";
        if (diffDays) str += `${diffDays}d `;
        if (diffHours) str += `${diffHours}h `;
        if (diffMinutes) str += `${diffMinutes}m `;
        return str.trim();
    }

    const handleSolutionChange = (index, field, value) => {
        setSolutions((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleRunCode = async (index) => {
        if (!isWithinTime) {
            alert("Module is locked or closed.");
            return;
        }
        console.log("module.questions[index].question ", module.questions[index].question?._id)
        const languageToUse = "cpp17";
        const codeToRun = solutions[index].code;
        const testCases = module.questions[index].question.sampleTestCases || [];
        const question = module.questions[index].question.problemStatement
        const totalMarks = module.questions[index].marks
        console.log(" module.questions", question)
        const questionId = module.questions[index].question?._id;

        const resultAction = await dispatch(
            runCode({ code: codeToRun, language: languageToUse, testCases, questionId, question, totalMarks })
        );

        if (runCode.fulfilled.match(resultAction)) {
            console.log("status after running the code ")
            const { output, passCount, totalCount, score, totalMarks } = resultAction.payload;


            // Print individual variables and their types
            console.log('output:', output);
            console.log('type of output:', typeof output);

            console.log('passCount:', passCount);
            console.log('type of passCount:', typeof passCount);

            console.log('totalCount:', totalCount);
            console.log('type of totalCount:', typeof totalCount);

            console.log('score:', score);
            console.log('type of score:', typeof score);

            console.log('totalMarks:', totalMarks);
            console.log('type of totalMarks:', typeof totalMarks);

            // Print the entire payload
            console.log('resultAction.payload:', JSON.stringify(resultAction.payload, null, 2));
            console.log('type of resultAction.payload:', typeof resultAction.payload);


            // const newOutput = `Output: ${output}\nPassed ${passCount}/${totalCount} testcases`;
            const newOutput = `\nPassed ${passCount}/${totalCount} testcases`;
            const newOutputWithMarks = `Output: ${output}\nPassed ${passCount}/${totalCount} testcases\n AI driven score is: ${score}/${totalMarks} `;
            setSolutions((prev) => {
                const copy = [...prev];
                copy[index].output = newOutput;
                return copy;
            });
            setSolutionsToPass((prev) => {
                const copy = [...prev];
                copy[index].output = newOutputWithMarks;
                copy[index].score = score;
                copy[index].code = codeToRun;
                return copy;
            });
        } else {
            console.log("statusAfterRunning : ", statusAfterRunning)

            toast.error("Error running code.");
        }

        console.log("statusAfterRunning : ", statusAfterRunning)
    };

    const handleSubmitAll = () => {
        if (!isWithinTime) {
            alert("Cannot submit solutions: time window has passed or not started.");
            return;
        }

        const courseId = module?.course;
        const teacherId = module?.teacher?._id;

        const updatedSolutions = solutionsToPass.map((solution, index) => ({
            ...solution,
            marks: module.questions[index].marks, // Include marks for each question
        }));

        dispatch(submitSubmission({ courseId, teacherId, moduleId, solutions: updatedSolutions }));
    };

    const handleDownload = (format) => {
        window.open(
            `http://localhost:5000/api/v1/modules/${moduleId}/download-questions?format=${format}`,
            "_blank"
        );
    };

    if (loading) {
        return (
            <div className="p-4 text-green-400 bg-gray-900 h-screen">
                Loading module...
            </div>
        );
    }

    if (!module) {
        return (
            <div className="p-4 text-gray-400 bg-gray-900 h-screen">
                No module found.
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-4 text-red-400 bg-gray-900 h-screen">
                {typeof error === "string"
                    ? error
                    : error?.message || "An unexpected error occurred."}
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 bg-gray-900 text-gray-200 p-6">
            {/* Top Section with updated Back Button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)} // navigate back
                    className="flex items-center text-sm text-gray-400 hover:text-gray-200 mr-4"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-green-400">{module.title}</h1>
            </div>

            <div className="bg-gray-800 rounded p-4 border border-gray-700 shadow mb-6">
                <p className="text-sm text-gray-300">{module?.description}</p>
                <div className="flex items-center space-x-2 mt-3 text-xs text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <p>
                        {timeStatus === "Closed" ? (
                            <span className="text-red-500 font-semibold capitalize">
                                time is over!
                            </span>
                        ) : (
                            <>
                                <span className="font-semibold">
                                    {timeStatus}{" "}
                                    {timeStatus !== "Closed" && " - "}
                                </span>
                                {timeRemainingLabel}
                            </>
                        )}
                    </p>
                </div>

                <div className="mt-3 flex space-x-2">
                    <button
                        onClick={() => handleDownload("pdf")}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
                    >
                        <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                        Download PDF
                    </button>
                </div>
            </div>

            {module.questions.length === 0 && (
                <div className="bg-gray-800 p-4 rounded shadow text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-4">
                        No Question Found
                    </h2>
                    <p className="text-gray-400">
                        It seems there are no Questions available for this Module yet.
                    </p>
                    {/* Dummy Layout */}
                    <div className="mt-6 p-4 bg-gray-700 rounded">
                        <p className="text-gray-500">
                            Once Module Questions are available, they will appear here with
                            detailed information about your progress.
                        </p>
                    </div>
                </div>
            )}

            {module.questions?.map((qObj, index) => {
                const { _id, title, problemStatement, sampleTestCases } = qObj.question;
                const codeValue = solutions[index]?.code || "";
                const outputValue = solutions[index]?.output || "";
                const marks = qObj.marks;

                return (
                    <div
                        key={_id}
                        className="mb-6 bg-gray-800 p-4 rounded border border-gray-700"
                    >
                        <h2 className="text-lg font-semibold text-green-300">
                            Question {index + 1}: {title}
                        </h2>
                        <p className="text-sm text-yellow-300">Marks: {marks}</p>
                        {problemStatement && (
                            <p className="text-sm text-gray-300 mt-1">{problemStatement}</p>
                        )}

                        {sampleTestCases?.length > 0 && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setShowTestCases((prev) => !prev)}
                                    className="text-xs text-blue-400 underline"
                                >
                                    {showTestCases ? "Hide" : "Show"} sample test cases
                                </button>
                                {showTestCases && (
                                    <ul className="mt-2 bg-gray-700 p-2 rounded text-xs text-gray-200">
                                        {sampleTestCases.map((tc, i) => (
                                            <li key={i} className="mb-1">
                                                <span className="font-semibold">Input:</span>{" "}
                                                {tc.input} |{" "}
                                                <span className="font-semibold">Output:</span>{" "}
                                                {tc.output}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Code Editor */}
                        <div className="mt-4">
                            <label className=" text-sm text-gray-400 mb-1 flex items-center">
                                <CodeBracketIcon className="w-4 h-4 mr-1" />
                                Code Solution (optional)
                            </label>
                            <div className={!isWithinTime ? "opacity-50" : ""}>
                                <Editor
                                    height="180px"
                                    theme="vs-dark"
                                    defaultLanguage="javascript"
                                    value={codeValue}
                                    onChange={(val) => handleSolutionChange(index, "code", val)}
                                    options={{
                                        readOnly: !isWithinTime,
                                        minimap: { enabled: false },
                                    }}
                                />
                            </div>

                            <div className="mt-2 flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-500"
                                    onClick={() => handleRunCode(index)}
                                    disabled={!isWithinTime || runLoading}
                                >
                                    {runLoading ? "Running..." : "Run Code"}
                                </button>
                                <span className="text-xs text-gray-400">
                                    Test with sample cases
                                </span>
                            </div>

                            {outputValue && (
                                <pre className="mt-2 bg-gray-700 text-green-300 text-xs p-2 rounded h-20 overflow-auto">
                                    {outputValue}
                                </pre>
                            )}

                            <label className="block text-sm text-gray-400 mt-4">
                                Additional Comments / Explanation
                            </label>
                            <textarea
                                className="w-full h-16 bg-gray-700 text-gray-100 rounded p-2 text-sm mt-1"
                                value={solutions[index]?.text || ""}
                                onChange={(e) => handleSolutionChange(index, "text", e.target.value)}
                                disabled={!isWithinTime}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Submission Section */}
            <div className="mt-4">
                {/* We still display text feedback as well, though toastify is also used */}
                {submissionSuccess && (
                    <p className="text-green-400 text-sm mb-2">{submissionSuccess}</p>
                )}
                {submissionError && (
                    <p className="text-red-400 text-sm mb-2">
                        {typeof submissionError === "string"
                            ? submissionError
                            : submissionError?.message}
                    </p>
                )}

                {isWithinTime && module.questions?.length !== 0 && (
                    <button
                        onClick={handleSubmitAll}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                        disabled={submissionLoading}
                    >
                        {submissionLoading ? "Submitting..." : "Submit All Solutions"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ModuleDetail;
