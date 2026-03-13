import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { 
    FaEnvelope, 
    FaUser, 
    FaCalendarAlt, 
    FaTrash, 
    FaReply,
    FaCheckCircle,
    FaExclamationCircle,
    FaSearch,
    FaFilter,
    FaSyncAlt,
    FaPhone,
    FaChevronDown,
    FaTimes
} from "react-icons/fa"

export default function AdminMessagesPage(){
    const [messages, setMessages] = useState([])
    const [filteredMessages, setFilteredMessages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all") // all, read, unread
    const [actionInProgress, setActionInProgress] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [expandedMessageId, setExpandedMessageId] = useState(null)

    useEffect(() => {
        fetchMessages()
    }, [])

    useEffect(() => {
        // Filter messages based on search term and status
        let filtered = [...messages]
        
        if (searchTerm) {
            filtered = filtered.filter(msg => 
                msg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        
        if (statusFilter === "read") {
            filtered = filtered.filter(msg => msg.isRead)
        } else if (statusFilter === "unread") {
            filtered = filtered.filter(msg => !msg.isRead)
        }
        
        setFilteredMessages(filtered)
    }, [searchTerm, statusFilter, messages])

    function fetchMessages() {
        setIsLoading(true)
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/contact")
            .then((res) => {
                setMessages(res.data)
                setFilteredMessages(res.data)
                setIsLoading(false)
                if (res.data.length === 0) {
                    toast.success("No messages found")
                } else {
                    toast.success(`Loaded ${res.data.length} messages`)
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                toast.error(error.response?.data?.message || "Failed to fetch messages")
                setIsLoading(false)
            })
    }

    function markAsRead(messageId) {
        if (actionInProgress) return
        
        setActionInProgress(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
            toast.error("Authentication required")
            setActionInProgress(false)
            return
        }

        axios.patch(import.meta.env.VITE_BACKEND_URL + "/api/contact/" + messageId + "/read", {}, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(() => {
            toast.success("Message marked as read", {
                icon: '✓',
                duration: 3000
            })
            fetchMessages()
        }).catch((error) => {
            console.error("Mark as read error:", error)
            toast.error(error.response?.data?.message || "Failed to mark as read")
        }).finally(() => {
            setActionInProgress(false)
        })
    }

    function deleteMessage(messageId) {
        if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) return
        
        if (actionInProgress) return
        
        setActionInProgress(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
            toast.error("Authentication required")
            setActionInProgress(false)
            return
        }

        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/contact/" + messageId, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(() => {
            toast.success("Message deleted successfully", {
                icon: '🗑️',
                duration: 3000
            })
            fetchMessages()
            if (selectedMessage?._id === messageId) {
                setShowMessageModal(false)
                setSelectedMessage(null)
            }
            if (expandedMessageId === messageId) {
                setExpandedMessageId(null)
            }
        }).catch((error) => {
            console.error("Delete error:", error)
            toast.error(error.response?.data?.message || "Failed to delete message")
        }).finally(() => {
            setActionInProgress(false)
        })
    }

    function viewMessageDetails(message) {
        setSelectedMessage(message)
        setShowMessageModal(true)
        if (!message.isRead) {
            toast.loading("Marking message as read...", { id: "markAsRead" })
            markAsRead(message._id)
            toast.dismiss("markAsRead")
        }
    }

    function toggleMessageExpand(messageId) {
        setExpandedMessageId(expandedMessageId === messageId ? null : messageId)
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Date not available"
        
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Invalid date"
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return "Date error"
        }
    }

    // Format date for mobile (shorter version)
    const formatMobileDate = (dateString) => {
        if (!dateString) return ""
        
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return ""
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return ""
        }
    }

    // Calculate stats
    const totalMessages = messages.length
    const unreadCount = messages.filter(m => !m.isRead).length
    const readCount = messages.filter(m => m.isRead).length
    const responseRate = totalMessages > 0 ? Math.round((readCount / totalMessages) * 100) : 0

    // Mobile Message Card Component
    const MobileMessageCard = ({ msg }) => {
        const isExpanded = expandedMessageId === msg._id
        
        return (
            <div
                className={`bg-white rounded-lg shadow-md mb-3 border-l-4 ${
                    msg.isRead ? 'border-l-gray-300' : 'border-l-accent'
                } ${isExpanded ? 'shadow-lg' : ''}`}
            >
                {/* Header - Always visible */}
                <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleMessageExpand(msg._id)}
                >
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                            msg.isRead ? 'bg-gray-100' : 'bg-accent/10'
                        }`}>
                            <FaUser className={msg.isRead ? 'text-gray-500' : 'text-accent'} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="truncate">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {msg.firstName} {msg.lastName}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                                </div>
                                
                                {!msg.isRead && (
                                    <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                    {formatMobileDate(msg.createdAt || msg.date)}
                                </span>
                                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        {/* Message Preview */}
                        <div className="mb-3">
                            <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                                {msg.message}
                            </p>
                            <button
                                onClick={() => viewMessageDetails(msg)}
                                className="text-accent text-sm font-medium"
                            >
                                Read full message
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            {!msg.isRead && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(msg._id)
                                    }}
                                    disabled={actionInProgress}
                                    className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1 text-sm"
                                >
                                    <FaCheckCircle className="text-sm" />
                                    <span>Mark Read</span>
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteMessage(msg._id)
                                }}
                                disabled={actionInProgress}
                                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1 text-sm"
                            >
                                <FaTrash className="text-sm" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-white border-b border-accent/20 p-4 sm:p-6 sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-accent flex items-center gap-2">
                            <FaEnvelope className="text-accent" />
                            Contact Messages
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {totalMessages > 0 
                                ? `${unreadCount} unread of ${totalMessages} total`
                                : "No messages to display"
                            }
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            toast.loading("Refreshing messages...", { id: "refresh" })
                            fetchMessages()
                            toast.dismiss("refresh")
                        }}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FaSyncAlt className={`${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Stats Cards - Scrollable on mobile */}
                <div className="overflow-x-auto pb-2 -mx-2 px-2">
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 min-w-[320px]">
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Total</p>
                            <p className="text-sm sm:text-2xl font-bold text-accent">{totalMessages}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Unread</p>
                            <p className="text-sm sm:text-2xl font-bold text-yellow-600">{unreadCount}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Read</p>
                            <p className="text-sm sm:text-2xl font-bold text-green-600">{readCount}</p>
                        </div>
                        <div className="bg-white border border-accent/20 rounded-lg p-2 sm:p-4 shadow-sm">
                            <p className="text-[10px] sm:text-sm text-gray-600 truncate">Response</p>
                            <p className="text-sm sm:text-2xl font-bold text-blue-600">{responseRate}%</p>
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
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filter Controls */}
                    <div className="flex gap-2">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex-1 sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium"
                        >
                            <FaFilter className="text-gray-600" />
                            {statusFilter === "all" ? "All" : statusFilter === "read" ? "Read" : "Unread"}
                        </button>

                        {/* Desktop Filter */}
                        <div className="hidden sm:block relative">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-white text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>
                        </div>

                        {/* Clear Filters Button - Shows when filters are active */}
                        {(searchTerm || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setShowMobileFilters(false)
                                    toast.success("Filters cleared")
                                }}
                                className="px-4 py-2.5 text-accent border border-accent rounded-lg hover:bg-accent/5 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                                <FaTimes className="sm:hidden" />
                                <span className="hidden sm:inline">Clear Filters</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter Dropdown */}
                    {showMobileFilters && (
                        <div className="sm:hidden bg-white border border-gray-300 rounded-lg p-2">
                            {[
                                { value: "all", label: "All Messages" },
                                { value: "unread", label: "Unread Only" },
                                { value: "read", label: "Read Only" }
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => {
                                        setStatusFilter(filter.value)
                                        setShowMobileFilters(false)
                                        toast.success(`Showing ${filter.label.toLowerCase()}`)
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm ${
                                        statusFilter === filter.value 
                                            ? 'bg-accent text-white' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages List */}
            <div className="p-4 sm:p-6">
                {isLoading ? (
                    <div className="w-full h-64 flex flex-col justify-center items-center">
                        <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Loading messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FaEnvelope className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-lg sm:text-xl text-gray-500 mb-2">No messages found</p>
                        <p className="text-sm sm:text-base text-gray-400">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search or filter criteria" 
                                : "No contact messages yet"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <p className="text-xs sm:text-sm text-gray-500 mb-3">
                            Showing {filteredMessages.length} of {messages.length} messages
                        </p>

                        {/* Messages List - Responsive */}
                        <div className="space-y-3 sm:space-y-4">
                            {filteredMessages.map((msg) => (
                                <div key={msg._id}>
                                    {/* Mobile View - Card with expandable content */}
                                    <div className="block sm:hidden">
                                        <MobileMessageCard msg={msg} />
                                    </div>

                                    {/* Desktop View - Full card */}
                                    <div
                                        onClick={() => viewMessageDetails(msg)}
                                        className="hidden sm:block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
                                            msg.isRead ? 'border-l-gray-300' : 'border-l-accent'
                                        }"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            msg.isRead ? 'bg-gray-100' : 'bg-accent/10'
                                                        }`}>
                                                            <FaUser className={msg.isRead ? 'text-gray-500' : 'text-accent'} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-lg">
                                                                {msg.firstName} {msg.lastName}
                                                                {!msg.isRead && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                                        <FaExclamationCircle className="mr-1" />
                                                                        New
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FaEnvelope className="text-xs" />
                                                                    {msg.email}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <FaCalendarAlt className="text-xs" />
                                                                    {formatDate(msg.createdAt || msg.date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-700 mt-3 line-clamp-2">
                                                        {msg.message}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    {!msg.isRead && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAsRead(msg._id)
                                                            }}
                                                            disabled={actionInProgress}
                                                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Mark as Read"
                                                        >
                                                            <FaCheckCircle />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteMessage(msg._id)
                                                        }}
                                                        disabled={actionInProgress}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Message"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Message Details Modal - Mobile Optimized */}
            {showMessageModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-accent">Message Details</h2>
                                <button
                                    onClick={() => {
                                        setShowMessageModal(false)
                                        setSelectedMessage(null)
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Sender Info - Responsive grid */}
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Sender Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Name</p>
                                        <p className="text-sm sm:text-base font-medium">
                                            {selectedMessage.firstName} {selectedMessage.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                                        <p className="text-sm sm:text-base font-medium break-words">
                                            {selectedMessage.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                                        <p className="text-sm sm:text-base font-medium">
                                            {selectedMessage.phone || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Date</p>
                                        <p className="text-sm sm:text-base font-medium">
                                            {formatDate(selectedMessage.createdAt || selectedMessage.date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Message</h3>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions - Stack on mobile */}
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        window.location.href = `mailto:${selectedMessage.email}?subject=Re: Your message to our store`
                                        toast.success("Email client opened", { duration: 3000 })
                                    }}
                                    disabled={actionInProgress}
                                    className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    <FaReply /> Reply via Email
                                </button>
                                <button
                                    onClick={() => deleteMessage(selectedMessage._id)}
                                    disabled={actionInProgress}
                                    className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}