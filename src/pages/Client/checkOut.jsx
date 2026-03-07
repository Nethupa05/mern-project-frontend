import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { removeFromCart } from "../../utils/cart"

export default function CheckoutPage(){
    const location = useLocation()
    console.log(location.state.cart)

    const [cart, setCart] = useState(location.state?.cart ||[])

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
        if(newQty<=0){
            removeFromCart(index);
            return
        }else{
            const newCart = [...cart]
            newCart[index].qty = newQty;
            setCart(newCart)
        }
    }



    return(
        <div className="w-full h-full flex flex-col items-center pt-4 relative">
            <div className="w-[300px] h-[80px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center">
                <p className="text-2xl font-bold text-secondary">Total:
                    <span className="mx-2 font-bold text-accent text-2xl">
                        {getTotal().toFixed(2)}
                    </span>
                </p>
                <Link to="/checkout" className="w-full h-[50px] bg-accent text-white text-2xl font-bold flex justify-center items-center hover:bg-secondary cursor-pointer">Place Order</Link> 
            </div>
            {
                cart.map(
                    (item , index)=>{
                        return(
                            <div key={item.productId} className="w-[600px] h-[100px] my-4 bg-blue-200 rounded-tl-3xl rounded-bl-3xl bg-primary shadow-2xl flex flex-row relative items-center">
                                <img src={item.image} className="w-[100px] h-[100px] object-cover rounded-3xl"/>
                                <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
                                    <h1 className="text-xl text-secondary font-semibold">{item.name}</h1>
                                    <h1 className="text-md text-secondary font-semibold">{item.productId}</h1>
                                    {
                                        item.labelledPrice > item.sellingPrice ?
                                        <div>
                                            <span className="text-md mx-1 text-gray-500 line-through">{item.labelledPrice.toFixed(2)}</span>
                                            <span className="text-md mx-1 font-bold text-accent">{item.sellingPrice.toFixed(2)}</span>
                                        </div>
                                        :<span className="text-md mx-1 font-bold text-accent">{item.sellingPrice.toFixed(2)}</span>
                                    }                                        
                                </div>
                                <div className="max-w-[100px] w-[100px] h-full flex flex-row justify-between items-center">
                                    <button className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent" onClick={()=>{
                                        changeQty(index , -1)
                                    }}><BiMinus/></button>
                                    <h1 className="text-xl text-secondary font-semibold h-full flex items-center">{item.qty}</h1>
                                    <button className="text-white font-bold rounded-xl hover:bg-secondary text-2xl cursor-pointer aspect-square bg-accent" onClick={()=>{
                                        changeQty(index , +1)
                                    }}><BiPlus/></button>
                                </div>
                                {/* total */}
                                <div className="w-[200px] h-full flex flex-col justify-center items-center">
                                    <h1 className="text-2xl text-secondary font-semibold">{(item.sellingPrice*item.qty).toFixed(2)}</h1>
                                </div>
                                <button className="absolute hover:bg-red-600 text-red-600 hover:text-white cursor-pointer rounded-full p-2 right-[-40px]" onClick={
                                    ()=>{
                                        removeFromCart(index)
                                    }
                                }>
                                    <BiTrash/>
                                </button>
                            </div>
                        )
                    }
                )
            }
        </div>
    )
}