import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../../components/productCard'

export default function ProductPage(){

    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")
    const [sort, setSort] = useState("none")

    useEffect(()=>{
        if(isLoading){
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products")
            .then((res)=>{
                setProducts(res.data)
                setFilteredProducts(res.data)
                setIsLoading(false)
            })
        }
    },[isLoading])



    useEffect(()=>{

        let temp = [...products]

        // 🔎 SEARCH FILTER
        if(search !== ""){
            temp = temp.filter((p)=>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        // 📂 CATEGORY FILTER (using productId prefix)
        if(category !== "all"){
            temp = temp.filter((p)=>
                p.productId.startsWith(category)
            )
        }

        // 💰 PRICE SORT
        if(sort === "low"){
            temp.sort((a,b)=> a.price - b.price)
        }

        if(sort === "high"){
            temp.sort((a,b)=> b.price - a.price)
        }

        setFilteredProducts(temp)

    },[search,category,sort,products])



    return(

        <div className="w-full min-h-screen p-6">

            {/* 🔎 Search + Filters */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-wrap gap-4 justify-center">

                {/* SEARCH */}
                <input
                type="text"
                placeholder="Search products..."
                className="border px-4 py-2 rounded-lg w-[250px]"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                />

                {/* CATEGORY FILTER */}
                <select
                className="border px-4 py-2 rounded-lg"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="P">Phones</option>
                    <option value="L">Laptops</option>
                    <option value="W">Watches</option>
                    <option value="H">Headphones</option>
                    <option value="S">Speakers</option>
                </select>

                {/* PRICE SORT */}
                <select
                className="border px-4 py-2 rounded-lg"
                value={sort}
                onChange={(e)=>setSort(e.target.value)}
                >
                    <option value="none">Sort By</option>
                    <option value="low">Price Low → High</option>
                    <option value="high">Price High → Low</option>
                </select>

            </div>


            {/* PRODUCTS GRID */}
            <div className="w-full flex flex-wrap justify-center items-center">

                {filteredProducts.map((product)=>(
                    <ProductCard
                        key={product.productId}
                        product={product}
                    />
                ))}

            </div>

        </div>
    )
}