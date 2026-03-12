import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Headers from '../components/header'
import ProductPage from './Client/productsPage.jsx'
import ProductOverviewPage from './Client/productOverview.jsx'
import CartPage from './Client/cart.jsx'
import CheckoutPage from './Client/checkout.jsx'
import Footer from '../components/footer.jsx'
import axios from 'axios'
import ProductCard from "../components/productCard"
import ContactPage from "./Client/ContactPage"

// ─── Home Landing Page ───────────────────────────────────────────────────────
function LandingPage() {
    const navigate = useNavigate()
    const [scrollY, setScrollY] = useState(0)
    const [products, setProducts] = useState([])
    const [phones, setPhones] = useState([])
    const [laptops, setLaptops] = useState([])
    const [audio, setAudio] = useState([])

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((res) => {

                const allProducts = res.data
                setProducts(allProducts)

                // categorize using productId prefix
                setPhones(allProducts.filter(p => p.productId.startsWith("P")))
                setLaptops(allProducts.filter(p => p.productId.startsWith("L")))
                setAudio(allProducts.filter(p => p.productId.startsWith("H") || p.productId.startsWith("S")))

            })
    }, [])


    const categories = [
        { label: 'Laptops', icon: '💻', desc: 'Pro & gaming laptops', color: 'from-blue-500 to-cyan-500' },
        { label: 'Phones', icon: '📱', desc: 'Latest smartphones', color: 'from-indigo-500 to-purple-500' },
        { label: 'Audio', icon: '🎧', desc: 'Headphones & speakers', color: 'from-pink-500 to-rose-500' },
        { label: 'Accessories', icon: '🖱️', desc: 'Mice, keyboards & more', color: 'from-amber-500 to-orange-500' },
        { label: 'Monitors', icon: '🖥️', desc: '4K & curved displays', color: 'from-green-500 to-teal-500' },
        { label: 'Storage', icon: '💾', desc: 'SSDs & hard drives', color: 'from-violet-500 to-indigo-500' },
    ]

    const features = [
        { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch on all in-stock items' },
        { icon: '🔒', title: 'Secure Payment', desc: 'SSL-encrypted checkout, 100% safe' },
        { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy' },
        { icon: '🛠️', title: 'Expert Support', desc: '24/7 technical support team' },
    ]

    return (
        <div className="w-full overflow-x-hidden">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#05070f]">
                {/* Animated mesh background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Text */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-6"
                            style={{ animation: 'fadeSlideUp 0.6s ease both' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            New Arrivals Just Landed
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
                            style={{ animation: 'fadeSlideUp 0.6s ease 0.1s both', fontFamily: "'Syne', sans-serif" }}>
                            Next-Gen
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                Tech Store
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-10"
                            style={{ animation: 'fadeSlideUp 0.6s ease 0.2s both' }}>
                            Discover the latest laptops, smartphones, audio gear and accessories — all in one place.
                            Premium tech at competitive prices.
                        </p>

                        <div className="flex flex-wrap gap-4"
                            style={{ animation: 'fadeSlideUp 0.6s ease 0.3s both' }}>
                            <button
                                onClick={() => navigate('/products')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-[1.03]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Now
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button
                                onClick={() => navigate('/products')}
                                className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                            >
                                Browse Deals
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-12 pt-10 border-t border-white/10"
                            style={{ animation: 'fadeSlideUp 0.6s ease 0.4s both' }}>
                            {[['500+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                                <div key={label}>
                                    <p className="text-2xl font-black text-white">{val}</p>
                                    <p className="text-gray-500 text-sm">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Visual card stack */}
                    <div className="relative hidden lg:flex items-center justify-center h-[500px]"
                        style={{ animation: 'fadeSlideUp 0.8s ease 0.2s both' }}>
                        {/* Floating cards */}
                        <div className="absolute top-8 right-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl w-52"
                            style={{ animation: 'float 6s ease-in-out infinite' }}>
                            <div className="text-3xl mb-2">💻</div>
                            <p className="text-white font-bold text-sm">MacBook Pro M3</p>
                            <p className="text-blue-400 font-black text-lg mt-1">LKR 459,000</p>
                            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                In Stock
                            </div>
                        </div>

                        <div className="absolute bottom-16 left-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl w-52"
                            style={{ animation: 'float 6s ease-in-out infinite 1.5s' }}>
                            <div className="text-3xl mb-2">📱</div>
                            <p className="text-white font-bold text-sm">iPhone 15 Pro</p>
                            <p className="text-blue-400 font-black text-lg mt-1">LKR 289,000</p>
                            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                In Stock
                            </div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-md border border-blue-500/20 rounded-3xl p-8 shadow-2xl w-64"
                            style={{ animation: 'float 6s ease-in-out infinite 0.8s' }}>
                            <div className="text-5xl mb-4 text-center">🎧</div>
                            <p className="text-white font-bold text-center">Sony WH-1000XM5</p>
                            <p className="text-cyan-400 font-black text-xl text-center mt-2">LKR 89,000</p>
                            <div className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-2 rounded-lg text-center">
                                Add to Cart
                            </div>
                        </div>

                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-75 animate-ping" style={{ animationDuration: '4s' }} />
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
            </section>

            {/* ── Features Bar ─────────────────────────────────────────── */}
            <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                {f.icon}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                                <p className="text-gray-500 text-xs leading-snug">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Phones ───────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900">Latest Phones</h2>

                    <Link to="/products"
                        className="text-blue-600 font-semibold hover:text-indigo-600">
                        View All →
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center">
                    {phones.slice(0, 3).map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </section>


            {/* ── Laptops ───────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900">Top Laptops</h2>

                    <Link to="/products"
                        className="text-blue-600 font-semibold hover:text-indigo-600">
                        View All →
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center">
                    {laptops.slice(0, 3).map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </section>


            {/* ── Audio Products ───────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900">Audio Gear</h2>

                    <Link to="/products"
                        className="text-blue-600 font-semibold hover:text-indigo-600">
                        View All →
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center">
                    {audio.slice(0, 3).map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </section>




            {/* ── Categories ───────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-2">Browse by</p>
                        <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Categories
                        </h2>
                    </div>
                    <Link to="/products"
                        className="text-blue-600 font-semibold text-sm hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                        View all
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <Link to="/products" key={i}
                            className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {cat.icon}
                            </div>
                            <p className="font-bold text-gray-800 text-sm mb-1">{cat.label}</p>
                            <p className="text-gray-500 text-xs">{cat.desc}</p>
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </Link>
                    ))}
                </div>
            </section>


            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-14px); }
                }
            `}</style>
        </div>
    )
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">Who We Are</p>
            <h1 className="text-5xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                About Us
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                We're a passionate team dedicated to bringing you the latest and greatest in consumer technology.
                From cutting-edge laptops to premium audio gear — we source only the best.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: '🏆', title: 'Founded 2020', desc: 'Built from a passion for technology' },
                    { icon: '🌍', title: 'Island-Wide Delivery', desc: 'We deliver to every corner of Sri Lanka' },
                    { icon: '💯', title: 'Genuine Products', desc: 'Every item is verified and authentic' },
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
// function ContactPage() {
//     const [firstName, setFirstName] = useState("")
//     const [lastName, setLastName] = useState("")
//     const [email, setEmail] = useState("")
//     const [message, setMessage] = useState("")
//     return (
//         <div className="max-w-2xl mx-auto px-6 py-24">
//             <div className="text-center mb-12">
//                 <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">Get in Touch</p>
//                 <h1 className="text-5xl font-black text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Contact Us</h1>
//                 <p className="text-gray-500 mt-4">We'd love to hear from you. Send us a message!</p>
//             </div>
//             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-5">
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-semibold text-gray-700 block mb-2">First Name</label>
//                         <input type="text"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//                     </div>
//                     <div>
//                         <label className="text-sm font-semibold text-gray-700 block mb-2">Last Name</label>
//                         <input type="text"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//                     </div>
//                 </div>
//                 <div>
//                     <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
//                     <input type="email"
//                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-semibold text-gray-700 block mb-2">Message</label>
//                     <textarea rows={5}
//                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
//                 </div>
//                 <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20">
//                     Send Message →
//                 </button>
//             </div>
//         </div>
//     )
// }

// ─── 404 Page ─────────────────────────────────────────────────────────────────
function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-24">
            <p className="text-8xl font-black text-gray-100 select-none" style={{ fontFamily: "'Syne', sans-serif" }}>404</p>
            <h2 className="text-2xl font-black text-gray-800 -mt-4 mb-3">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
            <button onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20">
                Back to Home
            </button>
        </div>
    )
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <div className='w-full min-h-screen flex flex-col bg-gray-50'>
            <Headers />
            <main className="flex-1 w-full">
                <Routes path="/*">
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/overview/:id" element={<ProductOverviewPage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}
