import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ForgetPasswordPage() {
    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Send OTP to email
    const sendOTP = async () => {
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/users/send-otp', { email });
            setOtpSent(true);
            toast.success('OTP sent successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP (stays on OTP form)
    const resendOTP = async () => {
        if (!email) {
            toast.error('Email is missing. Please go back and enter email.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/users/send-otp', { email });
            toast.success('OTP resent successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and reset password
    const verifyOTP = async () => {
        // Basic validations
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/users/reset-password', {
                email,
                otp,
                newPassword
            });
            toast.success('Password reset successfully!');
            // Redirect to login page after a short delay
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Invalid OTP or reset failed');
        } finally {
            setLoading(false);
        }
    };

    // Go back to email form (e.g., change email)
    const goBack = () => {
        setOtpSent(false);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-center items-center">
            {!otpSent ? (
                // Step 1: Email input form
                <div className="w-[400px] bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Forgot Password</h2>
                    <p className="text-sm text-gray-600 text-center">
                        Enter your email to receive an OTP
                    </p>
                    <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={sendOTP}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>

                    {/* Cancel button */}
                    <button
                        className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                        onClick={() => navigate('/login')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                // Step 2: OTP verification and password reset form
                <div className="w-[400px] bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
                    <p className="text-sm text-gray-600 text-center">
                        OTP sent to <span className="font-medium">{email}</span>
                    </p>

                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={verifyOTP}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    {/* Three-button row: Change Email, Resend OTP, Cancel */}
                    <div className="flex gap-2">
                        <button
                            className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            onClick={goBack}
                            disabled={loading}
                        >
                            Change Email
                        </button>
                        <button
                            className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            onClick={resendOTP}
                            disabled={loading}
                        >
                            Resend OTP
                        </button>
                        <button
                            className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}