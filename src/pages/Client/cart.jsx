import { BiMinus, BiPlus, BiTrash, BiShoppingBag, BiArrowBack } from "react-icons/bi"
import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function CartPage(){
    const [cart, setCart] = useState(getCart())
    const [total, setTotal] = useState(getTotal())

    useEffect(() => {
        setTotal(getTotal())
    }, [cart])

    const formatCurrency = (amount) => {
        return `LKR ${amount.toFixed(2)}`
    }

    // Calculate savings
    const calculateSavings = () => {
        return cart.reduce((acc, item) => {
            if (item.labelledPrice > item.sellingPrice) {
                return acc + ((item.labelledPrice - item.sellingPrice) * item.qty)
            }
            return acc
        }, 0)
    }

    const savings = calculateSavings()

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/products" 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <BiArrowBack className="text-xl text-gray-600" />
                            </Link>
                            <h1 className="text-2xl font-bold text-accent">Shopping Cart</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <BiShoppingBag className="text-accent text-xl" />
                            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                {cart.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="bg-white rounded-full p-8 shadow-lg mb-6">
                            <BiShoppingBag className="text-6xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6 text-center">Looks like you haven't added anything to your cart yet</p>
                        <Link 
                            to="/products" 
                            className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Cart Items - Left Column */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => {
                                const itemTotal = item.sellingPrice * item.qty
                                const hasDiscount = item.labelledPrice > item.sellingPrice
                                const discountPercentage = hasDiscount 
                                    ? Math.round(((item.labelledPrice - item.sellingPrice) / item.labelledPrice) * 100)
                                    : 0

                                return (
                                    <div 
                                        key={item.productId} 
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                    >
                                        <div className="p-4">
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="w-24 h-24 flex-shrink-0">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/96?text=No+Image'
                                                        }}
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mb-2">{item.productId}</p>
                                                            
                                                            {/* Price */}
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {hasDiscount ? (
                                                                    <>
                                                                        <span className="text-sm text-gray-400 line-through">
                                                                            {formatCurrency(item.labelledPrice)}
                                                                        </span>
                                                                        <span className="text-lg font-bold text-accent">
                                                                            {formatCurrency(item.sellingPrice)}
                                                                        </span>
                                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                                            {discountPercentage}% OFF
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-lg font-bold text-accent">
                                                                        {formatCurrency(item.sellingPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Delete Button */}
                                                        <button 
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            onClick={() => {
                                                                removeFromCart(item.productId)
                                                                setCart(getCart())
                                                            }}
                                                        >
                                                            <BiTrash size={20} />
                                                        </button>
                                                    </div>

                                                    {/* Quantity Controls and Item Total */}
                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                className="w-8 h-8 bg-gray-100 hover:bg-accent hover:text-white rounded-lg transition-colors flex items-center justify-center text-gray-600"
                                                                onClick={() => {
                                                                    addToCart(item, -1)
                                                                    setCart(getCart())
                                                                }}
                                                                disabled={item.qty <= 1}
                                                            >
                                                                <BiMinus />
                                                            </button>
                                                            <span className="w-8 text-center font-semibold">
                                                                {item.qty}
                                                            </span>
                                                            <button 
                                                                className="w-8 h-8 bg-gray-100 hover:bg-accent hover:text-white rounded-lg transition-colors flex items-center justify-center text-gray-600"
                                                                onClick={() => {
                                                                    addToCart(item, 1)
                                                                    setCart(getCart())
                                                                }}
                                                            >
                                                                <BiPlus />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">Item Total</p>
                                                            <p className="text-lg font-bold text-accent">
                                                                {formatCurrency(itemTotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                    
                                    {savings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Total Savings</span>
                                            <span>- {formatCurrency(savings)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 my-3 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800">Total</span>
                                            <span className="text-2xl font-bold text-accent">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right mt-1">
                                            Inclusive of all taxes
                                        </p>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link 
                                    to="/checkout" 
                                    state={{ cart: cart }}
                                    className="block w-full bg-accent text-white text-center py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl mb-3"
                                >
                                    Proceed to Checkout
                                </Link>

                                {/* Continue Shopping */}
                                <Link 
                                    to="/products" 
                                    className="block w-full text-center text-accent hover:underline"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Payment Methods */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center mb-2">
                                        We accept:
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <span className="text-sm font-semibold text-gray-600">Visa</span>
                                        <span className="text-sm font-semibold text-gray-600">Mastercard</span>
                                        <span className="text-sm font-semibold text-gray-600">Amex</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recently Viewed (Optional) */}
            {cart.length > 0 && (
                <div className="bg-white mt-8 py-6">
                    <div className="container mx-auto px-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">You might also like</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* This would be populated with recommended products */}
                            <div className="text-center text-gray-500 text-sm">
                                <p>Recommendations based on your cart</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}