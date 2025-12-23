import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, CreditCard } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems.map(item => ({
                    ...item,
                    product: item._id
                })),
                shippingAddress: {
                    address: '123 Main St',
                    city: 'New York',
                    postalCode: '10001',
                    country: 'USA'
                },
                paymentMethod: 'PayPal',
                itemsPrice: total,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: total
            }, config);

            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert('Order failed');
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/30 rounded-xl">
                    <p className="text-xl text-gray-400 mb-4">Your cart is empty</p>
                    <Link to="/inventory" className="text-blue-400 hover:text-blue-300">Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item._id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between border border-gray-700">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                    <div>
                                        <Link to={`/part/${item._id}`} className="font-semibold text-lg hover:text-blue-400">{item.name}</Link>
                                        <p className="text-gray-400">${item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-gray-700 px-3 py-1 rounded">Qty: {item.qty}</span>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Items:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-700 my-4 pt-4 flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition"
                        >
                            <CreditCard className="h-5 w-5" />
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
