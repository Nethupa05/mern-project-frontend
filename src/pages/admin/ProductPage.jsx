import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

export default function AdminProductsPage(){
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(
        () => {
            if(isLoading === true){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then((res)=>{
                    console.log(res.data) 
                    setProducts(res.data)
                    setIsLoading(false);
                }).catch((error) => {
                    toast.error("Failed to load products")
                    setIsLoading(false)
                })
            }
        },[isLoading]
    )

    function deleteProducts(productId){
        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("Please Login first")
            return
        }
        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
            headers : {
                "Authorization" : "Bearer "+token
            }
        }).then((res)=>{
            toast.success("Product Deleted Successfully")
            setIsLoading(true)
        }).catch((e)=>{
            toast.error(e.response?.data?.message || "Error deleting product")
        })
    }

    // Format currency in LKR
    const formatLKR = (amount) => {
        return `LKR ${Number(amount).toFixed(2)}`;
    }

    return(
        <div className="w-full h-full max-h-full overflow-y-scroll relative bg-white">
            {/* Header Section */}
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-accent/20 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-accent">Products Management</h1>
                <Link 
                    to="/admin/add-product" 
                    className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FaPlus className="text-sm" />
                    Add Product
                </Link>
            </div>

            {isLoading ?
                <div className="w-full h-[calc(100%-80px)] flex justify-center items-center">
                    <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin"></div>
                </div> : 
                
                products.length === 0 ?
                <div className="w-full h-[calc(100%-80px)] flex flex-col justify-center items-center text-gray-500">
                    <p className="text-xl mb-4">No products found</p>
                    <Link 
                        to="/admin/add-product" 
                        className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/80 transition-colors"
                    >
                        Add Your First Product
                    </Link>
                </div> :
                
                <div className="p-4">
                    <table className="w-full text-center border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-accent text-white">
                                <th className="py-3 px-4 font-semibold">Product ID</th>
                                <th className="py-3 px-4 font-semibold">Name</th>
                                <th className="py-3 px-4 font-semibold">Image</th>
                                <th className="py-3 px-4 font-semibold">Labelled Price (LKR)</th>
                                <th className="py-3 px-4 font-semibold">Selling Price (LKR)</th>
                                <th className="py-3 px-4 font-semibold">Stock</th>
                                <th className="py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((item, index) => {
                                    return(
                                        <tr 
                                            key={index} 
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors even:bg-gray-100/50"
                                        >
                                            <td className="py-3 px-4 font-medium text-gray-700">{item.productId}</td>
                                            <td className="py-3 px-4 text-gray-700">{item.name}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center">
                                                    <img 
                                                        src={item.images[0]} 
                                                        alt={item.name}
                                                        className="w-[50px] h-[50px] object-cover rounded-lg border-2 border-accent/20 shadow-sm"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50?text=No+Image'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">
                                                <span className="text-gray-400 mr-1">LKR</span>
                                                {Number(item.labelledPrice).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-accent">
                                                LKR {Number(item.sellingPrice).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                    ${item.stock > 10 ? 'bg-green-100 text-green-700' : 
                                                      item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                                                      'bg-red-100 text-red-700'}`}>
                                                    {item.stock > 10 ? 'In Stock' : 
                                                     item.stock > 0 ? 'Low Stock' : 
                                                     'Out of Stock'}
                                                    ({item.stock})
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            if(window.confirm('Are you sure you want to delete this product?')) {
                                                                deleteProducts(item.productId)
                                                            }
                                                        }}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                                                        title="Delete Product"
                                                    >
                                                        <FaTrash className="text-[18px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate("/admin/edit-product", {
                                                                state: item
                                                            })
                                                        }}
                                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
                                                        title="Edit Product"
                                                    >
                                                        <FaEdit className="text-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    
                    {/* Footer with product count */}
                    <div className="mt-4 text-right text-gray-600">
                        Total Products: <span className="font-bold text-accent">{products.length}</span>
                    </div>
                </div>
            }
        </div>
    )
}