import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom"; // added Link for navigation

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleRegister() {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users",
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }
            );

            toast.success("Registration Successful");
            console.log(response.data);

            // Redirect to login page after register
            navigate("/login");
        } catch (e) {
            toast.error(e.response?.data?.message || "Registration Failed");
        }
    }

    return (
        <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-center items-center">
            {/* Left side - hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 h-full"></div>

            {/* Right side - full width on mobile, half on large screens */}
            <div className="w-full lg:w-1/2 h-full flex justify-center items-center px-4">
                <div className="w-full max-w-[400px] bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>

                    <input
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <input
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <input
                        placeholder="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <input
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-6 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full h-12 bg-[#c3efe9] hover:bg-[#a0d9d1] text-white font-bold rounded-xl text-lg transition-colors mb-4"
                    >
                        Register
                    </button>

                    {/* Link to login page */}
                    <div className="mt-2 text-sm text-white">
                        <span>Already have an account? </span>
                        <Link to="/login" className="hover:underline font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}