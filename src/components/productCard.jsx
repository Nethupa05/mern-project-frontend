import { Link } from "react-router-dom";

export default function ProductCard({ product }) {

  return (
    <Link to={"/overview/" + product.productId} className="w-[300px] h-[400px] bg-white shadow-md rounded-lg m-2 flex flex-col p-4">

      {/* Image */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-[200px] object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">

        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-500 font-bold text-lg">
            Rs. {product.sellingPrice}
          </span>

          <span className="text-gray-400 line-through text-sm">
            Rs. {product.labelledPrice}
          </span>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center mt-3">

          {/* Stock */}
          <span className="text-green-600 text-sm font-medium">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          {/* Button */}
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-md"
          >
            Buy Now
          </button>

        </div>

      </div>

    </Link>
  );
}