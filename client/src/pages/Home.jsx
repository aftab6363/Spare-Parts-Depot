import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Image from '../components/Image';

const Home = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const { data } = await axios.get('/api/parts');
                setParts(data.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchParts();
    }, []);

    const searchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/inventory?keyword=${keyword}`);
        }
    }

    const categories = [
        { name: 'Engine', img: 'https://images.unsplash.com/photo-1588258524675-c63d59663e69?w=500' },
        { name: 'Brakes', img: 'https://images.unsplash.com/photo-1577747805177-3e198754b5df?w=500' },
        { name: 'Wheels', img: 'https://images.unsplash.com/photo-1549557766-2616f7344c8c?w=500' },
        { name: 'Interior', img: 'https://images.unsplash.com/photo-1582298642398-fe9d6cb257b4?w=500' },
    ];

    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-white/5 shadow-2xl isolate h-[600px] flex items-center justify-center">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-[-1] opacity-40">
                    <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" alt="Car Background" className="w-full h-full object-cover grayscale mix-blend-overlay" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide uppercase mb-6 inline-block backdrop-blur-md">
                            Automotive Excellence
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight tracking-tight">
                            Unleash The Beast
                        </h1>
                        <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed font-light">
                            Elevate your driving experience with precision-engineered components.
                            From track days to daily commutes, we demand perfection in every part.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        onSubmit={searchSubmit}
                        className="max-w-xl mx-auto relative group"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                        <input
                            type="text"
                            placeholder="Find your part (e.g., 'Turbo', 'Brakes')..."
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-5 pl-16 pr-8 text-white text-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/20 transition-all shadow-2xl"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </motion.form>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, title: "Rapid Logistics", desc: "Global shipping network ensures your parts arrive before your next race." },
                    { icon: Shield, title: "OEM & Performance", desc: "Certified authentic parts directly from world-class manufacturers." },
                    { icon: Truck, title: "Hassle-Free Returns", desc: "30-day satisfaction guarantee. If it doesn't fit, we fix it." },
                ].map((feature, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition duration-300 group">
                        <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-blue-500 transition duration-300">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Categories */}
            <section>
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-bold">Shop by Category</h2>
                    <Link to="/inventory" className="text-blue-400 hover:text-white flex items-center gap-2 transition">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link to={`/inventory?category=${cat.name}`} key={cat.name} className="group relative h-64 rounded-2xl overflow-hidden border border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                            <div className="absolute bottom-6 left-6 z-20">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Parts */}
            <section>
                <h2 className="text-3xl font-bold mb-10">Trending Now</h2>
                {loading ? <Loader /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {parts.map(part => (
                            <div key={part._id} className="glass-card rounded-2xl overflow-hidden group card-3d border-t border-white/10">
                                <div className="relative h-64 bg-gray-800">
                                    <Image src={part.image} alt={part.name} className="w-full h-full" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10 backdrop-blur-sm">
                                        <Link to={`/part/${part._id}`} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-blue-500 shadow-lg shadow-blue-500/50">
                                            Quick View
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{part.category}</p>
                                    <h3 className="text-lg font-bold text-white truncate mb-1 group-hover:text-blue-400 transition">{part.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{part.modelNumber}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-white text-glow">${part.price}</span>
                                        <Link to={`/part/${part._id}`} className="p-2 rounded-full bg-white/5 hover:bg-blue-500 hover:text-white transition text-gray-400 hover:scale-110 flex items-center justify-center">
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
