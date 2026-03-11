import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white w-full mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">About Us</h3>
                        <p className="text-gray-300">
                            Your premier destination for quality products and exceptional shopping experience.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                            <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                            <li><Link to="/shipping" className="text-gray-300 hover:text-white">Shipping</Link></li>
                            <li><Link to="/returns" className="text-gray-300 hover:text-white">Returns</Link></li>
                            <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>📍 123 Main Street</li>
                            <li>📞 (555) 123-4567</li>
                            <li>✉️ info@store.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                    <p>&copy; 2024 Your Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}