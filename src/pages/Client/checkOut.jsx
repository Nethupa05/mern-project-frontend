// import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"
// import { useState } from "react"
// import { Link, useLocation } from "react-router-dom"
// import { removeFromCart } from "../../utils/cart"
// import axios from "axios"
// import { toast } from "react-hot-toast"
// import { useNavigate } from "react-router-dom"

// export default function CheckoutPage(){
//     const location = useLocation()
//     console.log(location.state.cart)

//     const [cart, setCart] = useState(location.state?.cart ||[])
//     const [phoneNumber, setPhoneNumber] = useState("")
//     const [address, setAddress] = useState("")

//     function getTotal(){
//         let total = 0
//         cart.forEach((item)=>{
//             total += item.sellingPrice * item.qty
//         })
//         return total
//     }

//     function removeFromCart(index){
//         const newCart = cart.filter((item, i)=> i != index)
//         setCart(newCart)
//     }

//     function changeQty(index, qty){
//         const newQty = cart[index].qty + qty;
//         if(newQty<=0){
//             removeFromCart(index);
//             return
//         }else{
//             const newCart = [...cart]
//             newCart[index].qty = newQty;
//             setCart(newCart)
//         }
//     }

//     async function PlaceOrder(){
//         const token = localStorage.getItem("token");
//         if(!token){
//             toast.error("Please Login First")
//             return
//         }

//         const orderInformation = {
//             products : [],
//             phone : phoneNumber,
//             address : address
//         }

//         for(let i=0; i<cart.length; i++){
//             const item = {
//                 productId : cart[i].productId,
//                 quantity : cart[i].qty
//             }
//             orderInformation.products[i] = item
//         }

//         try{
//             const res = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",orderInformation, {
//                 headers: {
//                     Authorization: "Bearer " + token
//                 }
//             })
//             toast.success("Order Placed Successfully")
//             console.log(res.data)
//         }catch(err){
//             console.log("ORDER ERROR:", err.response?.data || err.message)
//             toast.error("Error placing order")
//         }
//     }

//     return(
//         <div className="w-full h-full flex flex-col items-center pt-4 relative">
//             <div className="w-[300px]  shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center p-1 gap-2">
//                 <p className="text-2xl font-bold text-secondary">Total:
//                     <span className="mx-2 font-bold text-accent text-2xl">
//                         {getTotal().toFixed(2)}
//                     </span>
//                 </p>
//                 <div>
//                     <input type="text" className="w-full h-[50px] bg-primary text-secondary text-2xl font-bold flex justify-center items-center" placeholder="Phone Number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
//                     <input type="text" className="w-full h-[50px] bg-primary text-secondary text-2xl font-bold flex justify-center items-center" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
//                 </div>
                
