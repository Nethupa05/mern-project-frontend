import { Link } from 'react-router-dom'
import UserData from "./userData"

export default function Header(){
    console.log("Header component loading...")
    return(
        <div className="bg-red-500">
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}