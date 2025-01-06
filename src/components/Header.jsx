import { Link } from "react-router-dom";

const Header = () => {
    const handleLogout = () => {
        // Remove user info from localStorage or session
        localStorage.removeItem("studentInfo");
        // Redirect to the login page or home
        window.location.href = "/login";
    };

    return (
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-500 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Student Header Title */}
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/">Student Portal</Link>
                </h1>

                {/* Navigation Links */}
                <div className="space-x-6 flex items-center">
                    {/* Dashboard Link */}
                    

                  


                    {/* About Us Link */}
                    <Link
                        to="/aboutus"
                        className="text-white hover:text-yellow-300 font-medium transition duration-300"
                    >
                        About Us
                    </Link>

                    {/* Resources Link */}
                    <Link
                        to="/resources"
                        className="text-white hover:text-yellow-300 font-medium transition duration-300"
                    >
                        Resources
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
