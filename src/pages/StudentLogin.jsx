import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentLogin } from "../features/studentPortal/StudentAuthSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";
function StudentLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pull loading/error/studentInfo from Redux
    const { loading, error, studentInfo } = useSelector((state) => state.studentAuth);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        // Clear previous errors when loading the login page


        // If the user is already logged in, redirect to the dashboard
        const studentInfoStorage = localStorage.getItem("studentInfo");
        if (studentInfoStorage || studentInfo) {
            navigate("/dashboard"); // Replace with your desired route
        }
    }, [dispatch, navigate, studentInfo]);
    // onSubmit handler from React Hook Form
    const onSubmit = async (formData) => {
        try {
            // Extract email, password from formData
            const { email, password } = formData;

            // Dispatch the thunk
            const resultAction = await dispatch(studentLogin({ email, password }));

            if (studentLogin.fulfilled.match(resultAction)) {
                // If success, store studentInfo in localStorage
                localStorage.setItem("studentInfo", JSON.stringify(resultAction.payload));
                // Navigate to student dashboard
                navigate("/dashboard");
            } else {
                // If error from the thunk
                console.error("Login failed:", resultAction.payload);
            }
        } catch (err) {
            console.error("Error in onSubmit:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-green-400">Student Login</h2>

                {error && (
                    <p className="text-red-500 mb-2">
                        {typeof error === "string" ? error : "Login failed."}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="
                w-full
                px-3
                py-2
                rounded
                bg-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-green-400
              "
                            // Hook form registration
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="
                w-full
                px-3
                py-2
                rounded
                bg-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-green-400
              "
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="
              w-full
              px-4
              py-2
              mt-4
              bg-green-600
              text-white
              rounded
              hover:bg-green-500
              transition
            "
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {/* <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-teal-600 hover:underline font-medium"
                        >
                            Register here
                        </Link>
                    </p>
                </div> */}
            </div>
        </div>
    );
}

export default StudentLogin;
