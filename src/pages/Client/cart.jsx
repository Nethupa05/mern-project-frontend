// import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"
// import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart"
// import { useState } from "react"
// import { Link } from "react-router-dom"

// export default function CartPage(){
//     const [cart, setCart] = useState(getCart())

//     return(
//         <div className="w-full h-full flex flex-col items-center pt-4 relative">
//             <div className="w-[300px] h-[80px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center">
//                 <p className="text-2xl font-bold text-secondary">Total:
//                     <span className="mx-2 font-bold text-accent text-2xl">
//                         {getTotal().toFixed(2)}
//                     </span>
//                 </p>
//                 <Link to="/checkout" state={
//                     {
//                         cart : cart,
                        
//                     }
//                 } className="w-full h-[50px] bg-accent text-white text-2xl font-bold flex justify-center items-center hover:bg-secondary cursor-pointer">
//                     Checkout
//                 </Link> 
//             </div>
//             {
//                 cart.map(
//                     (item)=>{
//                         return(
//                             <div key={item.productId} className="w-[600px] h-[100px] my-4 bg-blue-200 rounded-tl-3xl rounded-bl-3xl bg-primary shadow-2xl flex flex-row relative items-center">
//                                 <img src={item.image} className="w-[100px] h-[100px] object-cover rounded-3xl"/>
//                                 <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
//                                     <h1 className="text-xl text-secondary font-semibold">{item.name}</h1>
//                                     <h1 className="text-md text-secondary font-semibold">{item.productId}</h1>
//                                     {
//                                         item.labelledPrice > item.sellingPrice ?
//                                         <div>
//                                             <span className="text-md mx-1 text-gray-500 line-through">{item.labelledPrice.toFixed(2)}</span>
//                                             <span className="text-md mx-1 font-bold text-accent">{item.sellingPrice.toFixed(2)}</span>
//                                         </div>
//                                         :<span className="text-md mx-1 font-bold text-accent">{item.sellingPrice.toFixed(2)}</span>
//                                     }                                        
//                                 </div>
//                                 <div className="max-w-[100px] w-[100px] h-full flex flex-row justify-between items-center">
//                                     <button className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent" onClick={()=>{
//                                         addToCart(item , -1)
//                                         setCart(getCart())
//                                     }}><BiMinus/></button>
//                                     <h1 className="text-xl text-secondary font-semibold h-full flex items-center">{item.qty}</h1>
//                                     <button className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent" onClick={()=>{
//                                         addToCart(item , 1)
//                                         setCart(getCart())
//                                     }}><BiPlus/></button>
//                                 </div>
//                                 {/* total */}
//                                 <div className="w-[200px] h-full flex flex-col justify-center items-center">
//                                     <h1 className="text-2xl text-secondary font-semibold">{(item.sellingPrice*item.qty).toFixed(2)}</h1>
//                                 </div>
//                                 <button className="absolute hover:bg-red-600 text-red-600 hover:text-white cursor-pointer rounded-full p-2 right-[-40px]" onClick={()=>{
//                                     removeFromCart(item.productId)
//                                     setCart(getCart())
//                                 }}>
//                                     <BiTrash/>
//                                 </button>
//                             </div>
//                         )
//                     }
//                 )
//             }
//         </div>
//     )
// }







