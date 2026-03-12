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
    FaSyncAlt
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

    // Calculate stats
    const totalMessages = messages.length
    const unreadCount = messages.filter(m => !m.isRead).length
    const readCount = messages.filter(m => m.isRead).length
    const responseRate = totalMessages > 0 ? Math.round((readCount / totalMessages) * 100) : 0

    return (
        <div className="w-full h-full bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-accent/20 p-6 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
                            <FaEnvelope className="text-accent" />
                            Contact Messages
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {totalMessages > 0 
                                ? `You have ${unreadCount} unread message${unreadCount !== 1 ? 's' : ''} out of ${totalMessages} total`
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
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <FaSyncAlt className={`${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white border border-accent/20 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Total Messages</p>
                        <p className="text-2xl font-bold text-accent">{totalMessages}</p>
                    </div>
                    <div className="bg-white border border-accent/20 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Unread</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {unreadCount}
                        </p>
                    </div>
                    <div className="bg-white border border-accent/20 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Read</p>
                        <p className="text-2xl font-bold text-green-600">
                            {readCount}
                        </p>
                    </div>
                    <div className="bg-white border border-accent/20 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Response Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {responseRate}%
                        </p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or message..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                if (e.target.value) {
                                    toast.success(`Searching: "${e.target.value}"`, { id: "search", duration: 1000 })
                                }
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-white"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    const filterText = {
                                        all: "Showing all messages",
                                        unread: "Showing unread messages only",
                                        read: "Showing read messages only"
                                    }[e.target.value]
                                    toast.success(filterText, { duration: 2000 })
                                }}
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="p-6">
                {isLoading ? (
                    <div className="w-full h-64 flex flex-col justify-center items-center">
                        <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Loading messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-500 mb-2">No messages found</p>
                        <p className="text-gray-400">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search or filter criteria" 
                                : "No contact messages yet"}
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    toast.success("Filters cleared")
                                }}
                                className="mt-4 px-4 py-2 text-accent hover:text-accent/80 underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            Showing {filteredMessages.length} of {messages.length} messages
                        </p>
                        <div className="space-y-4">
                            {filteredMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => viewMessageDetails(msg)}
                                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
                                        msg.isRead ? 'border-l-gray-300' : 'border-l-accent'
                                    }`}
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
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Message Details Modal */}
            {showMessageModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-accent">Message Details</h2>
                                <button
                                    onClick={() => {
                                        setShowMessageModal(false)
                                        setSelectedMessage(null)
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Sender Info */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Sender Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedMessage.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedMessage.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{formatDate(selectedMessage.createdAt || selectedMessage.date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Message</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        window.location.href = `mailto:${selectedMessage.email}?subject=Re: Your message to our store`
                                        toast.success("Email client opened", { duration: 3000 })
                                    }}
                                    disabled={actionInProgress}
                                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaReply /> Reply via Email
                                </button>
                                <button
                                    onClick={() => deleteMessage(selectedMessage._id)}
                                    disabled={actionInProgress}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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