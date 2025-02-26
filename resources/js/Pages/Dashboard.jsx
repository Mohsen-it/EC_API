import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShoppingCart, Sparkles, Star, Heart, Crown } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const floatingParticles = Array(20).fill(null);

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen relative overflow-hidden bg-white/80 dark:bg-gray-800 ">

                {/* Animated Background Particles */}
                {floatingParticles.map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-rose-500 opacity-30 dark:bg-rose-500"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            width: Math.random() * 20 + 10,
                            height: Math.random() * 20 + 10,
                        }}
                    />
                ))}

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
                    {/* Luxury Brand Logo */}
                    <motion.div
                        className="mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <Crown className="w-16 h-16 text-rose-400" />
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        className="text-5xl md:text-7xl font-serif text-gray-800 mb-6 text-center dark:text-gray-200"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Luxury Beauty
                        <motion.span
                            className="block text-2xl md:text-3xl text-rose-400 mt-2 font-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Elevate Your Beauty Ritual
                        </motion.span>
                    </motion.h1>

                    {/* Feature Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 w-full max-w-6xl"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        {[
                            { icon: Sparkles, title: "Premium Quality", desc: "Luxury ingredients" },
                            { icon: Star, title: "Expert Crafted", desc: "Professional formulas" },
                            { icon: Heart, title: "Clean Beauty", desc: "Pure & natural" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ type: "spring" }}
                            >
                                <feature.icon className="w-10 h-10 text-rose-400 mb-4" />
                                <h3 className="text-xl font-serif text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}

                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/products">
                            <button className="px-12 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-serif text-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl">
                                Explore Collection
                                <ShoppingCart className="inline-block ml-2 w-5 h-5" />
                            </button>
                        </Link>


                    </motion.div>

                    {/* Floating Elements */}
                    {/* Animated Floating Elements */}
                    <motion.div
                        className="absolute top-20 right-20 text-6xl"
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 left-20 text-6xl"
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    >
                        🌸
                    </motion.div>

                    {/* Additional Floating Elements */}
                    <motion.div
                        className="absolute top-10 left-1/3 text-5xl"
                        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        💎
                    </motion.div>
                    <motion.div
                        className="absolute bottom-10 right-1/4 text-5xl"
                        animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        🌿
                    </motion.div>
                    <motion.div
                        className="absolute top-1/4 left-10 text-4xl"
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        🎀
                    </motion.div>
                    <motion.div
                        className="absolute bottom-1/3 right-10 text-4xl"
                        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    >
                        ⭐
                    </motion.div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
