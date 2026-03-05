import { useEffect,useState } from "react"
import {useParams} from  "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

export default function ProductOverviewPage(){
    const params = useParams()
    const productId = params.id
    const [status , setStatus] = useState("loading")
    const [product , setProducts] = useState(null) 

    useEffect(
        ()=>{
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products/"+productId).then(
                (response)=>{
                    console.log(response.data)
                    setProducts(response.data)
                    setStatus("success")
                }
            ).catch(
                (error)=>{
                    console.log(error)
                    setStatus("error")
                    toast.error("Error fetching product details")
                }
            )
        }
    ,[])

    return(
        <div className="bg-primary font-fancy">
            this is overview page for product {JSON.stringify(product)}
        </div>
    )
}