import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import mediaUpload from "../../utils/mediaUpload.jsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { 
    FaSave, 
    FaTimes, 
    FaCloudUploadAlt, 
    FaTrash, 
    FaPlus,
    FaImage,
    FaEdit,
    FaArrowLeft
} from "react-icons/fa"

export default function EditProductPage(){
    const location = useLocation()
    const [productId, setProductId] = useState(location.state?.productId || "")
    const [name, setName] = useState(location.state?.name || "")
    const [altNames, setAltNames] = useState(location.state?.altNames?.join(",") || "")
    const [description, setDescription] = useState(location.state?.description || "")
    const [existingImages, setExistingImages] = useState(location.state?.images || [])
    const [newImages, setNewImages] = useState([])
    const [newImagePreviews, setNewImagePreviews] = useState([])
    const [labelledPrice, setLabelledPrice] = useState(location.state?.labelledPrice || "")
    const [price, setPrice] = useState(location.state?.sellingPrice || "")
    const [stock, setStock] = useState(location.state?.stock || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    // Redirect if no state
    useEffect(() => {
        if (!location.state) {
            toast.error("No product selected")
            navigate("/admin/products")
        }
    }, [location.state, navigate])

    // Handle new image selection
    function handleNewImageChange(e) {
        const selectedFiles = Array.from(e.target.files)
        setNewImages(selectedFiles)
        
        // Create preview URLs
        const previews = selectedFiles.map(file => URL.createObjectURL(file))
        setNewImagePreviews(previews)
    }

    // Remove a new image
    function removeNewImage(index) {
        const newImagesList = [...newImages]
        const newPreviewsList = [...newImagePreviews]
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newPreviewsList[index])
        
        newImagesList.splice(index, 1)
        newPreviewsList.splice(index, 1)
        
        setNewImages(newImagesList)
        setNewImagePreviews(newPreviewsList)
    }

    // Remove an existing image
    function removeExistingImage(index) {
        const updatedImages = [...existingImages]
        updatedImages.splice(index, 1)
        setExistingImages(updatedImages)
    }

    async function updateProduct(e){
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
        if(existingImages.length === 0 && newImages.length === 0){
            toast.error("Please keep at least one image")
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

        try {
            let imageUrls = [...existingImages]

            // Upload new images if any
            if(newImages.length > 0){
                const promisesArray = []
                for(let i = 0; i < newImages.length; i++){
                    promisesArray[i] = mediaUpload(newImages[i])
                }
                const newImageUrls = await Promise.all(promisesArray)
                imageUrls = [...imageUrls, ...newImageUrls]
            }

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

            await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, 
                product, 
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            )
            
            toast.success("Product Updated Successfully")
            navigate("/admin/products")

        } catch(e) {
            console.log(e)
            toast.error(e.response?.data?.message || "Failed to update product")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Format currency in LKR
    const formatLKR = (amount) => {
        return `LKR ${Number(amount).toFixed(2)}`
    }

    return(
        <div className="w-full h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header with Back Button */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        to="/admin/products"
                        className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                        title="Back to Products"
                    >
                        <FaArrowLeft className="text-accent text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-accent">Edit Product</h1>
                        <p className="text-gray-600 mt-1">Update product information for {name}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={updateProduct} className="bg-white rounded-lg shadow-lg p-6">
                    {/* Product ID (Disabled) */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product ID <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            disabled
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                            value={productId} 
                        />
                        <p className="text-xs text-gray-500 mt-1">Product ID cannot be changed</p>
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

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Images
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {existingImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={url} 
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-accent/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                            title="Remove Image"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images Preview */}
                    {newImagePreviews.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Images to Add
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {newImagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={preview} 
                                            alt={`New Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload New Images */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Add More Images
                        </label>
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer"
                            onClick={() => document.getElementById('newImageInput').click()}
                        >
                            <input 
                                id="newImageInput"
                                type="file" 
                                multiple 
                                accept="image/*"
                                className="hidden"
                                onChange={handleNewImageChange}
                            />
                            <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload additional images</p>
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
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                        >
                            <FaTimes /> Cancel
                        </Link>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave className="text-sm" />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Product Summary */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Current Price</p>
                            <p className="text-lg font-bold text-accent">{formatLKR(price)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Discount</p>
                            <p className="text-lg font-bold text-green-600">
                                {((labelledPrice - price) / labelledPrice * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Current Stock</p>
                            <p className="text-lg font-bold text-gray-700">{stock} units</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Total Images</p>
                            <p className="text-lg font-bold text-gray-700">
                                {existingImages.length + newImages.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}