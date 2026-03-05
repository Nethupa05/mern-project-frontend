import { useState } from "react"
import { sampleProducts } from "../../assets/sampleData"
import axios from "axios"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTrash, FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"


export default function AdminProductsPage(){

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(
        () => {
            if(isLoading == true){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then((res)=>{
                console.log(res.data) 
                setProducts(res.data)
                setIsLoading(false);
                })
            }
        },[isLoading]
    )

    function deleteProducts(productId){
        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("Please Login firsst")
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
            toast.error(e.response.data.message)
        })
    }

    return(
        <div className="w-full h-full max-h-full overflow-y-scroll">
            <Link to="/admin/add-product" className="absolute bottom-5 right-5 bg-green-500 text-white cursor-pointer font-bold py-2 px-4 rounded my-4">Add Product</Link>

            {isLoading ?
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>
                </div> :

                <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Labelled Price</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                    <tbody>
                        {
                            products.map(
                                (item,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{item.productId}</td>
                                            <td>{item.name}</td>
                                            <td><img src={item.images[0]} className="w-[50px] h-[50px]"/></td>
                                            <td>{item.labelledPrice}</td>
                                            <td>{item.sellingPrice}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                <div className="flex justify-center items-center gap-4 text-xl">
                                                    <FaTrash onClick={()=>{
                                                        deleteProducts(item.productId)
                                                        window.location.reload()
                                                    }} className="text-[20px] text-red-500 mx-2 cursor-pointer"/> 

                                                    <FaEdit onClick={()=>{
                                                        navigate("/admin/edit-product/" , {
                                                            state : item
                                                        })
                                                    }} className="text-[20px] text-blue-500 mx-2 cursor-pointer"/>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            }

        </div>
    )
}
