import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-2 truncate" onClick={closeMenu}>
                        <Package className="h-8 w-8 text-blue-500 flex-shrink-0" />
                        <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Spare Parts Depot
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-300 hover:text-white transition">
                            Home
                        </Link>
                        <Link to="/inventory" className="text-gray-300 hover:text-white transition">
                            Inventory
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
                        </Link>
                    </div>

                    {/* Mobile Menu Button - visible only on mobile */}
                    <div className="flex md:hidden items-center gap-4">
                        <Link to="/cart" className="relative text-gray-300 hover:text-white transition" onClick={closeMenu}>
                            <ShoppingCart className="h-6 w-6" />
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-800 border-t border-gray-700 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-3 flex flex-col">
                            <Link to="/" className="text-gray-300 hover:text-white py-2 block" onClick={closeMenu}>
                                Home
                            </Link>
                            <Link to="/inventory" className="text-gray-300 hover:text-white py-2 block" onClick={closeMenu}>
                                Inventory
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white py-2 block" onClick={closeMenu}>
                                        Dashboard
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 py-2 block font-medium" onClick={closeMenu}>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-2 rounded-lg w-fit mt-2">
                                        <User className="h-4 w-4 text-blue-400" />
                                        <span>{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-gray-300 hover:text-red-400 py-2 w-full text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 mt-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-white py-2 block"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-center shadow-lg shadow-blue-500/30 block"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
