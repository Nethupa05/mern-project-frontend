import { Link } from 'react-router-dom'
import UserData from "./userData"
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart } from "react-icons/fa";

export default function Header(){
    const navigate = useNavigate()
    console.log("Header component loading...")
    return(
        <header className="w-full h-[80px] flex shadow-2xs">
            <img onClick={()=>{
                navigate("/")
            }} src="/logo.png" alt="logo" className="h-[80px] w-[80px] object cover cursor-pointer"/>
            <div className="w-[calc(100%-160px)] h-full flex items-center justify-center ">
                <Link tp="/" className="text-2xl font-bold">Home</Link>
                <Link to="/products" className="text-2xl font-bold ml-4">Products</Link>
                <Link to="/about" className="text-2xl font-bold ml-4">About</Link>
                <Link to="/contact" className="text-2xl font-bold ml-4">Contact</Link>
                
            </div>

            <div className="w-[80px] flex jestify-center items-center ">
                <Link to="/cart" className="text-2xl font-bold">
                    <FaShoppingCart />
                </Link>
            </div>
        </header>
    )
}