// import { useEffect, useState } from "react"
// import { useParams,useNavigate } from "react-router-dom"
// import axios from "axios"
// import toast from "react-hot-toast"
// import ImageSlider from "../../components/imageSlider"
// import Loading from "../../components/loading"
// import { addToCart, getCart } from "../../utils/cart"
// // import LoadingAnimation from "../../components/LoadingAnimation";

// export default function ProductOverviewPage() {
//     const params = useParams()
//     const productId = params.id
//     const [status, setStatus] = useState("loading")
//     const [product, setProducts] = useState(null)
//     const navigate = useNavigate()

//     useEffect(
//         () => {
//             axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
//                 (response) => {
//                     console.log(response.data)
//                     setProducts(response.data)
//                     setStatus("success")
//                 }
//             ).catch(
//                 (error) => {
//                     console.log(error)
//                     setStatus("error")
//                     toast.error("Error fetching product details")
//                 }
//             )
//         }
//         , [])

//     return (
//         <>
//             {status == "success" && (
//                 <div className=" w-full h-full flex">
//                     <div className="w-[50%] h-full flex justify-center items-center">
//                         <ImageSlider images={product.images} />
//                     </div>
//                     <div className="w-[50%] h-full flex justify-center items-center">
//                         <div className="w-[500px] h-[600px] flex flex-col items-center ">
//                             <h1 className="w-full text-center text-4xl text-secondary font-semibold ">{product.name}
//                                 {
//                                     product.altNames.map((altName, index) => {
//                                         return (
//                                             <span key={index} className="text-4xl text-gray-600 font-normal" >{" "}{" | " + altName}</span>
//                                         )
//                                     })
//                                 }
//                             </h1>
//                             <h1 className="w-full text-center my-2 text-md text-gray-600 font-semibold">{product.productId}</h1>
//                             <p className="w-full text-center my-2 text-md text-gray-600 font-semibold">{product.description}</p>
//                             {
//                                 product.labelledPrice > product.sellingPrice ?
//                                     <div>
//                                         <span className="text-4xl mx-4 text-gray-500 line-through">{product.labelledPrice.toFixed(2)}</span>
//                                         <span className="text-4xl mx-4 font-bold text-accent">{product.sellingPrice.toFixed(2)}</span>
//                                     </div>
//                                     : <span className="text-4xl mx-4 font-bold text-accent">{product.sellingPrice.toFixed(2)}</span>
//                             }
//                             <div className="w-full flex justify-between items-center mt-4">
//                                 <button className="w-[200px] h-[50-px] mx-4 text-2xl cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300 " onClick={() => {
//                                     // localStorage.removeItem("cart")
//                                     console.log("Old Cart")
//                                     console.log(getCart())
//                                     addToCart(product, 1)
//                                     console.log("New Cart")
//                                     console.log(getCart())
//                                 }}>Add to Cart</button>
//                                 <button className="w-[200px] h-[50-px] mx-4 text-2xl cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300"
//                                     onClick={() => {
//                                         navigate("/checkout", {
//                                             state: {
//                                                 cart: [
//                                                     {
//                                                         productId: product.productId,
//                                                         name: product.name,
//                                                         image: product.images[0],
//                                                         sellingPrice: product.sellingPrice,
//                                                         labelledPrice: product.labelledPrice,
//                                                         qty: 1
//                                                     }
//                                                 ]
//                                             }
//                                         })
//                                     }}>Buy Now</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {
//                 status == "loading" && <Loading />
//                 // status == "loading" && <LoadingAnimation/>
//             }
//         </>


//     )
// }




import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import ImageSlider from "../../components/imageSlider"
import Loading from "../../components/loading"
import { addToCart, getCart } from "../../utils/cart"
// import LoadingAnimation from "../../components/LoadingAnimation";

export default function ProductOverviewPage() {
    const params = useParams()
    const productId = params.id
    const [status, setStatus] = useState("loading")
    const [product, setProducts] = useState(null)
    const navigate = useNavigate()

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
                (response) => {
                    console.log(response.data)
                    setProducts(response.data)
                    setStatus("success")
                }
            ).catch(
                (error) => {
                    console.log(error)
                    setStatus("error")
                    toast.error("Error fetching product details")
                }
            )
        }
        , [])

    const formatCurrency = (amount) => {
        return `LKR ${amount.toFixed(2)}`
    }

    if (status === "loading") {
        return <Loading />
    }

    if (status === "error") {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Failed to load product</p>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-white relative">
            {product && (
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 flex justify-center items-start p-4">
                        <div className="w-full max-w-[500px]">
                            <ImageSlider images={product.images} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-10">
                        <div className="max-w-lg mx-auto md:mx-0">
                            {/* Product Title */}
                            <h1 className="text-3xl md:text-5xl font-bold text-secondary text-center md:text-left uppercase tracking-wide">
                                {product.name}
                            </h1>

                            {/* Alt Names */}
                            {product.altNames && product.altNames.length > 0 && (
                                <p className="text-lg md:text-xl text-gray-600 mt-2 text-center md:text-left">
                                    {product.altNames.join(" | ")}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mt-8 flex flex-col items-center md:items-start">
                                {product.labelledPrice > product.sellingPrice ? (
                                    <div className="flex flex-col items-center md:items-start gap-1">
                                        <span className="text-4xl md:text-5xl font-bold text-accent">
                                            {formatCurrency(product.sellingPrice)}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl text-gray-400 line-through">
                                                {formatCurrency(product.labelledPrice)}
                                            </span>
                                            <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                                Save {formatCurrency(product.labelledPrice - product.sellingPrice)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-4xl md:text-5xl font-bold text-accent">
                                        {formatCurrency(product.sellingPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-14 flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        addToCart(product, 1)
                                        toast.success("Added to cart!")
                                    }}
                                    className="w-full h-14 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-xl font-medium"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/checkout", {
                                            state: {
                                                cart: [{
                                                    productId: product.productId,
                                                    name: product.name,
                                                    image: product.images[0],
                                                    sellingPrice: product.sellingPrice,
                                                    labelledPrice: product.labelledPrice,
                                                    qty: 1
                                                }]
                                            }
                                        })
                                    }}
                                    className="w-full h-14 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-xl font-medium"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Product Details Section */}
                            <div className="mt-12">
                                <h3 className="text-2xl font-semibold text-center md:text-left mb-6">Product Details</h3>

                                {/* Description */}
                                <p className="text-gray-600 text-center md:text-left mb-8 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Product Specifications */}
                                <div className="space-y-4">
                                    {product.productId && (
                                        <div className="flex justify-between md:justify-start md:gap-20 border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Product ID:</span>
                                            <span className="font-medium md:ml-4">{product.productId}</span>
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="flex justify-between md:justify-start md:gap-20 border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium md:ml-4">{product.category}</span>
                                        </div>
                                    )}
                                    {product.material && (
                                        <div className="flex justify-between md:justify-start md:gap-20 border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Material:</span>
                                            <span className="font-medium md:ml-4">{product.material}</span>
                                        </div>
                                    )}
                                    {product.stock && (
                                        <div className="flex justify-between md:justify-start md:gap-20 border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Availability:</span>
                                            <span className="font-medium text-green-600 md:ml-4">In Stock</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-4 text-center md:text-left">Shipping Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                        <span className="text-gray-600">Free shipping on orders above LKR 999</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-gray-600">30-day return policy</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-600">Estimated delivery: 3-5 business days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}