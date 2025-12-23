import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import Loader from '../components/Loader';

const AdminPartEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const isEdit = !!id;

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
        }

        if (isEdit) {
            const fetchPart = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/api/parts/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setBrand(data.brand);
                    setCategory(data.category);
                    setCountInStock(data.countInStock);
                    setDescription(data.description);
                    setModelNumber(data.modelNumber);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            }
            fetchPart();
        }
    }, [id, isEdit, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        const partData = {
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
            modelNumber
        };

        try {
            setLoading(true);
            if (isEdit) {
                await axios.put(`/api/parts/${id}`, partData, config);
            } else {
                await axios.post('/api/parts', partData, config);
            }
            setLoading(false);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert('Error saving part');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-3xl mx-auto">
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {isEdit ? 'Edit Part' : 'Add New Part'}
            </h1>

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Name</label>
                        <input type="text" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Model Number</label>
                        <input type="text" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Price</label>
                        <input type="number" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Stock Count</label>
                        <input type="number" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Brand</label>
                        <input type="text" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Category</label>
                        <input type="text" className="w-full glass-input px-4 py-3 rounded-lg text-white" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Image URL</label>
                    <div className="relative">
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="text" className="w-full glass-input pl-10 pr-4 py-3 rounded-lg text-white" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://..." />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea className="w-full glass-input px-4 py-3 rounded-lg text-white h-32" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg">
                    <Save className="h-5 w-5" />
                    {isEdit ? 'Update Part' : 'Create Part'}
                </button>
            </form>
        </div>
    );
};

export default AdminPartEdit;
