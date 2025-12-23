import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [parts, setParts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const [partsRes, ordersRes] = await Promise.all([
                    axios.get('/api/parts'),
                    axios.get('/api/orders', config)
                ]);

                setParts(partsRes.data);
                setOrders(ordersRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchData();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this part?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/parts/${id}`, config);
                setParts(parts.filter(part => part._id !== id));
            } catch (error) {
                alert('Error deleting part');
            }
        }
    };

    const handleDeliver = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`/api/orders/${id}/deliver`, {}, config);
                setOrders(orders.map(order => order._id === id ? { ...order, isDelivered: true, deliveredAt: Date.now() } : order));
            } catch (error) {
                alert('Update failed');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage global inventory and track orders</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-xl transition ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-xl transition ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                    >
                        Orders
                    </button>
                    {activeTab === 'inventory' && (
                        <Link to="/admin/part/new" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
                            <Plus className="h-5 w-5" />
                            Add Part
                        </Link>
                    )}
                </div>
            </div>

            {activeTab === 'inventory' ? (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-2">
                        <Package className="text-blue-400" />
                        <h2 className="text-xl font-semibold">Inventory List ({parts.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Image</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Model</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {parts.map(part => (
                                    <tr key={part._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <img src={part.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                        </td>
                                        <td className="p-4 font-medium">{part.name}</td>
                                        <td className="p-4 text-gray-400">{part.modelNumber}</td>
                                        <td className="p-4 text-blue-400 font-bold">${part.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${part.countInStock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {part.countInStock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link to={`/admin/part/${part._id}/edit`} className="inline-block p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors">
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(part._id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-2">
                        <Package className="text-purple-400" />
                        <h2 className="text-xl font-semibold">All Orders ({orders.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Paid</th>
                                    <th className="p-4">Delivered</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-400">{order._id.substring(0, 8)}...</td>
                                        <td className="p-4 font-bold">{order.user && order.user.name}</td>
                                        <td className="p-4 text-gray-400">{order.createdAt.substring(0, 10)}</td>
                                        <td className="p-4 font-bold">${order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4">
                                            {order.isPaid ? (
                                                <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">Paid</span>
                                            ) : (
                                                <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {order.isDelivered ? (
                                                <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">Delivered</span>
                                            ) : (
                                                <span className="text-yellow-400 text-xs bg-yellow-500/10 px-2 py-1 rounded">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right flex items-center justify-end gap-2">
                                            <Link to={`/order/${order._id}`} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-sm transition">
                                                Details
                                            </Link>
                                            {!order.isDelivered && order.isPaid && (
                                                <button
                                                    onClick={() => handleDeliver(order._id)}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition"
                                                >
                                                    Deliver
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
