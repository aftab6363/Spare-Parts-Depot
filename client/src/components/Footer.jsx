import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#05080F] border-t border-white/5 pt-16 pb-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Spare Parts Depot
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted partner for premium automotive and machinery spare parts. Quality guaranteed, fast shipping.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
                            <li><Link to="/inventory" className="hover:text-blue-400 transition">Inventory</Link></li>
                            <li><Link to="/cart" className="hover:text-blue-400 transition">My Cart</Link></li>
                            <li><Link to="/dashboard" className="hover:text-blue-400 transition">My Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Categories</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/inventory?category=Engine" className="hover:text-blue-400 transition">Engine Parts</Link></li>
                            <li><Link to="/inventory?category=Brakes" className="hover:text-blue-400 transition">Brake Systems</Link></li>
                            <li><Link to="/inventory?category=Suspension" className="hover:text-blue-400 transition">Suspension</Link></li>
                            <li><Link to="/inventory?category=Electrical" className="hover:text-blue-400 transition">Electrical</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span>123 Auto Lane, Mechanic City, NY</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-500" />
                                <span>support@spareparts.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2025 Spare Parts Depot. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Facebook className="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer transition" />
                        <Twitter className="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer transition" />
                        <Instagram className="h-5 w-5 text-gray-500 hover:text-pink-500 cursor-pointer transition" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
