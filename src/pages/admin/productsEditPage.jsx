import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import  mediaUpload  from "../../utils/mediaUpload.jsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function EditProductPage(){
    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId)
    const [name, setName] = useState(location.state.name)
    const [altNames, setAltNames] = useState(location.state.altNames.join(","))
    const [description, setDescription] = useState(location.state.description)
    const [images, setImages] = useState([])
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
    const [price, setPrice] = useState(location.state.sellingPrice)
    const [stock, setStock] = useState(location.state.stock)
    const navigate = useNavigate()
   

    console.log(location)

    async function updateProduct(e){

        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please Login First")
            return
        }

        let imageUrls = location.state.images;

        const promisesArray=[]

        for(let i=0; i<images.length; i++){
            promisesArray[i] = mediaUpload(images[i])
        }

        try{
            if(images.length > 0){
                imageUrls = await Promise.all(promisesArray)
            }
            console.log(imageUrls)

            const altNamesArray = altNames.split(",")

            const product = {
                productId,
                name,
                altNames : altNamesArray,
                description : description,
                images : imageUrls,
                labelledPrice : Number(labelledPrice),
                sellingPrice : Number(price),
                stock : Number(stock)
            }
            axios.put(import.meta.env.VITE_BACKEND_URL+"/api/products/"+productId,product, {
                headers : {
                    "Authorization" : "Bearer "+token
                }
            }).then((res)=>{
                toast.success("Product Updated Successfully")
                navigate("/admin/products")
            }).catch((e) => {
                toast.error(e.response.data.message)
            })

        }catch(e){
            console.log(e)
            return
        }
    }

    return(
        <div className="w-full h-full flex flex-col justify-center item-center">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <input type="text" disabled placeholder="Product ID" className="p-2 m-2" value={productId} onChange={(e)=>setProductId(e.target.value)}/>
            <input type="text" placeholder="Name" className="p-2 m-2" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="Alternate Names (comma separated)" className="p-2 m-2" value={altNames} onChange={(e)=>setAltNames(e.target.value)}/>
            <textarea placeholder="Description" className="p-2 m-2" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
            <input type="file" multiple placeholder="Image URLs (comma separated)" className="p-2 m-2"onChange={(e)=>setImages([...e.target.files])}/>
            <input type="number" placeholder="Labelled Price" className="p-2 m-2" value={labelledPrice} onChange={(e)=>setLabelledPrice(Number(e.target.value))}/>
            <input type="number" placeholder="Selling Price" className="p-2 m-2" value={price} onChange={(e)=>setPrice(Number(e.target.value))}/>
            <input type="number" placeholder="Stock" className="p-2 m-2" value={stock} onChange={(e)=>setStock(Number(e.target.value))}/>
            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/products" className="bg-red-500 text-white p-2 m-2 rounded">Cancel</Link>
                <button className="bg-green-500 text-white p-2 m-2 rounded" onClick={updateProduct} >Update Product</button>
            </div>
        </div>
    )
}
