import { useEffect, useState } from "react"
import axios from "axios"
import {
    FaSearch,
    FaFilter,
    FaUsers,
    FaUserShield,
    FaUserCheck,
    FaUserTimes,
    FaEye,
    FaTrash,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaShoppingBag,
    FaTimes,
    FaUserEdit,
    FaLock,
    FaUnlock,
    FaGoogle,
    FaUserCircle,
} from "react-icons/fa"
import { toast } from "react-hot-toast"

export default function AdminUsersPage({ isDarkMode }) {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [selectedUser, setSelectedUser] = useState(null)
    const [showUserDetails, setShowUserDetails] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        let filtered = [...users]

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    `${user.firstName} ${user.lastName}`.trim()?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone?.includes(searchTerm)
            )
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.role === roleFilter)
        }

        setFilteredUsers(filtered)
    }, [searchTerm, roleFilter, users])

    function fetchUsers() {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            setIsLoading(false)
            return
        }

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setUsers(res.data)
                setFilteredUsers(res.data)
                setIsLoading(false)
            })
            .catch((e) => {
                toast.error(
                    "Error fetching users: " +
                        (e.response?.data?.message || "Unknown error")
                )
                setIsLoading(false)
            })
    }

    function updateUserRole(userId, newRole) {
        setIsUpdating(true)
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            setIsUpdating(false)
            return
        }

        axios
            .put(
                import.meta.env.VITE_BACKEND_URL + "/api/users/" + userId + "/role",
                { role: newRole },
                { headers: { Authorization: "Bearer " + token } }
            )
            .then(() => {
                toast.success(`User role updated to ${newRole}`)
                fetchUsers()
                if (selectedUser?._id === userId) {
                    setSelectedUser((prev) => ({ ...prev, role: newRole }))
                }
                setIsUpdating(false)
            })
            .catch((e) => {
                toast.error(
                    "Error updating role: " +
                        (e.response?.data?.message || "Unknown error")
                )
                setIsUpdating(false)
            })
    }

    function toggleUserBlock(userId, isBlocked) {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            return
        }

        axios
            .put(
                import.meta.env.VITE_BACKEND_URL +
                    "/api/users/" +
                    userId +
                    "/block",
                { isBlocked: !isBlocked },
                { headers: { Authorization: "Bearer " + token } }
            )
            .then(() => {
                toast.success(
                    `User ${!isBlocked ? "blocked" : "unblocked"} successfully`
                )
                fetchUsers()
                if (selectedUser?._id === userId) {
                    setSelectedUser((prev) => ({
                        ...prev,
                        isBlocked: !isBlocked,
                    }))
                }
            })
            .catch((e) => {
                toast.error(
                    "Error updating user: " +
                        (e.response?.data?.message || "Unknown error")
                )
            })
    }

    function deleteUser(userId) {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login first")
            return
        }

        axios
            .delete(
                import.meta.env.VITE_BACKEND_URL + "/api/users/" + userId,
                { headers: { Authorization: "Bearer " + token } }
            )
            .then(() => {
                toast.success("User deleted successfully")
                setShowDeleteConfirm(false)
                setUserToDelete(null)
                setShowUserDetails(false)
                fetchUsers()
            })
            .catch((e) => {
                toast.error(
                    "Error deleting user: " +
                        (e.response?.data?.message || "Unknown error")
                )
            })
    }

    const totalUsers = users.length
    const adminUsers = users.filter((u) => u.role === "admin").length
    const activeUsers = users.filter((u) => !u.isBlocked).length
    const blockedUsers = users.filter((u) => u.isBlocked).length

    const getRoleBadge = (role) => {
        if (role === "admin")
            return "bg-purple-100 text-purple-700 border border-purple-200"
        return "bg-blue-100 text-blue-700 border border-blue-200"
    }

    const getStatusBadge = (isBlocked) => {
        if (isBlocked)
            return "bg-red-100 text-red-700 border border-red-200"
        return "bg-green-100 text-green-700 border border-green-200"
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A"
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getInitials = (name) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const avatarColors = [
        "from-blue-500 to-indigo-600",
        "from-purple-500 to-pink-600",
        "from-green-500 to-teal-600",
        "from-orange-500 to-red-600",
        "from-cyan-500 to-blue-600",
    ]

    const getAvatarColor = (name) => {
        if (!name) return avatarColors[0]
        const idx = name.charCodeAt(0) % avatarColors.length
        return avatarColors[idx]
    }

    return (
        <div
            className={`w-full h-full ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
            } overflow-y-auto`}
        >
            {/* Header */}
            <div
                className={`sticky top-0 z-10 ${
                    isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                } border-b p-4 shadow-sm`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Users Management
                    </h1>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-md"
                    >
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                        {
                            label: "Total Users",
                            value: totalUsers,
                            icon: <FaUsers />,
                            color: "from-blue-500 to-indigo-600",
                            bg: isDarkMode
                                ? "bg-blue-900/30 border-blue-800"
                                : "bg-blue-50 border-blue-100",
                            text: "text-blue-600",
                        },
                        {
                            label: "Admins",
                            value: adminUsers,
                            icon: <FaUserShield />,
                            color: "from-purple-500 to-pink-600",
                            bg: isDarkMode
                                ? "bg-purple-900/30 border-purple-800"
                                : "bg-purple-50 border-purple-100",
                            text: "text-purple-600",
                        },
                        {
                            label: "Active",
                            value: activeUsers,
                            icon: <FaUserCheck />,
                            color: "from-green-500 to-teal-600",
                            bg: isDarkMode
                                ? "bg-green-900/30 border-green-800"
                                : "bg-green-50 border-green-100",
                            text: "text-green-600",
                        },
                        {
                            label: "Blocked",
                            value: blockedUsers,
                            icon: <FaUserTimes />,
                            color: "from-red-500 to-orange-600",
                            bg: isDarkMode
                                ? "bg-red-900/30 border-red-800"
                                : "bg-red-50 border-red-100",
                            text: "text-red-600",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`${stat.bg} border rounded-xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.02]`}
                        >
                            <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg shadow-md`}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <p
                                    className={`text-2xl font-bold ${stat.text}`}
                                >
                                    {stat.value}
                                </p>
                                <p
                                    className={`text-xs ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <FaSearch
                            className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-400"
                            }`}
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                            }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FaFilter
                            className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-400"
                            }`}
                        />
                        <select
                            className={`pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm ${
                                isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-200 text-gray-800"
                            }`}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="p-4">
                {isLoading ? (
                    <div className="w-full h-64 flex justify-center items-center">
                        <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div
                        className={`text-center py-16 rounded-xl shadow ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <FaUsers
                            className={`text-6xl mx-auto mb-4 ${
                                isDarkMode ? "text-gray-600" : "text-gray-300"
                            }`}
                        />
                        <p
                            className={`text-xl ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                            } mb-1`}
                        >
                            No users found
                        </p>
                        <p
                            className={`text-sm ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                            Try adjusting your search or filter
                        </p>
                    </div>
                ) : (
                    <div
                        className={`rounded-xl shadow-lg overflow-hidden ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                        <th className="py-3 px-4 text-left">
                                            User
                                        </th>
                                        <th className="py-3 px-4 text-left hidden md:table-cell">
                                            Contact
                                        </th>
                                        <th className="py-3 px-4 text-left hidden lg:table-cell">
                                            Joined
                                        </th>
                                        <th className="py-3 px-4 text-center">
                                            Role
                                        </th>
                                        <th className="py-3 px-4 text-center">
                                            Status
                                        </th>
                                        <th className="py-3 px-4 text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className={`border-b transition-colors ${
                                                isDarkMode
                                                    ? "border-gray-700 hover:bg-gray-700/50"
                                                    : "border-gray-100 hover:bg-blue-50/40"
                                            } ${
                                                index % 2 === 0
                                                    ? ""
                                                    : isDarkMode
                                                    ? "bg-gray-800/50"
                                                    : "bg-gray-50/50"
                                            }`}
                                        >
                                            {/* User Cell */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br ${getAvatarColor(
                                                            `${user.firstName} ${user.lastName}`.trim()
                                                        )} shadow`}
                                                    >
                                                        {user.profileImage ? (
                                                            <img
                                                                src={
                                                                    user.profileImage
                                                                }
                                                                alt={`${user.firstName} ${user.lastName}`.trim()}
                                                                className="w-9 h-9 rounded-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.display =
                                                                        "none"
                                                                }}
                                                            />
                                                        ) : (
                                                            getInitials(
                                                                `${user.firstName} ${user.lastName}`.trim()
                                                            )
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p
                                                            className={`font-semibold ${
                                                                isDarkMode
                                                                    ? "text-white"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {`${user.firstName} ${user.lastName}`.trim() ||
                                                                "Unknown"}
                                                        </p>
                                                        <p
                                                            className={`text-xs ${
                                                                isDarkMode
                                                                    ? "text-gray-400"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    {user.googleId && (
                                                        <FaGoogle
                                                            className="text-red-400 text-xs flex-shrink-0"
                                                            title="Google Account"
                                                        />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3 px-4 hidden md:table-cell">
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {user.phone || (
                                                        <span className="text-gray-400 italic">
                                                            No phone
                                                        </span>
                                                    )}
                                                </p>
                                            </td>

                                            {/* Joined */}
                                            <td className="py-3 px-4 hidden lg:table-cell">
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        user.createdAt
                                                    )}
                                                </p>
                                            </td>

                                            {/* Role */}
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role === "admin" ? (
                                                        <FaUserShield className="text-xs" />
                                                    ) : (
                                                        <FaUserCircle className="text-xs" />
                                                    )}
                                                    {user.role === "admin"
                                                        ? "Admin"
                                                        : "Customer"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                        user.isBlocked
                                                    )}`}
                                                >
                                                    {user.isBlocked ? (
                                                        <>
                                                            <FaLock className="text-xs" />
                                                            Blocked
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaUserCheck className="text-xs" />
                                                            Active
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(
                                                                user
                                                            )
                                                            setShowUserDetails(
                                                                true
                                                            )
                                                        }}
                                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="text-base" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            toggleUserBlock(
                                                                user._id,
                                                                user.isBlocked
                                                            )
                                                        }
                                                        className={`p-2 rounded-full transition-all duration-300 ${
                                                            user.isBlocked
                                                                ? "text-green-500 hover:text-green-700 hover:bg-green-50"
                                                                : "text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                                                        }`}
                                                        title={
                                                            user.isBlocked
                                                                ? "Unblock"
                                                                : "Block"
                                                        }
                                                    >
                                                        {user.isBlocked ? (
                                                            <FaUnlock className="text-base" />
                                                        ) : (
                                                            <FaLock className="text-base" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(
                                                                user
                                                            )
                                                            setShowDeleteConfirm(
                                                                true
                                                            )
                                                        }}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash className="text-base" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div
                            className={`px-4 py-3 border-t ${
                                isDarkMode
                                    ? "border-gray-700 bg-gray-800/50"
                                    : "border-gray-100 bg-gray-50"
                            }`}
                        >
                            <p
                                className={`text-sm ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Showing{" "}
                                <span className="font-semibold text-blue-600">
                                    {filteredUsers.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold">
                                    {users.length}
                                </span>{" "}
                                users
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── User Details Modal ── */}
            {showUserDetails && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div
                        className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-xl">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white bg-gradient-to-br ${getAvatarColor(
                                            selected`${user.firstName} ${user.lastName}`.trim()
                                        )} shadow-lg border-2 border-white/30`}
                                    >
                                        {selectedUser.profileImage ? (
                                            <img
                                                src={selectedUser.profileImage}
                                                alt={selected`${user.firstName} ${user.lastName}`.trim()}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(selected`${user.firstName} ${user.lastName}`.trim())
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {selected`${user.firstName} ${user.lastName}`.trim() || "Unknown"}
                                        </h2>
                                        <p className="text-blue-200 text-sm">
                                            {selectedUser.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                    selectedUser.role === "admin"
                                                        ? "bg-purple-500/30 text-purple-100"
                                                        : "bg-blue-500/30 text-blue-100"
                                                }`}
                                            >
                                                {selectedUser.role}
                                            </span>
                                            {selectedUser.googleId && (
                                                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <FaGoogle className="text-xs" />
                                                    Google
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowUserDetails(false)}
                                    className="text-white/70 hover:text-white text-2xl transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div
                                    className={`rounded-lg p-4 ${
                                        isDarkMode
                                            ? "bg-gray-700/50"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <h3
                                        className={`text-sm font-semibold mb-3 ${
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Contact Info
                                    </h3>
                                    <div className="space-y-2">
                                        <p
                                            className={`text-sm flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            <FaEnvelope className="text-blue-500 flex-shrink-0" />
                                            {selectedUser.email}
                                        </p>
                                        <p
                                            className={`text-sm flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            <FaPhone className="text-blue-500 flex-shrink-0" />
                                            {selectedUser.phone ||
                                                "Not provided"}
                                        </p>
                                        <p
                                            className={`text-sm flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                                            Joined{" "}
                                            {formatDate(
                                                selectedUser.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`rounded-lg p-4 ${
                                        isDarkMode
                                            ? "bg-gray-700/50"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <h3
                                        className={`text-sm font-semibold mb-3 ${
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Account Status
                                    </h3>
                                    <div className="space-y-2">
                                        <p
                                            className={`text-sm flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            <FaUserShield className="text-blue-500 flex-shrink-0" />
                                            Role:{" "}
                                            <span className="font-medium capitalize">
                                                {selectedUser.role}
                                            </span>
                                        </p>
                                        <p
                                            className={`text-sm flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {selectedUser.isBlocked ? (
                                                <FaLock className="text-red-500 flex-shrink-0" />
                                            ) : (
                                                <FaUnlock className="text-green-500 flex-shrink-0" />
                                            )}
                                            Status:{" "}
                                            <span
                                                className={`font-medium ${
                                                    selectedUser.isBlocked
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {selectedUser.isBlocked
                                                    ? "Blocked"
                                                    : "Active"}
                                            </span>
                                        </p>
                                        {selectedUser.lastLogin && (
                                            <p
                                                className={`text-sm flex items-center gap-2 ${
                                                    isDarkMode
                                                        ? "text-gray-300"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                                                Last login:{" "}
                                                {formatDate(
                                                    selectedUser.lastLogin
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Manage Role */}
                            <div
                                className={`rounded-lg p-4 mb-4 ${
                                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                }`}
                            >
                                <h3
                                    className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                                        isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <FaUserEdit className="text-blue-500" />
                                    Change Role
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    {["customer", "admin"].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() =>
                                                updateUserRole(
                                                    selectedUser._id,
                                                    role
                                                )
                                            }
                                            disabled={
                                                selectedUser.role === role ||
                                                isUpdating
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${
                                                selectedUser.role === role
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white cursor-not-allowed"
                                                    : isDarkMode
                                                    ? "bg-gray-600 text-gray-200 hover:from-blue-600 hover:to-indigo-700 hover:bg-gradient-to-r hover:text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 hover:text-white"
                                            }`}
                                        >
                                            {role === "admin" ? (
                                                <span className="flex items-center gap-1">
                                                    <FaUserShield />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <FaUserCircle />
                                                    Customer
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    onClick={() =>
                                        toggleUserBlock(
                                            selectedUser._id,
                                            selectedUser.isBlocked
                                        )
                                    }
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                                        selectedUser.isBlocked
                                            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white hover:border-transparent"
                                            : "bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-500 hover:text-white hover:border-transparent"
                                    }`}
                                >
                                    {selectedUser.isBlocked ? (
                                        <>
                                            <FaUnlock />
                                            Unblock User
                                        </>
                                    ) : (
                                        <>
                                            <FaLock />
                                            Block User
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setUserToDelete(selectedUser)
                                        setShowDeleteConfirm(true)
                                        setShowUserDetails(false)
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-transparent transition-all duration-300"
                                >
                                    <FaTrash />
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {showDeleteConfirm && userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div
                        className={`rounded-xl max-w-md w-full shadow-2xl p-6 ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500 text-2xl" />
                            </div>
                            <h2
                                className={`text-xl font-bold mb-2 ${
                                    isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                            >
                                Delete User
                            </h2>
                            <p
                                className={`text-sm ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }`}
                            >
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-red-500">
                                    {userToDelete.name || userToDelete.email}
                                </span>
                                ? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setUserToDelete(null)
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors ${
                                    isDarkMode
                                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteUser(userToDelete._id)}
                                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
