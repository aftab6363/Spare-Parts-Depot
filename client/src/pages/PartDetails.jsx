import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const PartDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [part, setPart] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPart = async () => {
            try {
                const { data } = await axios.get(`/api/parts/${id}`);
                setPart(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPart();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(part, qty);
        navigate('/cart');
    };

    if (!part) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition">
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                    <img src={part.image} alt={part.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{part.name}</h1>
                        <p className="text-xl text-blue-400 font-medium">Model: {part.modelNumber}</p>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                        <div className="flex justify-between items-center text-lg">
                            <span>Price:</span>
                            <span className="font-bold text-2xl">${part.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Status:</span>
                            <span className={part.countInStock > 0 ? 'text-green-400' : 'text-red-400'}>
                                {part.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {part.countInStock > 0 && (
                            <div className="flex justify-between items-center">
                                <span>Quantity:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                                >
                                    {[...Array(part.countInStock).keys()].slice(0, 10).map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={part.countInStock === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Add To Cart
                        </button>
                    </div>

                    <div className="prose prose-invert">
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-gray-300 leading-relaxed">{part.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartDetails;
