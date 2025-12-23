import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Image = ({ src, alt, className }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-gray-800 ${className}`}>
            {isLoading && !error && (
                <div className="absolute inset-0 bg-gray-700 animate-pulse" />
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center h-full w-full bg-gray-800 text-gray-500 p-4 text-center">
                    <ImageOff className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs">Image Unavailable</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setError(true);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
};

export default Image;
