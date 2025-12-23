import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, ArrowRight } from 'lucide-react';
import Loader from '../components/Loader';
import Image from '../components/Image';
import { motion } from 'framer-motion';

const Inventory = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter States
    const keyword = searchParams.get('keyword') || '';
    const categoryParam = searchParams.get('category') || 'All';
    const sortParam = searchParams.get('sort') || 'newest';

    const [searchTerm, setSearchTerm] = useState(keyword);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [sortBy, setSortBy] = useState(sortParam);

    const categories = ['All', 'Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Transmission', 'Wheels', 'Interior', 'Ignition'];

    // Sync state with URL params
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'All');
        setSearchTerm(searchParams.get('keyword') || '');
        setSortBy(searchParams.get('sort') || 'newest');
    }, [searchParams]);

    useEffect(() => {
        const fetchParts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (searchTerm) query.append('keyword', searchTerm);
                if (selectedCategory !== 'All') query.append('category', selectedCategory);
                query.append('sort', sortBy);

                const { data } = await axios.get(`/api/parts?${query.toString()}`);
                if (Array.isArray(data)) {
                    setParts(data);
                } else {
                    console.error("API did not return an array", data);
                    setParts([]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        // Debounce search
        const timeout = setTimeout(() => {
            fetchParts();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchTerm, selectedCategory, sortBy]);

    // Update URL when filters change
    // Update URL when filters change (User Interaction)
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'All') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 glass-card p-6 rounded-2xl sticky top-24 shrink-0">
                <div className="flex items-center gap-2 mb-6 text-gray-400">
                    <Filter className="h-5 w-5" />
                    <span className="font-semibold uppercase tracking-wider text-sm">Filters</span>
                </div>

                <div className="space-y-8">
                    {/* Category Filter */}
                    <div>
                        <h3 className="font-bold mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white font-medium'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full">
                {/* Header & Search */}
                <div className="glass-card p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by Model Number..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Debounce URL update could go here, or just let user hit enter. 
                                // For now, let's just update local search term and trigger fetch via debounce effect below?
                                // Actually, let's keep search local and sync to URL on debounce.
                            }}
                            // Add onKeyDown or simple debounce
                            className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-gray-400 text-sm hidden md:block">Sort By:</span>
                        <div className="relative w-full md:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSearchParams(prev => {
                                    prev.set('sort', e.target.value);
                                    return prev;
                                })}
                                className="w-full appearance-none glass-input rounded-xl py-2.5 px-4 pr-10 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="newest" className="bg-gray-900">Newest Arrivals</option>
                                <option value="low" className="bg-gray-900">Price: Low to High</option>
                                <option value="high" className="bg-gray-900">Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? <Loader /> : (
                    <>
                        <p className="mb-4 text-gray-400 text-sm">Showing {parts.length} results</p>

                        {parts.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <p className="text-xl text-gray-400">No parts found matching your criteria</p>
                                <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-blue-400 hover:underline">Clear Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {parts.map((part, index) => (
                                    <div
                                        key={part._id || index}
                                        className="glass-card rounded-xl overflow-hidden group card-3d flex flex-col border-t border-white/10"
                                    >
                                        <div className="relative h-48 bg-gray-800 shrink-0">
                                            <div className="w-full h-full">
                                                <Image
                                                    src={part.image}
                                                    alt={part.name}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            {/* Badge */}
                                            {part.countInStock < 5 && part.countInStock > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10 box-shadow-md">LOW STOCK</div>
                                            )}

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10 backdrop-blur-sm">
                                                <Link to={`/part/${part._id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transform scale-90 group-hover:scale-100 transition duration-300 shadow-lg shadow-blue-500/50">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">{part.category}</p>
                                                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-400 transition" title={part.name}>{part.name}</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4 font-mono bg-white/5 inline-block px-2 py-1 rounded w-fit border border-white/5">{part.modelNumber}</p>

                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500">Price</p>
                                                    <span className="text-xl font-bold text-white text-glow">${part.price}</span>
                                                </div>
                                                <Link to={`/part/${part._id}`} className="p-2 bg-white/5 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group-hover:border-blue-500/30 border border-transparent">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Inventory;