import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"
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

    return(
        <div className="w-full min-h-screen bg-white">
            {/* Desktop View - Hidden on mobile */}
            <div className="hidden md:block w-full h-full pt-4 relative">
                {/* Desktop Total Card */}
                <div className="w-[300px] h-[80px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center bg-white z-10">
                    <p className="text-2xl font-bold text-secondary">
                        Total:
                        <span className="mx-2 font-bold text-accent text-2xl">
                            {formatCurrency(total)}
                        </span>
                    </p>
                    <Link 
                        to="/checkout" 
                        state={{ cart: cart }}
                        className="w-full h-[50px] bg-accent text-white text-2xl font-bold flex justify-center items-center hover:bg-secondary cursor-pointer"
                    >
                        Checkout
                    </Link>
                </div>

                {/* Desktop Cart Items */}
                <div className="w-full flex flex-col items-center pt-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-600">Your cart is empty</p>
                            <Link to="/products" className="text-accent hover:underline mt-2 inline-block">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => {
                            return (
                                <div 
                                    key={item.productId} 
                                    className="w-[600px] relative my-4"
                                >
                                    <div className="w-[600px] h-[100px] bg-blue-200 rounded-tl-3xl rounded-bl-3xl bg-primary shadow-2xl flex flex-row relative items-center">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-[100px] h-[100px] object-cover rounded-3xl"
                                        />
                                        <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
                                            <h1 className="text-xl text-secondary font-semibold">{item.name}</h1>
                                            <h1 className="text-md text-secondary font-semibold">{item.productId}</h1>
                                            {item.labelledPrice > item.sellingPrice ? (
                                                <div>
                                                    <span className="text-md mx-1 text-gray-500 line-through">
                                                        {formatCurrency(item.labelledPrice)}
                                                    </span>
                                                    <span className="text-md mx-1 font-bold text-accent">
                                                        {formatCurrency(item.sellingPrice)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-md mx-1 font-bold text-accent">
                                                    {formatCurrency(item.sellingPrice)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-w-[100px] w-[100px] h-full flex flex-row justify-between items-center px-2">
                                            <button 
                                                className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent w-8 h-8 flex items-center justify-center"
                                                onClick={() => {
                                                    addToCart(item, -1)
                                                    setCart(getCart())
                                                }}
                                            >
                                                <BiMinus />
                                            </button>
                                            <span className="text-xl text-secondary font-semibold">
                                                {item.qty}
                                            </span>
                                            <button 
                                                className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent w-8 h-8 flex items-center justify-center"
                                                onClick={() => {
                                                    addToCart(item, 1)
                                                    setCart(getCart())
                                                }}
                                            >
                                                <BiPlus />
                                            </button>
                                        </div>
                                        <div className="w-[150px] h-full flex flex-col justify-center items-center">
                                            <h1 className="text-2xl text-secondary font-semibold">
                                                {formatCurrency(item.sellingPrice * item.qty)}
                                            </h1>
                                        </div>
                                        <button 
                                            className="absolute hover:bg-red-600 text-red-600 hover:text-white cursor-pointer rounded-full p-2 right-[-40px] transition-colors"
                                            onClick={() => {
                                                removeFromCart(item.productId)
                                                setCart(getCart())
                                            }}
                                        >
                                            <BiTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Mobile View - Hidden on desktop */}
            <div className="md:hidden w-full min-h-screen bg-white pt-4">
                {/* Mobile Total Card */}
                <div className="w-full px-4 mb-4 sticky top-0 z-10 bg-white shadow-lg py-3">
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-secondary">
                            Total: 
                            <span className="ml-2 font-bold text-accent text-xl">
                                {formatCurrency(total)}
                            </span>
                        </p>
                        <Link 
                            to="/checkout" 
                            state={{ cart: cart }}
                            className="bg-accent text-white px-6 py-2 rounded-lg text-lg font-bold hover:bg-secondary cursor-pointer transition-colors"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>

                {/* Mobile Cart Items */}
                <div className="w-full flex flex-col items-center px-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-600">Your cart is empty</p>
                            <Link to="/products" className="text-accent hover:underline mt-2 inline-block">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => {
                            return (
                                <div 
                                    key={item.productId} 
                                    className="w-full bg-primary shadow-lg rounded-lg p-4 mb-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-[80px] h-[80px] object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h1 className="text-base text-secondary font-semibold">{item.name}</h1>
                                            <p className="text-xs text-gray-500 mb-2">{item.productId}</p>
                                            
                                            {/* Price */}
                                            {item.labelledPrice > item.sellingPrice ? (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {formatCurrency(item.labelledPrice)}
                                                    </span>
                                                    <span className="text-base font-bold text-accent">
                                                        {formatCurrency(item.sellingPrice)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-base font-bold text-accent block mb-3">
                                                    {formatCurrency(item.sellingPrice)}
                                                </span>
                                            )}
                                            
                                            {/* Quantity Controls and Item Total */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        className="text-white font-bold rounded-lg hover:bg-secondary text-lg cursor-pointer w-8 h-8 bg-accent flex items-center justify-center"
                                                        onClick={() => {
                                                            addToCart(item, -1)
                                                            setCart(getCart())
                                                        }}
                                                    >
                                                        <BiMinus />
                                                    </button>
                                                    <span className="text-lg text-secondary font-semibold">
                                                        {item.qty}
                                                    </span>
                                                    <button 
                                                        className="text-white font-bold rounded-lg hover:bg-secondary text-lg cursor-pointer w-8 h-8 bg-accent flex items-center justify-center"
                                                        onClick={() => {
                                                            addToCart(item, 1)
                                                            setCart(getCart())
                                                        }}
                                                    >
                                                        <BiPlus />
                                                    </button>
                                                </div>
                                                <span className="text-lg font-bold text-accent">
                                                    {formatCurrency(item.sellingPrice * item.qty)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Delete Button */}
                                        <button 
                                            className="text-red-600 hover:bg-red-600 hover:text-white cursor-pointer rounded-full p-1.5 transition-colors self-start"
                                            onClick={() => {
                                                removeFromCart(item.productId)
                                                setCart(getCart())
                                            }}
                                        >
                                            <BiTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Continue Shopping Link for Mobile */}
                {cart.length > 0 && (
                    <div className="text-center mt-2 pb-6">
                        <Link to="/products" className="text-accent hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}