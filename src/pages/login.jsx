import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.post(
                    import.meta.env.VITE_BACKEND_URL + "/api/users/login/google",
                    { accessToken: response.access_token }
                );
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
                toast.success("Login successful");
                if (res.data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Google login failed");
            }
        },
        onError: (error) => {
            console.error("Google OAuth error:", error);
            toast.error("Google login popup failed");
        }
    });

    async function handleLogin() {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
                email: email,
                password: password
            });

            toast.success("Login Successful");
            console.log(response.data);
            localStorage.setItem("token", response.data.token);

            if (response.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-center items-center">
            {/* Left side - hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 h-full"></div>

            {/* Right side - full width on mobile, half on large screens */}
            <div className="w-full lg:w-1/2 h-full flex justify-center items-center px-4">
                <div className="w-full max-w-[400px] bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Email"
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Password"
                        className="w-full h-12 px-4 border border-[#c3efe9] rounded-xl mb-6 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#c3efe9]"
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full h-12 bg-[#c3efe9] hover:bg-[#a0d9d1] text-white font-bold rounded-xl text-lg transition-colors mb-4"
                    >
                        Login
                    </button>

                    <button
                        onClick={googleLogin}
                        className="w-full h-12 flex justify-center items-center gap-2 bg-white hover:bg-gray-100 rounded-xl text-lg font-medium text-gray-700 transition-colors"
                    >
                        <GrGoogle className="text-xl" />
                        <span>Login with Google</span>
                    </button>

                    {/* Optional: Forgot password & Sign up links */}
                    <div className="mt-6 text-sm text-white flex gap-2 flex-wrap justify-center">
                        <Link to="/forget" className="hover:underline">
                            Forgot password?
                        </Link>
                        <span>•</span>
                        <Link to="/signup" className="hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}