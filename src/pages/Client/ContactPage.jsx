import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaPaperPlane, FaUser, FaEnvelope, FaComment } from "react-icons/fa"

export default function ContactPage(){

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function sendMessage(e){
        e.preventDefault()
        
        // Validation
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in all fields", {
                icon: '⚠️',
                duration: 3000
            })
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address", {
                duration: 3000
            })
            return
        }

        setIsLoading(true)
        const loadingToast = toast.loading("Sending your message...")

        try{
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/contact", {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                message: message.trim()
            })

            toast.dismiss(loadingToast)
            toast.success("Message sent successfully! We'll get back to you soon.", {
                icon: '✓',
                duration: 5000
            })

            // Clear form
            setFirstName("")
            setLastName("")
            setEmail("")
            setMessage("")

        } catch(err) {
            toast.dismiss(loadingToast)
            console.error("Contact form error:", err)
            
            const errorMessage = err.response?.data?.message || "Failed to send message. Please try again."
            toast.error(errorMessage, {
                icon: '❌',
                duration: 5000
            })
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="max-w-2xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
                <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">
                    Get in Touch
                </p>
                <h1 className="text-5xl font-black text-gray-900 mb-4">
                    Contact Us
                </h1>
                <p className="text-gray-600 text-lg">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="bg-white border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <form onSubmit={sendMessage} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                maxLength={50}
                            />
                        </div>

                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                maxLength={50}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            type="email"
                            disabled={isLoading}
                            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            maxLength={100}
                        />
                    </div>

                    <div className="relative">
                        <FaComment className="absolute left-4 top-4 text-gray-400" />
                        <textarea
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your Message"
                            disabled={isLoading}
                            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            maxLength={1000}
                        />
                        <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                            {message.length}/1000
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                                Send Message
                            </>
                        )}
                    </button>

                    {/* Form status indicators */}
                    <div className="text-xs text-gray-400 text-center mt-4">
                        {firstName && lastName && email && message ? (
                            <span className="text-green-600">✓ All fields filled</span>
                        ) : (
                            <span>Please fill in all fields</span>
                        )}
                    </div>
                </form>
            </div>

            {/* Alternative contact methods */}
            <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Or reach us through:</p>
                <div className="flex justify-center gap-6">
                    <a 
                        href="mailto:support@example.com" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                         support@NextGenTechStore.com
                    </a>
                    <span className="text-gray-300">|</span>
                    <a 
                        href="tel:+1234567890" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        +94 70 400 3254
                    </a>
                </div>
            </div>
        </div>
    )
}