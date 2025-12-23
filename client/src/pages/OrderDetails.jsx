import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { CreditCard, CheckCircle, Truck, MapPin, User, Calendar } from 'lucide-react';
import Image from '../components/Image';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/orders/${id}`, config);
            setOrder(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const handlePayment = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`/api/orders/${id}/pay`, {}, config);
            fetchOrder(); // Refresh data
            alert('Payment Successful! (Test Mode)');
        } catch (error) {
            console.error(error);
            alert('Payment Failed');
        }
    };

    const handleDeliver = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            fetchOrder();
        } catch (error) {
            console.error(error);
            alert('Update Failed');
        }
    };

    if (loading) return <Loader />;
    if (!order) return <div className="text-center py-20 text-white">Order not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Order #{order._id}
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Order Meta */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CheckCircle className="text-blue-400" /> Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-800 rounded-lg overflow-hidden">
                                            <Image src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <Link to={`/part/${item.product}`} className="font-bold hover:text-blue-400 transition">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-400">Qty: {item.qty} x ${item.price}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg">${(item.qty * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Truck className="text-purple-400" /> Shipping Info
                        </h2>
                        <div className="space-y-2 text-gray-300">
                            <p className="flex items-center gap-2"><User className="h-4 w-4" /> <span className="font-bold">Name:</span> {order.user.name} ({order.user.email})</p>
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span className="font-bold">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            <div className={`mt-4 p-3 rounded-lg text-center font-bold ${order.isDelivered ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {order.isDelivered ? `Delivered at ${order.deliveredAt.substring(0, 10)}` : 'Not Delivered'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary & Actions */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className={`mt-6 p-4 rounded-xl flex items-center justify-center gap-2 font-bold ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {order.isPaid ? (
                                <>
                                    <CheckCircle className="h-5 w-5" /> Paid on {order.paidAt.substring(0, 10)}
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-5 w-5" /> Not Paid
                                </>
                            )}
                        </div>

                        {/* FAKE PAYMENT BUTTON */}
                        {!order.isPaid && (
                            <button
                                onClick={handlePayment}
                                className="w-full mt-4 btn-primary py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <CreditCard className="h-5 w-5" />
                                Test Pay Now
                            </button>
                        )}

                        {/* ADMIN ACTIONS */}
                        {user.role === 'admin' && order.isPaid && !order.isDelivered && (
                            <button
                                onClick={handleDeliver}
                                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                            >
                                <Truck className="h-5 w-5" />
                                Mark As Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
