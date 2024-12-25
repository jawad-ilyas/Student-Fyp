// src/pages/ModuleDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
    ArrowLeftIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CodeBracketIcon,
} from "@heroicons/react/24/outline";

import {
    fetchSingleModule,
    submitModule,
    clearSubmitState,
} from "../features/studentPortal/StudentModuleDetailSlice";
import { runCode } from "../features/compiler/compilerSlice";

function ModuleDetail() {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        module,
        loading,
        error,
        submitLoading,
        submitError,
        submitSuccess,
    } = useSelector((state) => state.moduleDetail);

    const { runLoading } = useSelector((state) => state.compiler);

    // local solutions state
    const [solutions, setSolutions] = useState([]);

    // Show/hide test cases
    const [showTestCases, setShowTestCases] = useState(false);

    useEffect(() => {
        dispatch(fetchSingleModule(moduleId));
        return () => {
            dispatch(clearSubmitState());
        };
    }, [dispatch, moduleId]);

    useEffect(() => {
        if (module && module.questions) {
            const initial = module.questions.map((qObj) => ({
                questionId: qObj.question._id,
                code: "",
                text: "",
                output: "",
            }));
            setSolutions(initial);
        }
    }, [module]);

    // Time-bound checks
    const now = new Date();
    let timeStatus = "Closed";
    let timeRemainingLabel = "";
    if (module) {
        const start = new Date(module.startTime);
        const end = new Date(module.endTime);

        if (now < start) {
            timeStatus = "Locked";
            timeRemainingLabel = formatTimeDiff(now, start, "Starts in");
        } else if (now > end) {
            timeStatus = "Closed";
            timeRemainingLabel = "Ended on " + end.toLocaleString();
        } else {
            timeStatus = "Open";
            timeRemainingLabel = formatTimeDiff(now, end, "Ends in");
        }
    }

    const isWithinTime = timeStatus === "Open";

    // Helper: format the time difference between two dates
    function formatTimeDiff(from, to, prefix) {
        const diffMs = to - from;
        if (diffMs <= 0) return "";
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const diffSecs = Math.floor((diffMs / 1000) % 60);

        let str = "";
        if (diffDays) str += `${diffDays}d `;
        if (diffHours) str += `${diffHours}h `;
        if (diffMinutes) str += `${diffMinutes}m `;
        if (!diffDays && !diffHours && !diffMinutes) str += `${diffSecs}s`;

        return `${prefix} ${str} `;
    }

    // Update code/text solutions
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

        const questionId = solutions[index].questionId;
        // If question has testCases, pass them:
       
        const languageToUse = "cpp17";
        const codeToRun = solutions[index].code;
        const testCases = module.questions[index].question.testCases || [];

        const resultAction = await dispatch(
            runCode({ code: codeToRun, language: languageToUse, testCases })
        );

        if (runCode.fulfilled.match(resultAction)) {
            const { output, passCount, totalCount } = resultAction.payload;
            const newOutput = `Output: ${output}\nPassed ${passCount}/${totalCount} testcases`;
            setSolutions((prev) => {
                const copy = [...prev];
                copy[index].output = newOutput;
                return copy;
            });
        } else {
            alert("Error running code.");
        }
    };

    const handleSubmitAll = () => {
        if (!isWithinTime) {
            alert("Cannot submit solutions: time window has passed or not started.");
            return;
        }
        dispatch(submitModule({ moduleId, solutions }));
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
    if (error) {
        return (
            <div className="p-4 text-red-400 bg-gray-900 h-screen">
                {error}
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

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            {/* Top Row: Back Button + Module Title */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-sm text-gray-400 hover:text-gray-200 mr-4"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-green-400">{module.title}</h1>
            </div>

            {/* Module Info Card */}
            <div className="bg-gray-800 rounded p-4 border border-gray-700 shadow mb-6">
                <p className="text-sm text-gray-300">{module.description}</p>
                <div className="flex items-center space-x-2 mt-3 text-xs text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <p>
                        <span className="font-semibold">
                            {timeStatus} {timeStatus !== "Closed" && " - "}
                        </span>
                        {timeRemainingLabel}
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
                    <button
                        onClick={() => handleDownload("docx")}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
                    >
                        <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                        Download DOCX
                    </button>
                </div>
            </div>

            {/* Questions */}
            {module.questions?.map((qObj, index) => {
                const { _id, title, problemStatement, testCases } = qObj.question;
                const codeValue = solutions[index]?.code || "";
                const outputValue = solutions[index]?.output || "";

                return (
                    <div key={_id} className="mb-6 bg-gray-800 p-4 rounded border border-gray-700">
                        <h2 className="text-lg font-semibold text-green-300">
                            Question {index + 1}: {title}
                        </h2>
                        {problemStatement ? (
                            <p className="text-sm text-gray-300 mt-1">{problemStatement}</p>
                        ) : (
                            <></> // If there's no statement, hide or show a small note
                        )}

                        {/* Show test cases if they exist */}
                        {testCases && testCases.length > 0 && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setShowTestCases((prev) => !prev)}
                                    className="text-xs text-blue-400 underline"
                                >
                                    {showTestCases ? "Hide" : "Show"} sample test cases
                                </button>
                                {showTestCases && (
                                    <ul className="mt-2 bg-gray-700 p-2 rounded text-xs text-gray-200">
                                        {testCases.map((tc, i) => (
                                            <li key={i} className="mb-1">
                                                <span className="font-semibold">Input:</span> {tc.input} |
                                                <span className="font-semibold"> Expected:</span> {tc.expected}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Code Editor */}
                        <div className="mt-4">
                            <label className="block text-sm text-gray-400 mb-1 flex items-center">
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

                            {/* "Run" button & output */}
                            <div className="mt-2 flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-500"
                                    onClick={() => handleRunCode(index)}
                                    disabled={!isWithinTime || runLoading}
                                >
                                    {runLoading ? "Running..." : "Run Code"}
                                </button>
                                <span className="text-xs text-gray-400">Test with sample cases</span>
                            </div>

                            {/* Output area */}
                            {outputValue && (
                                <pre className="mt-2 bg-gray-700 text-green-300 text-xs p-2 rounded h-20 overflow-auto">
                                    {outputValue}
                                </pre>
                            )}

                            {/* Optional text solution field */}
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

            {/* Submit / Finalize */}
            <div className="mt-4">
                {submitSuccess && (
                    <p className="text-green-400 text-sm mb-2">{submitSuccess}</p>
                )}
                {submitError && <p className="text-red-400 text-sm mb-2">{submitError}</p>}

                <button
                    onClick={handleSubmitAll}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                    disabled={!isWithinTime || submitLoading}
                >
                    {submitLoading ? "Submitting..." : "Submit All Solutions"}
                </button>
            </div>
        </div>
    );
}

export default ModuleDetail;
