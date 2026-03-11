import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from 'react-icons/gi';
import UserData from "./userData";

export default function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const drawerRef = useRef(null);

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
        };

        if (isDrawerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when drawer is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    // Close drawer when route changes
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' }
    ];

    const isActiveLink = (path) => location.pathname === path;

    return (
        <>
            {/* Overlay for mobile drawer */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    aria-hidden="true"
                />
            )}

            <header className="sticky top-0 z-30 w-full h-20 bg-white shadow-md">
                <nav className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <GiHamburgerMenu className="text-2xl text-gray-700" />
                    </button>

                    {/* Logo */}
                    <div 
                        onClick={() => navigate('/')}
                        className="cursor-pointer transition-transform hover:scale-105"
                    >
                        <img 
                            src="/logo.png" 
                            alt="Company Logo" 
                            className="h-16 w-16 object-contain"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                                    isActiveLink(path) 
                                        ? 'text-blue-600 border-b-2 border-blue-600' 
                                        : 'text-gray-700'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Shopping cart"
                    >
                        <FaShoppingCart className="text-2xl text-gray-700" />
                        {/* Optional: Cart item count badge */}
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                        </span>
                    </Link>
                </nav>
            </header>

            {/* Mobile Drawer */}
            <div
                ref={drawerRef}
                className={`
                    fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 
                    transform transition-transform duration-300 ease-in-out
                    ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Drawer Header */}
                <div className="h-20 flex items-center justify-between px-4 border-b">
                    <img 
                        src="/logo.png" 
                        alt="Company Logo" 
                        className="h-12 w-12 object-contain"
                    />
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <FaTimes className="text-2xl text-gray-700" />
                    </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="flex flex-col py-8">
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`
                                px-6 py-4 text-lg font-medium transition-colors
                                hover:bg-blue-50 hover:text-blue-600
                                ${isActiveLink(path) ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700'}
                            `}
                        >
                            {label}
                        </Link>
                    ))}
                    
                    {/* Cart Link for Mobile */}
                    <Link
                        to="/cart"
                        className="px-6 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                    >
                        <FaShoppingCart className="text-xl" />
                        Cart
                    </Link>
                </div>

                {/* Optional: User section in drawer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <UserData />
                </div>
            </div>
        </>
    );
}