import { Route, Routes } from 'react-router-dom'
import Headers from '../components/header'     
import ProductPage from './Client/productsPage.jsx'
import ProductOverviewPage from './Client/productOverview.jsx'
import CartPage from './Client/cart.jsx'

export default function HomePage(){
    return(
        <div className='w-full h-screen flex flex-col items-center'>
            <Headers/>
            <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
                <Routes path="/*">
                    <Route path="/" element={<h1>Home Page</h1>}/>
                    <Route path="/products" element={<ProductPage/>}/>
                    <Route path="/about" element={<h1>About Page</h1>}/>
                    <Route path="/contact" element={<h1>Contact Page</h1>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/overview/:id" element={<ProductOverviewPage/>}/>
                    <Route path="/*" element={<h1>404 Not Found</h1>}/>
                </Routes>
            </div>
        </div>
    )
} 