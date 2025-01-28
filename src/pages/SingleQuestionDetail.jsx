import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Editor from "@monaco-editor/react";
import { runCode } from "../features/compiler/compilerSlice";
import { fetchQuestionById } from "../features/questionsSlice/QuestionsSlice";
import { submitSingleQuestion } from "../features/submissions/submissionSlice";

function SingleQuestionDetail() {
    const { questionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux states
    const { singleQuestion, loading, error } = useSelector(
        (state) => state.Question || {}
    );
    const { runLoading } = useSelector((state) => state.compiler);
    const { loading: submissionLoading, successMessage: success, error: submissionError } = useSelector(
        (state) => state.submissions || {}
    );

    // Local state for code & output
    const [code, setCode] = useState("// Write your solution here...");
    const [output, setOutput] = useState("");

    // Fetch the single question on mount
    useEffect(() => {
        dispatch(fetchQuestionById(questionId));
    }, [dispatch, questionId]);

    // Handler to run code
    const handleRunCode = async () => {
        try {
            const language = "cpp17";
            const testCases = singleQuestion?.sampleTestCases || [];

            const resultAction = await dispatch(
                runCode({ code, language, testCases, questionId })
            );

            if (runCode.fulfilled.match(resultAction)) {
                const { output: runOutput, passCount, totalCount } =
                    resultAction.payload;
                const combined = `Output:\n${runOutput}\nPassed ${passCount}/${totalCount} testcases`;
                setOutput(combined);
            } else {
                alert("Error running code.");
            }
        } catch (err) {
            console.error("Failed to run code:", err);
            setOutput(`Error: ${err}`);
        }
    };

    // Handler to submit question
    const handleSubmitQuestion = async () => {
        try {

            console.log("question Id ", questionId)
            console.log("code ", code)
            console.log("output ", output)
            const resultAction = await dispatch(submitSingleQuestion({ questionId, code, output }));
            if (submitSingleQuestion.fulfilled.match(resultAction)) {
                alert("Question submitted successfully!");
            } else {
                alert("Error submitting the question.");
            }
        } catch (err) {
            console.error("Failed to submit question:", err);
        }
    };

    // If loading, error, or no question found
    if (loading) {
        return <div className="p-4 text-green-400">Loading singleQuestion...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-400">{error}</div>;
    }
    if (!singleQuestion) {
        return <div className="p-4 text-gray-400">No question found.</div>;
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-900 text-gray-200 p-6 font-mono">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            >
                Back
            </button>

            {/* Question Info */}
            <h1 className="text-2xl font-bold text-green-400 mb-2">
                {singleQuestion.title}
            </h1>
            <p className="text-sm text-yellow-300">
                Difficulty: {singleQuestion.difficulty}
            </p>
            <p className="text-sm text-blue-300 mt-2">
                Category: {singleQuestion.category}
            </p>
            <p className="text-sm text-purple-300">
                Tags: {singleQuestion.tags?.join(", ")}
            </p>

            {/* Problem Statement */}
            <div className="bg-gray-800 p-4 mt-4 rounded shadow">
                <h2 className="text-lg text-green-300 mb-2">Problem Statement</h2>
                <p className="text-sm text-gray-100 whitespace-pre-line">
                    {singleQuestion.problemStatement}
                </p>
            </div>

            {/* Sample Test Cases */}
            {singleQuestion.sampleTestCases &&
                singleQuestion.sampleTestCases.length > 0 && (
                    <div className="bg-gray-800 p-4 mt-4 rounded shadow">
                        <h2 className="text-lg text-green-300 mb-2">
                            Sample Test Cases
                        </h2>
                        {singleQuestion.sampleTestCases.map((tc, i) => (
                            <div key={i} className="mb-3">
                                <p className="text-xs text-gray-400">
                                    Input: {tc.input}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Expected Output: {tc.output}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

            {/* Code Editor & Action Buttons */}
            <div className="bg-gray-800 p-4 mt-4 rounded shadow">
                <Editor
                    height="200px"
                    defaultLanguage="cpp"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                />
                <div className="mt-4 flex space-x-4">
                    <button
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                        onClick={handleRunCode}
                        disabled={runLoading}
                    >
                        {runLoading ? "Running..." : "Run Code"}
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                        onClick={handleSubmitQuestion}
                        disabled={submissionLoading}
                    >
                        {submissionLoading ? "Submitting..." : "Submit Question"}
                    </button>
                </div>

                {/* Output area */}
                {output && (
                    <pre className="mt-2 bg-gray-700 text-green-300 text-xs p-2 rounded">
                        {output}
                    </pre>
                )}

                {/* Submission Success/Error Messages */}
                {success && (
                    <p className="text-green-400 text-xs mt-2">
                        Question submitted successfully.
                    </p>
                )}
                {submissionError && (
                    <p className="text-red-400 text-xs mt-2">
                        {submissionError}
                    </p>
                )}
            </div>
        </div>
    );
}

export default SingleQuestionDetail;
