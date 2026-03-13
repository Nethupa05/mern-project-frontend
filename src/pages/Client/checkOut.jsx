import { BiMinus, BiPlus, BiTrash, BiArrowBack, BiMap, BiPhone, BiCreditCard } from "react-icons/bi"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage(){
    const location = useLocation()
    const [cart, setCart] = useState(location.state?.cart || [])
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const navigate = useNavigate()

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.qty), 0)
    const labelledTotal = cart.reduce((sum, item) => sum + (item.labelledPrice * item.qty), 0)
    const totalSavings = labelledTotal - subtotal
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

    function changeQty(index, qty){
        const newQty = cart[index].qty + qty;
        if(newQty <= 0){
            removeFromCart(index);
            return
        }else{
            const newCart = [...cart]
            newCart[index].qty = newQty;
            setCart(newCart)
        }
    }

    function removeFromCart(index){
        const newCart = cart.filter((item, i) => i !== index)
        setCart(newCart)
        toast.success("Item removed from cart")
    }

    async function PlaceOrder(){
        const token = localStorage.getItem("token");
        if(!token){
            toast.error("Please Login First")
            navigate("/login")
            return
        }

        if(!phoneNumber || !address){
            toast.error("Please fill in all delivery details")
            return
        }

        if(phoneNumber.length < 10) {
            toast.error("Please enter a valid phone number")
            return
        }

        setIsPlacingOrder(true)

        const orderInformation = {
            products: cart.map(item => ({
                productId: item.productId,
                quantity: item.qty
            })),
            phone: phoneNumber,
            address: address,
            total: subtotal,
            labelledTotal: labelledTotal
        }

        try{
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders", orderInformation, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            
            toast.success("Order Placed Successfully!")
            
            // Clear cart from localStorage
            localStorage.removeItem("cart")
            
            // Navigate to order confirmation
            // setTimeout(() => {
            //     navigate("/order-confirmation", { 
            //         state: { 
            //             orderNumber: "ORD" + Date.now(),
            //             total: subtotal
            //         } 
            //     })
            // }, 2000)
            
        } catch(err) {
            console.log("ORDER ERROR:", err.response?.data || err.message)
            toast.error(err.response?.data?.message || "Error placing order")
        } finally {
            setIsPlacingOrder(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BiCreditCard className="text-4xl text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link 
                        to="/products" 
                        className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/cart" 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <BiArrowBack className="text-xl text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-accent">Checkout</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <BiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="tel" 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="07X XXX XXXX" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Delivery Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <BiMap className="absolute left-3 top-3 text-gray-400" />
                                        <textarea 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                                            placeholder="Street address, city, postal code"
                                            rows="3"
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Order Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                            </h2>
                            <div className="space-y-4">
                                {cart.map((item, index) => {
                                    const itemTotal = item.sellingPrice * item.qty
                                    const hasDiscount = item.labelledPrice > item.sellingPrice
                                    const discountPercentage = hasDiscount 
                                        ? Math.round(((item.labelledPrice - item.sellingPrice) / item.labelledPrice) * 100)
                                        : 0

                                    return (
                                        <div 
                                            key={item.productId} 
                                            className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                        >
                                            {/* Product Image */}
                                            <div className="w-20 h-20 flex-shrink-0">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/80?text=No+Image'
                                                    }}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mb-1">{item.productId}</p>
                                                        
                                                        {/* Price */}
                                                        <div className="flex items-center gap-2">
                                                            {hasDiscount ? (
                                                                <>
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        LKR {item.labelledPrice.toFixed(2)}
                                                                    </span>
                                                                    <span className="font-bold text-accent">
                                                                        LKR {item.sellingPrice.toFixed(2)}
                                                                    </span>
                                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                                        {discountPercentage}% OFF
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-bold text-accent">
                                                                    LKR {item.sellingPrice.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button 
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        onClick={() => removeFromCart(index)}
                                                        title="Remove item"
                                                    >
                                                        <BiTrash size={18} />
                                                    </button>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            className="w-8 h-8 bg-gray-100 hover:bg-accent hover:text-white rounded-lg transition-colors flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => changeQty(index, -1)}
                                                            disabled={item.qty <= 1}
                                                        >
                                                            <BiMinus />
                                                        </button>
                                                        <span className="w-8 text-center font-medium">
                                                            {item.qty}
                                                        </span>
                                                        <button 
                                                            className="w-8 h-8 bg-gray-100 hover:bg-accent hover:text-white rounded-lg transition-colors flex items-center justify-center text-gray-600"
                                                            onClick={() => changeQty(index, 1)}
                                                        >
                                                            <BiPlus />
                                                        </button>
                                                    </div>
                                                    <span className="font-bold text-accent">
                                                        LKR {itemTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>LKR {subtotal.toFixed(2)}</span>
                                </div>
                                
                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Total Savings</span>
                                        <span>- LKR {totalSavings.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                
                                <div className="border-t border-gray-200 my-3 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-accent">
                                                LKR {subtotal.toFixed(2)}
                                            </span>
                                            {totalSavings > 0 && (
                                                <p className="text-xs text-green-600">
                                                    You save LKR {totalSavings.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button 
                                className={`w-full bg-accent text-white py-4 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl mb-3 flex items-center justify-center gap-2 ${
                                    isPlacingOrder ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                                onClick={PlaceOrder}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Placing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {/* Back to Cart Link */}
                            <Link 
                                to="/cart" 
                                className="block w-full text-center text-accent hover:underline"
                            >
                                Return to Cart
                            </Link>

                            {/* Payment Methods */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 text-center mb-3">
                                    Secure payment powered by
                                </p>
                                <div className="flex justify-center gap-4">
                                    <span className="text-sm font-semibold text-gray-600">Visa</span>
                                    <span className="text-sm font-semibold text-gray-600">Mastercard</span>
                                    <span className="text-sm font-semibold text-gray-600">Amex</span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400">
                                    🔒 Your payment information is secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}