import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import mediaUpload from "../../utils/mediaUpload.jsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FaCloudUploadAlt, FaTimes, FaPlus, FaImage } from "react-icons/fa"

export default function AddProductPage(){
    const [productId, setProductId] = useState("")
    const [name, setName] = useState("")
    const [altNames, setAltNames] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [labelledPrice, setLabelledPrice] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    // Handle image selection and create previews
    function handleImageChange(e) {
        const selectedFiles = Array.from(e.target.files)
        setImages(selectedFiles)
        
        // Create preview URLs
        const previews = selectedFiles.map(file => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    // Remove a specific image
    function removeImage(index) {
        const newImages = [...images]
        const newPreviews = [...imagePreviews]
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newPreviews[index])
        
        newImages.splice(index, 1)
        newPreviews.splice(index, 1)
        
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    async function AddProduct(e){
        e.preventDefault()

        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please Login First")
            return
        }

        // Validation
        if(!productId.trim()){
            toast.error("Product ID is required")
            return
        }
        if(!name.trim()){
            toast.error("Product name is required")
            return
        }
        if(images.length <= 0){
            toast.error("Please select at least one image")
            return
        }
        if(!labelledPrice || Number(labelledPrice) <= 0){
            toast.error("Please enter a valid labelled price")
            return
        }
        if(!price || Number(price) <= 0){
            toast.error("Please enter a valid selling price")
            return
        }
        if(!stock || Number(stock) < 0){
            toast.error("Please enter a valid stock quantity")
            return
        }

        setIsSubmitting(true)

        const promisesArray = []

        for(let i = 0; i < images.length; i++){
            promisesArray[i] = mediaUpload(images[i])
        }

        try{
            const imageUrls = await Promise.all(promisesArray)
            console.log(imageUrls)

            const altNamesArray = altNames ? altNames.split(",").map(name => name.trim()) : []

            const product = {
                productId: productId.trim(),
                name: name.trim(),
                altNames: altNamesArray,
                description: description.trim(),
                images: imageUrls,
                labelledPrice: Number(labelledPrice),
                sellingPrice: Number(price),
                stock: Number(stock)
            }
            
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", product, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            
            toast.success("Product Added Successfully")
            navigate("/admin/products")

        } catch(e){
            console.log(e)
            toast.error(e.response?.data?.message || "Failed to add product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <div className="w-full h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-accent">Add New Product</h1>
                    <p className="text-gray-600 mt-1">Fill in the details below to add a new product to your inventory</p>
                </div>

                {/* Form */}
                <form onSubmit={AddProduct} className="bg-white rounded-lg shadow-lg p-6">
                    {/* Product ID */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product ID <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g., PRD001" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            value={productId} 
                            onChange={(e) => setProductId(e.target.value)}
                            required
                        />
                    </div>

                    {/* Product Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter product name" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Alternate Names */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Alternate Names
                        </label>
                        <input 
                            type="text" 
                            placeholder="Comma separated values (e.g., Laptop, Notebook, MacBook)" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            value={altNames} 
                            onChange={(e) => setAltNames(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea 
                            placeholder="Enter product description" 
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Images */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Images <span className="text-red-500">*</span>
                        </label>
                        
                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-accent/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        >
                                            <FaTimes className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer"
                             onClick={() => document.getElementById('imageInput').click()}>
                            <input 
                                id="imageInput"
                                type="file" 
                                multiple 
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Labelled Price (LKR) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">LKR</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00" 
                                    className="w-full p-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    value={labelledPrice} 
                                    onChange={(e) => setLabelledPrice(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Selling Price (LKR) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">LKR</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00" 
                                    className="w-full p-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="number" 
                            min="0"
                            placeholder="Enter stock quantity" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Link 
                            to="/admin/products" 
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FaPlus className="text-sm" />
                                    Add Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}