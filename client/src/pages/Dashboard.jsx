import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end border-b border-gray-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
                </div>
            </header>

            <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Package className="text-blue-500" />
                    Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700">
                        <p className="text-gray-400">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Order ID: {order._id}</p>
                                    <p className="text-lg font-medium">{order.orderItems.length} Items</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-blue-400">${order.totalPrice.toFixed(2)}</p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs mt-2 ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
