import React from "react"
import { Link } from "react-router-dom"
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-300 w-full mt-auto">

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Next-Gen Tech Store
                        </h2>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Discover the latest technology products at the best prices.
                            From smartphones to laptops and premium accessories,
                            we bring the future of tech to your fingertips.
                        </p>

                        {/* Socials */}
                        <div className="flex gap-4 mt-6">
                            <div className="bg-gray-700 p-2 rounded hover:bg-blue-600 cursor-pointer transition">
                                <FaFacebookF />
                            </div>
                            <div className="bg-gray-700 p-2 rounded hover:bg-pink-500 cursor-pointer transition">
                                <FaInstagram />
                            </div>
                            <div className="bg-gray-700 p-2 rounded hover:bg-sky-500 cursor-pointer transition">
                                <FaTwitter />
                            </div>
                            <div className="bg-gray-700 p-2 rounded hover:bg-red-600 cursor-pointer transition">
                                <FaYoutube />
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Shop
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
                            <li><Link to="/products?category=P" className="hover:text-white transition">Phones</Link></li>
                            <li><Link to="/products?category=L" className="hover:text-white transition">Laptops</Link></li>
                            <li><Link to="/products?category=H" className="hover:text-white transition">Headphones</Link></li>
                            <li><Link to="/products?category=W" className="hover:text-white transition">Smart Watches</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Company
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition">Return Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Newsletter
                        </h3>

                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to get updates on new arrivals and special offers.
                        </p>

                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 text-sm rounded-l bg-gray-800 border border-gray-700 focus:outline-none"
                            />

                            <button className="bg-blue-600 px-4 py-2 text-sm font-semibold rounded-r hover:bg-blue-700 transition">
                                Subscribe
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-400 space-y-1">
                            <p>📍 Colombo, Sri Lanka</p>
                            <p>📞 +94 70 400 3254</p>
                            <p>✉ support@NextGenTechStore.com</p>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

                    <p>
                        © {new Date().getFullYear()} TechNexus. All rights reserved.
                    </p>

                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white">Privacy</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                        <Link to="/faq" className="hover:text-white">FAQ</Link>
                    </div>

                </div>

            </div>
        </footer>
    )
}