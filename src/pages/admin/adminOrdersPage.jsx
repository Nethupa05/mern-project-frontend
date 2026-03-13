import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FaEye, FaSearch, FaFilter, FaSortAmountDown, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Format currency in LKR
    const formatLKR = (amount) => {
        return `LKR ${Number(amount).toFixed(2)}`;
    }

    // Status color mapping
    const statusColors = {
        "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Processing": "bg-blue-100 text-blue-800 border-blue-200",
        "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
        "Delivered": "bg-green-100 text-green-800 border-green-200",
        "Cancelled": "bg-red-100 text-red-800 border-red-200",
        "Refunded": "bg-gray-100 text-gray-800 border-gray-200"
    }

    const statusIcons = {
        "Pending": <FaClock className="inline mr-1" />,
        "Processing": <FaClock className="inline mr-1" />,
        "Shipped": <FaCheckCircle className="inline mr-1" />,
        "Delivered": <FaCheckCircle className="inline mr-1" />,
        "Cancelled": <FaTimesCircle className="inline mr-1" />,
        "Refunded": <FaTimesCircle className="inline mr-1" />
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        // Filter orders based on search term and status
        let filtered = [...orders]
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm)
            )
        }
        
        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter)
        }
        
        setFilteredOrders(filtered)
    }, [searchTerm, statusFilter, orders])

    function fetchOrders() {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            setIsLoading(false)
            return
        }
        
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((res) => {
            setOrders(res.data)
            setFilteredOrders(res.data)
            setIsLoading(false)
        }).catch((e) => {
            toast.error("Error fetching orders: " + (e.response?.data?.message || "Unknown error"))
            setIsLoading(false)
        })
    }

    function updateOrderStatus(orderId, newStatus) {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            return
        }

        axios.put(import.meta.env.VITE_BACKEND_URL + "/api/orders/" + orderId + "/status", 
            { status: newStatus },
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        ).then((res) => {
            toast.success(`Order status updated to ${newStatus}`)
            fetchOrders() // Refresh orders
            setShowOrderDetails(false)
        }).catch((e) => {
            toast.error("Error updating order: " + (e.response?.data?.message || "Unknown error"))
        })
    }

    function viewOrderDetails(order) {
        setSelectedOrder(order)
        setShowOrderDetails(true)
    }

    // Calculate summary statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === "Pending").length
    const deliveredOrders = orders.filter(order => order.status === "Delivered").length

    // Mobile card view for orders
    const OrderCard = ({ order }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-accent">{order.orderId}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusIcons[order.status]}
                    {order.status}
                </span>
            </div>
            
            <div className="space-y-2 mb-3">
                <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm font-medium">{order.name}</p>
                    <p className="text-xs text-gray-600">{order.email}</p>
                </div>
                
                <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm">{order.phone}</p>
                </div>
                
                <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm truncate">{order.address}</p>
                </div>
                
                <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm">
                        {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatLKR(order.total)}</p>
                </div>
                <button
                    onClick={() => viewOrderDetails(order)}
                    className="p-3 text-accent hover:text-accent/70 hover:bg-accent/10 rounded-full transition-all duration-300"
                    title="View Order Details"
                >
                    <FaEye className="text-xl" />
                </button>
            </div>
        </div>
    )

    return (
        <div className="w-full h-full bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-white border-b border-accent/20 p-4 sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-accent">Orders Management</h1>
                    <button 
                        onClick={fetchOrders}
                        className="w-full sm:w-auto px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
                    >
                        Refresh Orders
                    </button>
                </div>

                {/* Stats Cards - Scrollable on mobile */}
                <div className="overflow-x-auto pb-2 -mx-1 px-1">
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 min-w-[320px]">
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Total</p>
                            <p className="text-sm sm:text-2xl font-bold text-accent">{totalOrders}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Revenue</p>
                            <p className="text-sm sm:text-2xl font-bold text-green-600 truncate">{formatLKR(totalRevenue)}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Pending</p>
                            <p className="text-sm sm:text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Delivered</p>
                            <p className="text-sm sm:text-2xl font-bold text-green-600">{deliveredOrders}</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col gap-3 mt-3">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filter Button for Mobile */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex-1 sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium"
                        >
                            <FaFilter className="text-gray-600" />
                            {statusFilter === "all" ? "All Status" : statusFilter}
                        </button>
                        
                        {/* Desktop Filter */}
                        <div className="hidden sm:block relative flex-1">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-white text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filter Dropdown */}
                    {showMobileFilters && (
                        <div className="sm:hidden bg-white border border-gray-300 rounded-lg p-2">
                            {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status)
                                        setShowMobileFilters(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                                        statusFilter === status 
                                            ? 'bg-accent text-white' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {status === "all" ? "All Status" : status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Display */}
            <div className="p-4">
                {isLoading ? (
                    <div className="w-full h-64 flex justify-center items-center">
                        <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-lg sm:text-xl text-gray-500 mb-2">No orders found</p>
                        <p className="text-sm sm:text-base text-gray-400">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile View - Cards */}
                        <div className="block sm:hidden">
                            {filteredOrders.map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden sm:block bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-accent text-white">
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Order ID</th>
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Customer</th>
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Contact</th>
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Address</th>
                                            <th className="py-3 px-4 text-right whitespace-nowrap">Total (LKR)</th>
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Date</th>
                                            <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
                                            <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order, index) => (
                                            <tr 
                                                key={order._id} 
                                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                            >
                                                <td className="py-3 px-4 font-medium text-accent whitespace-nowrap">
                                                    {order.orderId}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium whitespace-nowrap">{order.name}</p>
                                                        <p className="text-xs text-gray-500 whitespace-nowrap">{order.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <p className="text-sm">{order.phone}</p>
                                                </td>
                                                <td className="py-3 px-4 max-w-[200px]">
                                                    <p className="text-sm truncate" title={order.address}>
                                                        {order.address}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">
                                                    {formatLKR(order.total)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {new Date(order.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                        {statusIcons[order.status]}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => viewOrderDetails(order)}
                                                        className="p-2 text-accent hover:text-accent/70 hover:bg-accent/10 rounded-full transition-all duration-300"
                                                        title="View Order Details"
                                                    >
                                                        <FaEye className="text-lg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer with count */}
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                                    <span className="font-medium">{orders.length}</span> orders
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Order Details Modal - Mobile Optimized */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-accent">Order Details</h2>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Order Info - Stack on mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Order ID:</span> {selectedOrder.orderId}</p>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Date:</span> {new Date(selectedOrder.date).toLocaleString()}</p>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Status:</span> 
                                        <span className={`ml-2 inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Name:</span> {selectedOrder.name}</p>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Email:</span> {selectedOrder.email}</p>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Phone:</span> {selectedOrder.phone}</p>
                                    <p className="text-sm sm:text-base"><span className="text-gray-600">Address:</span> {selectedOrder.address}</p>
                                </div>
                            </div>

                            {/* Products List - Mobile optimized */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
                                <div className="space-y-3">
                                    {selectedOrder.products.map((item, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <img 
                                                src={item.productInfo.images[0]} 
                                                alt={item.productInfo.name}
                                                className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm sm:text-base">{item.productInfo.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-600">Product ID: {item.productInfo.productId}</p>
                                                <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-semibold text-sm sm:text-base">{formatLKR(item.productInfo.price)}</p>
                                                <p className="text-xs sm:text-sm text-gray-600">Subtotal: {formatLKR(item.productInfo.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-200 pt-4 mb-4 sm:mb-6">
                                <div className="flex justify-between items-center text-base sm:text-lg">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="font-bold text-accent">{formatLKR(selectedOrder.total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mt-1">
                                    <span>Labelled Total:</span>
                                    <span className="line-through">{formatLKR(selectedOrder.labelledTotal || 0)}</span>
                                </div>
                            </div>

                            {/* Update Status - Scrollable on mobile */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-700 mb-3">Update Order Status</h3>
                                <div className="flex flex-wrap gap-2 max-h-40 sm:max-h-none overflow-y-auto sm:overflow-visible pb-2">
                                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                            disabled={selectedOrder.status === status}
                                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                                                selectedOrder.status === status
                                                    ? 'bg-accent text-white cursor-not-allowed'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-accent hover:text-white'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}