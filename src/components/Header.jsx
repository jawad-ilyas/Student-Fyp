import { Link } from 'react-router-dom';

const Header = () => {
    const handleLogout = () => {
        // Remove user info from localStorage or session
        localStorage.removeItem("studentInfo");
        // Redirect to the login page or home
        window.location.href = "/login";
    };

    return (
        <div className="px-6 py-4 bg-gray-800 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">
                <Link to="/">My Courses</Link>
            </h1>
            <div className="space-x-4 flex items-center">
                <Link to="/dashboard" className="text-white hover:text-green-400">
                    Dashboard
                </Link>

                <Link to="/problems" className="text-white hover:text-green-400">
                    Problems
                </Link>

                {/* Profile Link */}
                <Link to="/profile" className="text-white hover:text-green-400">
                    Profile
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
