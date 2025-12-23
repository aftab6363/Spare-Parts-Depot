import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <Package className="h-8 w-8 text-blue-500" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Spare Parts Depot
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-300 hover:text-white transition">
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                                    Dashboard
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition font-medium">
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                                <div className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1 rounded-full">
                                    <User className="h-4 w-4 text-blue-400" />
                                    <span>{user.name}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition px-3 py-1"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition shadow-lg shadow-blue-500/30"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        <Link to="/cart" className="relative text-gray-300 hover:text-white transition">
                            <ShoppingCart className="h-6 w-6" />
                            {/* Cart Badge Placeholder */}
                            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span> */}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
