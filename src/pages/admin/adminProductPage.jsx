import { useState } from "react"
import { sampleProducts } from "../../assets/sampleData"
import axios from "axios"
import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function AdminProductsPage(){

    const [products, setProducts] = useState([])

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then((res)=>{
            console.log(res.data) 
            setProducts(res.data)
            })
        },[]
    )

    

    return(
        <div className="w-full h-full bg-red-400 max-h-full overflow-y-scroll">
            <Link to="/admin/add-product" className="absolute bottom-5 right-5 bg-green-500 text-white cursor-pointer font-bold py-2 px-4 rounded my-4">Add Product</Link>
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Labelled Price</th>
                        <th>Price</th>
                        <th>Stock</th>
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
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table> 
        </div>
    )
}
