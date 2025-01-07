import { Link } from "react-router-dom";

const Header = () => {
    // Logout logic carried over from your original code


    return (
        <header className="bg-gradient-to-r from-darkGreenColor to-teal-500 text-white shadow-lg py-4 px-6 fixed top-0 left-0 w-full z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold cursor-pointer">
                    <Link to="/">IEFS</Link>
                </h1>
                <nav className="hidden md:flex space-x-6">
                    <Link
                        to="/"
                        className="transition duration-300 hover:text-yellow-300 font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/aboutus"
                        className="transition duration-300 hover:text-yellow-300 font-medium"
                    >
                        About Us
                    </Link>
                    <Link
                        to="/resources"
                        className="transition duration-300 hover:text-yellow-300 font-medium"
                    >
                        Resources
                    </Link>

                    {/* If you want a dedicated 'Login' link instead of using handleLogout, 
              you can replace the button below with a Link component to '/login'. */}
                    <Link
                        to="/login"
                        className="transition duration-300 hover:text-yellow-300 font-medium"
                    >
                        Login
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
