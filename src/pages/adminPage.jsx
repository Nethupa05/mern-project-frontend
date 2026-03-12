import { Link, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from "react";
import { 
    FaBox, 
    FaShoppingCart, 
    FaUsers, 
    FaStar, 
    FaChevronLeft,
    FaChevronRight,
    FaSignOutAlt,
    FaCog,
    FaBell,
    FaSearch,
    FaHome,
    FaChartLine,
    FaStore,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes,
    FaTachometerAlt
} from "react-icons/fa";
import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/ProductPage";
import EditProductPage from "./admin/productsEditPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/AdminUsersPage"
import AdminMessagesPage from "./admin/AdminMessagesPage";

export default function AdminPage(){
    const location = useLocation()
    const path = location.pathname
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    // Professional color palette
    const colors = {
        primary: {
            main: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8',
            gradient: 'from-blue-600 to-indigo-700'
        },
        secondary: {
            main: '#7c3aed',
            light: '#8b5cf6',
            dark: '#6d28d9'
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: {
            light: '#f9fafb',
            dark: '#111827'
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            light: '#9ca3af'
        }
    }

    // Check if mobile on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location])

    function getClass(name){
        if(path.includes(name)){
            return `bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 border-r-4 border-white shadow-lg`
        }else{
            return `text-gray-700 hover:bg-blue-50 p-4 transition-all duration-300 border-r-4 border-transparent hover:border-blue-600/30`
        }
    }

    // Navigation items with icons
    const navItems = [
        { name: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className="text-xl" />, path: "/admin/dashboard" },
        { name: "products", label: "Products", icon: <FaBox className="text-xl" />, path: "/admin/products" },
        { name: "orders", label: "Orders", icon: <FaShoppingCart className="text-xl" />, path: "/admin/orders" },
        { name: "users", label: "Users", icon: <FaUsers className="text-xl" />, path: "/admin/users" },
        { name: "reviews", label: "Reviews", icon: <FaStar className="text-xl" />, path: "/admin/reviews" }
    ]

    // Stats data for dashboard
    const stats = [
        { label: 'Total Sales', value: '$45,678', change: '+12%', icon: <FaChartLine />, color: colors.primary.main },
        { label: 'Orders', value: '1,234', change: '+8%', icon: <FaShoppingCart />, color: colors.success },
        { label: 'Products', value: '567', change: '+3%', icon: <FaBox />, color: colors.warning },
        { label: 'Users', value: '4,567', change: '+15%', icon: <FaUsers />, color: colors.secondary.main }
    ]

    // Format date for display
    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return(
        <div className={`w-full h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} relative transition-colors duration-300 overflow-hidden`}>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <div 
                className={`hidden md:block relative h-full ${isCollapsed ? 'w-[80px]' : 'w-[300px]'} font-bold cursor-pointer text-xl flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-2xl transition-all duration-300 ease-in-out`}
                style={{ overflow: 'visible' }}
            >
                {/* Desktop Sidebar Content (keep existing desktop sidebar code) */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                <FaStore className="text-white text-sm" />
                            </div>
                            <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent`}>
                                Admin
                            </span>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <FaStore className="text-white text-sm" />
                        </div>
                    )}
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link 
                            key={item.name}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} mb-2 mx-2 rounded-lg transition-all duration-300 ${
                                path.includes(item.name) 
                                    ? `bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg` 
                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`
                            }`}
                            to={item.path}
                            title={isCollapsed ? item.label : ''}
                        >
                            <span className="text-2xl p-4">{item.icon}</span>
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </div>

                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold`}>
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin User</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@store.com</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${
                                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                            } p-3 rounded-lg transition-all duration-300`}
                            title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
                        >
                            {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                            {!isCollapsed && <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                        </button>

                        <Link 
                            to="/admin/settings" 
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${
                                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                            } p-3 rounded-lg transition-all duration-300`}
                            title={isCollapsed ? 'Settings' : ''}
                        >
                            <FaCog className="text-lg" />
                            {!isCollapsed && <span className="text-sm">Settings</span>}
                        </Link>
                        
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token')
                                window.location.href = '/login'
                            }}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-lg transition-all duration-300`}
                            title={isCollapsed ? 'Logout' : ''}
                        >
                            <FaSignOutAlt className="text-lg" />
                            {!isCollapsed && <span className="text-sm">Logout</span>}
                        </button>
                    </div>
                </div>

                <div 
                    className="absolute top-20 z-50 hidden md:block"
                    style={{ 
                        right: '-12px',
                        transform: 'translateX(0)',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-6 h-6 bg-white border border-blue-600 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? <FaChevronRight className="text-xs" /> : <FaChevronLeft className="text-xs" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <div 
                className={`fixed md:hidden h-full w-[280px] font-bold cursor-pointer text-xl flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <FaStore className="text-white text-sm" />
                        </div>
                        <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent`}>
                            Admin
                        </span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link 
                            key={item.name}
                            className={`flex items-center gap-4 mb-2 mx-2 rounded-lg transition-all duration-300 ${
                                path.includes(item.name) 
                                    ? `bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg` 
                                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`
                            }`}
                            to={item.path}
                        >
                            <span className="text-2xl p-4">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold">
                            A
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin User</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@store.com</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-full flex items-center gap-3 ${
                                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                            } p-3 rounded-lg transition-all duration-300`}
                        >
                            {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <Link 
                            to="/admin/settings" 
                            className={`w-full flex items-center gap-3 ${
                                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                            } p-3 rounded-lg transition-all duration-300`}
                        >
                            <FaCog className="text-lg" />
                            <span className="text-sm">Settings</span>
                        </Link>
                        
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token')
                                window.location.href = '/login'
                            }}
                            className="w-full flex items-center gap-3 text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-lg transition-all duration-300"
                        >
                            <FaSignOutAlt className="text-lg" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
                {/* Top Header Bar - Mobile Responsive */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b h-16 flex items-center justify-between px-3 md:px-6 shadow-sm transition-colors duration-300`}>
                    {/* Left Section - Mobile Menu Button and Title */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaBars className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                        </button>

                        {/* Home Button - Hidden on very small screens */}
                        <Link
                            to="/"
                            className={`hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            <FaHome className="text-sm md:text-lg" />
                            <span className="text-xs md:text-sm font-medium hidden xs:inline">Store</span>
                        </Link>

                        {/* Page Title - Truncated on mobile */}
                        <div className="flex items-center gap-1 md:gap-2 min-w-0">
                            <h2 className={`text-base md:text-xl font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {path.split('/').pop()?.charAt(0).toUpperCase() + path.split('/').pop()?.slice(1) || 'Dashboard'}
                            </h2>
                            <span className={`text-xs md:text-sm hidden md:inline ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ Admin</span>
                        </div>
                    </div>

                    {/* Right Side Actions - Responsive */}
                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Search Bar - Hidden on mobile, shown on tablet+ */}
                        <div className="relative hidden sm:block">
                            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-sm`} />
                            <input 
                                type="text"
                                placeholder="Search..."
                                className={`pl-9 pr-3 md:pl-10 md:pr-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 md:w-64 text-xs md:text-sm transition-colors duration-300 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                                }`}
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-1.5 md:p-2 rounded-full transition-all duration-300 ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:bg-gray-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaBell className="text-lg md:text-xl" />
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Notifications Dropdown - Mobile friendly */}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-2 w-72 md:w-80 rounded-lg shadow-xl border z-50 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-700' 
                                        : 'bg-white border-gray-200'
                                }`}>
                                    <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`font-semibold text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <div className={`p-3 md:p-4 hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>New Order Received</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order #ORD001 placed</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>5 min ago</p>
                                        </div>
                                        <div className={`p-3 md:p-4 hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Low Stock Alert</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wireless Headphones low</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className={`p-2 md:p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                                        <button className="text-xs md:text-sm text-blue-600 hover:underline">View All</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date/Time - Hidden on mobile, shown on desktop */}
                        <div className="hidden lg:block text-right">
                            <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formattedDate}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formattedTime}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content - Scrollable with responsive padding */}
                <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
                    <div className="h-full w-full p-3 md:p-6">
                        {/* Dashboard Stats - Responsive grid */}
                        {path.includes('dashboard') && (
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 transition-transform hover:scale-105`}>
                                        <div className="flex items-center justify-between mb-3 md:mb-4">
                                            <div className={`p-2 md:p-3 rounded-lg`} style={{ backgroundColor: `${stat.color}20` }}>
                                                <span style={{ color: stat.color }} className="text-lg md:text-xl">{stat.icon}</span>
                                            </div>
                                            <span className={`text-xs md:text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h3 className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</h3>
                                        <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Routes with responsive containers */}
                        <Routes>
                            <Route path="/dashboard" element={
                                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg md:rounded-xl shadow-lg p-4 md:p-6`}>
                                    <h2 className={`text-lg md:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Welcome to Dashboard</h2>
                                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Select a section from the sidebar to manage your store.
                                    </p>
                                </div>
                            } />
                            <Route path="/products" element={<AdminProductsPage isDarkMode={isDarkMode} />} />
                            <Route path="/orders" element={<AdminOrdersPage isDarkMode={isDarkMode} />} />
                            <Route path="/users" element={<AdminUsersPage isDarkMode={isDarkMode} />} />
                            <Route path="/reviews" element={<AdminMessagesPage isDarkMode={isDarkMode} />} />
                            <Route path="/add-product" element={<AddProductPage isDarkMode={isDarkMode} />} />
                            <Route path="/edit-product" element={<EditProductPage isDarkMode={isDarkMode} />} />
                        </Routes>
                    </div>
                </div>
            </div>

            {/* Mobile Quick Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
                <div className="flex justify-around items-center h-16">
                    <Link to="/" className="flex flex-col items-center text-blue-600">
                        <FaHome className="text-xl" />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link to="/admin/dashboard" className="flex flex-col items-center text-gray-600">
                        <FaTachometerAlt className="text-xl" />
                        <span className="text-xs mt-1">Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="flex flex-col items-center text-gray-600">
                        <FaBox className="text-xl" />
                        <span className="text-xs mt-1">Products</span>
                    </Link>
                    <Link to="/admin/orders" className="flex flex-col items-center text-gray-600">
                        <FaShoppingCart className="text-xl" />
                        <span className="text-xs mt-1">Orders</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}