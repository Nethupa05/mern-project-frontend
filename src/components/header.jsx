import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UserData from "./userData";
import { getCartCount } from '../utils/cart'; // Import cart utility

export default function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const drawerRef = useRef(null);
    const profileMenuRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    // Update cart count
    const updateCartCount = () => {
        setCartCount(getCartCount());
    };

    // Get user from token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    // Fetch products for search
    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Initialize cart count and listen for updates
    useEffect(() => {
        updateCartCount();
        
        // Listen for cart updates
        window.addEventListener('cartUpdated', updateCartCount);
        
        // Cleanup
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close drawers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                setShowSearchResults(false);
            }
        };

        if (isDrawerOpen || isProfileMenuOpen || isSearchOpen || showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
            if (isDrawerOpen) {
                document.body.style.overflow = 'hidden';
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen, isProfileMenuOpen, isSearchOpen, showSearchResults]);

    // Close drawer when route changes
    useEffect(() => {
        setIsDrawerOpen(false);
        setIsProfileMenuOpen(false);
        setIsSearchOpen(false);
        setShowSearchResults(false);
    }, [location]);

    // Search functionality
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

        setSearchResults(results);
        setShowSearchResults(true);
    }, [searchQuery, products]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/products?search=' + encodeURIComponent(searchQuery));
            setSearchQuery('');
            setIsSearchOpen(false);
            setShowSearchResults(false);
        }
    };

    const handleProductClick = (product) => {
        navigate(`/overview/${product.productId}`);
        setSearchQuery('');
        setIsSearchOpen(false);
        setShowSearchResults(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

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

            <header className="sticky top-0 z-30 w-full bg-white shadow-md">
                <nav className="h-20 max-w-7xl mx-auto px-4 flex items-center justify-between">
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

                    {/* Right Section - Search, Cart, Profile */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon and Bar - Desktop */}
                        <div className="relative hidden md:block" ref={searchRef}>
                            {!isSearchOpen ? (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Open search"
                                >
                                    <FaSearch className="text-xl text-gray-700" />
                                </button>
                            ) : (
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                    >
                                        <FaSearch />
                                    </button>
                                </form>
                            )}
                            
                            {/* Search Results Dropdown */}
                            {showSearchResults && isSearchOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 min-w-[300px]">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((product) => (
                                            <button
                                                key={product._id || product.productId}
                                                onClick={() => handleProductClick(product)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {product.images && product.images[0] ? (
                                                        <img 
                                                            src={product.images[0]} 
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/40';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                            <FaSearch className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{product.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-red-500 font-bold text-sm">
                                                                Rs. {product.sellingPrice}
                                                            </span>
                                                            {product.labelledPrice && (
                                                                <span className="text-gray-400 line-through text-xs">
                                                                    Rs. {product.labelledPrice}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No products found for "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Toggle search"
                        >
                            <FaSearch className="text-xl text-gray-700" />
                        </button>

                        {/* Cart Icon with Dynamic Count */}
                        <Link
                            to="/cart"
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Shopping cart"
                        >
                            <FaShoppingCart className="text-2xl text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Icon with Dropdown */}
                        {user ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    {user.img ? (
                                        <img 
                                            src={user.img} 
                                            alt={user.firstName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="font-medium text-gray-800">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-sm" />
                                                <span>Profile</span>
                                            </div>
                                        </Link>

                                        {/* Admin Panel link - only for admin users */}
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaCog className="text-sm" />
                                                    <span>Admin Panel</span>
                                                </div>
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaSignOutAlt className="text-sm" />
                                                <span>Logout</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Search Bar - Conditionally shown */}
                {isSearchOpen && (
                    <div className="md:hidden px-4 py-2 bg-gray-50 border-t" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            >
                                <FaSearch />
                            </button>
                        </form>
                        
                        {/* Mobile Search Results */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                {searchResults.map((product) => (
                                    <button
                                        key={product._id || product.productId}
                                        onClick={() => handleProductClick(product)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            {product.images && product.images[0] ? (
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{product.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-500 font-bold text-sm">
                                                        Rs. {product.sellingPrice}
                                                    </span>
                                                    {product.labelledPrice && (
                                                        <span className="text-gray-400 line-through text-xs">
                                                            Rs. {product.labelledPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
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

                {/* User Info in Drawer */}
                {user && (
                    <div className="px-4 py-4 border-b">
                        <div className="flex items-center gap-3">
                            {user.img ? (
                                <img 
                                    src={user.img} 
                                    alt={user.firstName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    
                    {/* Cart Link for Mobile with Count */}
                    <Link
                        to="/cart"
                        className="px-6 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                        onClick={() => setIsDrawerOpen(false)}
                    >
                        <FaShoppingCart className="text-xl" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile Link for Mobile */}
                    {user && (
                        <Link
                            to="/profile"
                            className="px-6 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <FaUser className="text-xl" />
                            <span>Profile</span>
                        </Link>
                    )}

                    {/* Admin Panel Link for Mobile */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="px-6 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <FaCog className="text-xl" />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    {/* Logout Button for Mobile */}
                    {user && (
                        <button
                            onClick={() => {
                                logout();
                                setIsDrawerOpen(false);
                            }}
                            className="w-full text-left px-6 py-4 text-lg font-medium text-red-600 transition-colors hover:bg-red-50 flex items-center gap-3"
                        >
                            <FaSignOutAlt className="text-xl" />
                            <span>Logout</span>
                        </button>
                    )}
                </div>

                {/* Login/Register for non-authenticated users in drawer */}
                {!user && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                        <UserData />
                    </div>
                )}
            </div>
        </>
    );
}