import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function AdminPage(){
    return(
        <div className="w-full h-screen bg-red-900 flex">
            <div className="h-full w-[300px] bg-blue-900">
                <Link to="/admin/products" className="block p-4 text-white">Products</Link>
                <Link to="/admin/orders" className="block p-4 text-white">Orders</Link>
                <Link to="/admin/users" className="block p-4 text-white">Users</Link>
            </div>
            <div className="h-full w-[calc(100%-300px)] bg-green-900">
                <Routes path="/*">
                    <Route path="/products" element={<h1>Products Page</h1>} />
                    <Route path="/orders" element={<h1>Orders Page</h1>} />
                    <Route path="/users" element={<h1>Users Page</h1>} />
                </Routes>
            </div>
        </div>
    )
}