//                 <button className="w-full h-[50px] bg-accent text-white text-2xl font-bold flex justify-center items-center hover:bg-secondary cursor-pointer"onClick={PlaceOrder}>
//                     Place Order
//                 </button> 
//             </div>
//             {
//                 cart.map(
//                     (item , index)=>{
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
//                                         changeQty(index , -1)
//                                     }}><BiMinus/></button>
//                                     <h1 className="text-xl text-secondary font-semibold h-full flex items-center">{item.qty}</h1>
//                                     <button className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent" onClick={()=>{
//                                         changeQty(index , +1)
//                                     }}><BiPlus/></button>
//                                 </div>
//                                 {/* total */}
//                                 <div className="w-[200px] h-full flex flex-col justify-center items-center">
//                                     <h1 className="text-2xl text-secondary font-semibold">{(item.sellingPrice*item.qty).toFixed(2)}</h1>
//                                 </div>
//                                 <button className="absolute hover:bg-red-600 text-red-600 hover:text-white cursor-pointer rounded-full p-2 right-[-40px]" onClick={
//                                     ()=>{
//                                         removeFromCart(index)
//                                     }
//                                 }>
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
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { removeFromCart } from "../../utils/cart"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage(){
    const location = useLocation()
    console.log(location.state.cart)

    const [cart, setCart] = useState(location.state?.cart || [])
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const navigate = useNavigate()

    function getTotal(){
        let total = 0
        cart.forEach((item)=>{
            total += item.sellingPrice * item.qty
        })
        return total
    }

    function removeFromCart(index){
        const newCart = cart.filter((item, i)=> i != index)
        setCart(newCart)
    }

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

    async function PlaceOrder(){
        const token = localStorage.getItem("token");
        if(!token){
            toast.error("Please Login First")
            return
        }

        if(!phoneNumber || !address){
            toast.error("Please fill in all details")
            return
        }

        const orderInformation = {
            products : [],
            phone : phoneNumber,
            address : address
        }

        for(let i=0; i<cart.length; i++){
            const item = {
                productId : cart[i].productId,
                quantity : cart[i].qty
            }
            orderInformation.products[i] = item
        }

        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders", orderInformation, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            toast.success("Order Placed Successfully")
            console.log(res.data)
            // Clear cart and navigate to home or orders page
            setTimeout(() => {
                navigate("/")
            }, 2000)
        }catch(err){
            console.log("ORDER ERROR:", err.response?.data || err.message)
            toast.error(err.response?.data?.message || "Error placing order")
        }
    }

    return(
        <div className="w-full min-h-screen bg-white">
            {/* Desktop View */}
            <div className="hidden md:block w-full h-full pt-4 relative">
                {/* Desktop Checkout Card */}
                <div className="w-[300px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center p-4 gap-3 bg-white z-10">
                    <p className="text-2xl font-bold text-secondary">
                        Total:
                        <span className="mx-2 font-bold text-accent text-2xl">
                            LKR {getTotal().toFixed(2)}
                        </span>
                    </p>
                    <div className="w-full space-y-2">
                        <input 
                            type="text" 
                            className="w-full h-[45px] bg-gray-50 text-secondary text-lg font-medium px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" 
                            placeholder="Phone Number" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input 
                            type="text" 
                            className="w-full h-[45px] bg-gray-50 text-secondary text-lg font-medium px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" 
                            placeholder="Address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className="w-full h-[50px] bg-accent text-white text-xl font-bold rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                        onClick={PlaceOrder}
                    >
                        Place Order
                    </button>
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
                        cart.map((item, index) => {
                            return (
                                <div 
                                    key={item.productId} 
                                    className="w-[600px] relative my-4"
                                >
                                    <div className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl bg-primary shadow-2xl flex flex-row relative items-center">
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
                                                        LKR {item.labelledPrice.toFixed(2)}
                                                    </span>
                                                    <span className="text-md mx-1 font-bold text-accent">
                                                        LKR {item.sellingPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-md mx-1 font-bold text-accent">
                                                    LKR {item.sellingPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-w-[100px] w-[100px] h-full flex flex-row justify-between items-center px-2">
                                            <button 
                                                className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent w-8 h-8 flex items-center justify-center"
                                                onClick={() => changeQty(index, -1)}
                                            >
                                                <BiMinus />
                                            </button>
                                            <span className="text-xl text-secondary font-semibold">
                                                {item.qty}
                                            </span>
                                            <button 
                                                className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent w-8 h-8 flex items-center justify-center"
                                                onClick={() => changeQty(index, 1)}
                                            >
                                                <BiPlus />
                                            </button>
                                        </div>
                                        <div className="w-[150px] h-full flex flex-col justify-center items-center">
                                            <h1 className="text-2xl text-secondary font-semibold">
                                                LKR {(item.sellingPrice * item.qty).toFixed(2)}
                                            </h1>
                                        </div>
                                        <button 
                                            className="absolute hover:bg-red-600 text-red-600 hover:text-white cursor-pointer rounded-full p-2 right-[-40px] transition-colors"
                                            onClick={() => removeFromCart(index)}
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

            {/* Mobile View */}
            <div className="md:hidden w-full min-h-screen bg-white">
                {/* Mobile Checkout Card - Sticky at top */}
                <div className="sticky top-0 z-10 bg-white shadow-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-xl font-bold text-secondary">
                            Total:
                        </p>
                        <span className="font-bold text-accent text-xl">
                            LKR {getTotal().toFixed(2)}
                        </span>
                    </div>
                    
                    <div className="space-y-3 mb-3">
                        <input 
                            type="text" 
                            className="w-full h-[45px] bg-gray-50 text-secondary text-base font-medium px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" 
                            placeholder="Phone Number" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input 
                            type="text" 
                            className="w-full h-[45px] bg-gray-50 text-secondary text-base font-medium px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-accent" 
                            placeholder="Address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className="w-full h-[50px] bg-accent text-white text-lg font-bold rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                        onClick={PlaceOrder}
                    >
                        Place Order
                    </button>
                </div>

                {/* Mobile Cart Items */}
                <div className="px-4 pb-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-600">Your cart is empty</p>
                            <Link to="/products" className="text-accent hover:underline mt-2 inline-block">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.map((item, index) => {
                            return (
                                <div 
                                    key={item.productId} 
                                    className="bg-primary shadow-lg rounded-lg p-4 mb-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-[80px] h-[80px] object-cover rounded-lg"
                                        />
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h1 className="text-base text-secondary font-semibold">{item.name}</h1>
                                                    <p className="text-xs text-gray-500 mb-2">{item.productId}</p>
                                                </div>
                                                <button 
                                                    className="text-red-600 hover:bg-red-600 hover:text-white cursor-pointer rounded-full p-1.5 transition-colors"
                                                    onClick={() => removeFromCart(index)}
                                                >
                                                    <BiTrash size={18} />
                                                </button>
                                            </div>
                                            
                                            {/* Price */}
                                            {item.labelledPrice > item.sellingPrice ? (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm text-gray-400 line-through">
                                                        LKR {item.labelledPrice.toFixed(2)}
                                                    </span>
                                                    <span className="text-base font-bold text-accent">
                                                        LKR {item.sellingPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-base font-bold text-accent block mb-3">
                                                    LKR {item.sellingPrice.toFixed(2)}
                                                </span>
                                            )}
                                            
                                            {/* Quantity Controls and Item Total */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        className="text-white font-bold rounded-lg hover:bg-secondary text-lg cursor-pointer w-8 h-8 bg-accent flex items-center justify-center"
                                                        onClick={() => changeQty(index, -1)}
                                                    >
                                                        <BiMinus />
                                                    </button>
                                                    <span className="text-lg text-secondary font-semibold">
                                                        {item.qty}
                                                    </span>
                                                    <button 
                                                        className="text-white font-bold rounded-lg hover:bg-secondary text-lg cursor-pointer w-8 h-8 bg-accent flex items-center justify-center"
                                                        onClick={() => changeQty(index, 1)}
                                                    >
                                                        <BiPlus />
                                                    </button>
                                                </div>
                                                <span className="text-lg font-bold text-accent">
                                                    LKR {(item.sellingPrice * item.qty).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Continue Shopping Link */}
                {cart.length > 0 && (
                    <div className="text-center pb-6">
                        <Link to="/products" className="text-accent hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}