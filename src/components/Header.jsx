import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user information from localStorage
        localStorage.removeItem("userInfo");
        // Redirect to login page
        navigate("/login");
    };

 
    return (
        <header className="flex justify-between items-center p-4 border-b shadow-sm relative">
            <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
            <div className="space-x-2">
                    <Link to={"/"} className="text-gray-600 font-medium cursor-pointer">Home</Link>
                    <Link to={"/aboutus"} className="text-gray-600 font-medium cursor-pointer">About Us</Link>
                    <Link to={"/resources"} className="text-gray-600 font-medium cursor-pointer">Resources</Link>
                
            </div>
            
            <nav className="flex items-center space-x-4">
                <p className="text-gray-600 font-medium cursor-pointer">Courses</p>
                <div className="relative">
                    {/* User Image */}
                    <div
                        className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                        <img
                            onClick={() => {
                                navigate("/");
                                setDropdownVisible(false);
                            }}
                            src="https://via.placeholder.com/150" // Replace with real user image
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                            <ul className="py-2">
                                <li
                                    onClick={() => {
                                        navigate("/dashboard");
                                        setDropdownVisible(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Dashboard
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/profile");
                                        setDropdownVisible(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Profile
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/questionsdashboard");
                                        setDropdownVisible(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Question Dashboard
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/addquestion");
                                        setDropdownVisible(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Add Question
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/teacherdashboard");
                                        setDropdownVisible(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Teacher Dashboard
                                </li>
                                <li
                                    onClick={handleLogout}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
