import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// We'll import the same thunks from questionsSlice—
// or if you prefer separate calls, you can do that too.
import {
    fetchAllQuestions,
    fetchCategoriesAndTags,
} from "../features/questionsSlice/QuestionsSlice";
// Also import a new thunk if we want to fetch the student's "solved" status
import { fetchStudentStatsOrStatus } from "../features/studentPortal/StudentStatsSlice";

function StudentQuestionsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { questions, categories, tags, loading, error } = useSelector(
        (state) => state.Question
    );


    // If you track which questions are solved in a separate slice, e.g. studentStats
    // or a dedicated "studentQuestionsStatusSlice", you’d select that here.
    // Student stats: solved questions array + counts
    const {
        solvedQuestions,
        totalSolved,
        easyCount,
        mediumCount,
        hardCount,
        loading: statsLoading,
        error: statsError,
    } = useSelector((state) => state.studentStats);

    // Local states for filtering
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchAllQuestions());        // loads all questions from DB
        dispatch(fetchCategoriesAndTags());   // loads category/tag lists
        // Optionally also fetch which questions the student solved
        dispatch(fetchStudentStatsOrStatus());
    }, [dispatch]);

    // Filter logic—identical to your admin example
    const filteredQuestions = questions.filter((question) => {
        const categoryMatch = selectedCategory
            ? question.category === selectedCategory
            : true;
        const tagMatch = selectedTag ? question.tags.includes(selectedTag) : true;
        const difficultyMatch = selectedDifficulty
            ? question.difficulty === selectedDifficulty
            : true;
        const searchMatch = searchQuery
            ? question.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return categoryMatch && tagMatch && difficultyMatch && searchMatch;
    });

    // Determine if question is solved
    const isQuestionSolved = (questionId) => {
        // Suppose solvedQuestions is an array of question IDs or objects
        return solvedQuestions?.some((q) => q.question === questionId);
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold text-green-400">
                    All Questions
                </h1>
                {/* If you want a “Stats” button or any other student-specific actions, place them here */}
            </div>
            {/* STATS PANEL */}
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                {statsLoading ? (
                    <p className="text-green-400">Loading your stats...</p>
                ) : statsError ? (
                    <p className="text-red-400">{statsError}</p>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-gray-700 p-2 rounded shadow text-center">
                            <p className="text-sm text-gray-300">Total Solved</p>
                            <p className="text-lg font-bold text-green-400">{totalSolved}</p>
                        </div>
                        <div className="bg-gray-700 p-2 rounded shadow text-center">
                            <p className="text-sm text-gray-300">Easy</p>
                            <p className="text-lg font-bold text-green-400">{easyCount}</p>
                        </div>
                        <div className="bg-gray-700 p-2 rounded shadow text-center">
                            <p className="text-sm text-gray-300">Medium</p>
                            <p className="text-lg font-bold text-green-400">{mediumCount}</p>
                        </div>
                        <div className="bg-gray-700 p-2 rounded shadow text-center">
                            <p className="text-sm text-gray-300">Hard</p>
                            <p className="text-lg font-bold text-green-400">{hardCount}</p>
                        </div>
                    </div>
                )}
            </div>
            {/* FILTERS */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Difficulty */}
                    <div className="flex items-center space-x-2">
                        <button
                            className={`
                px-4 py-2
                rounded
                transition
                ${selectedDifficulty === ""
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }
              `}
                            onClick={() => setSelectedDifficulty("")}
                        >
                            All Levels
                        </button>
                        {["Easy", "Medium", "Hard"].map((level) => (
                            <button
                                key={level}
                                className={`
                  px-4 py-2
                  rounded
                  transition
                  ${selectedDifficulty === level
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                    }
                `}
                                onClick={() => setSelectedDifficulty(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-green-500
            "
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option className="bg-gray-800" key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Tags Dropdown */}
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-green-500
            "
                    >
                        <option value="">All Tags</option>
                        {tags.map((tag) => (
                            <option className="bg-gray-800" key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-gray-100
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-green-500
              flex-grow
              sm:flex-grow-0
              sm:w-64
            "
                    />
                </div>
            </div>

            {/* QUESTIONS TABLE */}
            <div className="p-6">
                {loading ? (
                    <p className="text-green-400">Loading questions...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
                                    <th className="p-4 text-left font-medium">Status</th>
                                    <th className="p-4 text-left font-medium">Title</th>
                                    <th className="p-4 text-left font-medium">Difficulty</th>
                                    <th className="p-4 text-left font-medium">Category</th>
                                    <th className="p-4 text-left font-medium">Tags</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.map((question) => {
                                    const solved = isQuestionSolved(question._id);

                                    return (
                                        <tr
                                            key={question._id}
                                            className="border-b border-gray-700 hover:bg-gray-800 transition"
                                        >
                                            {/* Show a “solved” or “unsolved” icon */}
                                            <td className="p-4 text-center">
                                                {solved ? (
                                                    <span className="text-green-400 font-bold">Solved</span>
                                                ) : (
                                                    <span className="text-red-400">Unsolved</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-green-200">{question.title}</td>
                                            <td className="p-4 text-yellow-300">{question.difficulty}</td>
                                            <td className="p-4 text-blue-300">{question.category}</td>
                                            <td className="p-4 text-purple-300">
                                                {question.tags.join(", ")}
                                            </td>
                                            <td className="p-4">
                                                {/* For students, typically a "View" or "Solve" button */}
                                                <button
                                                    className="
                            px-3 py-1
                            bg-green-600
                            text-gray-100
                            rounded
                            mr-2
                            hover:bg-green-500
                            transition
                          "
                                                    onClick={() => navigate(`/question/${question._id}`)}
                                                >
                                                    {solved ? "Review" : "Solve"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">
                                            No questions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentQuestionsPage;
