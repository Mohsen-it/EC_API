// Sidebar.jsx
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isAdmin }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
          {/* زر التبديل */}
          {isAdmin &&(
            <button 
                onClick={toggleSidebar}
                className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r-lg cursor-pointer z-50 hover:bg-gray-700"
            >
                ☰
            </button>
        )}
            {/* الشريط الجانبي */}
            <AnimatePresence>
                {isAdmin && isOpen && (
                    <>
                        <motion.aside
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-5 shadow-lg z-40"
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-bold text-gray-700 dark:text-white">Admin Panel</h2>
                                <button 
                                    onClick={toggleSidebar}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav>
                                <ul className="space-y-4">
                                    <li>
                                        <Link 
                                            href={route('admin.dashboard')} 
                                            className="block p-3 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('admin.products.index')} 
                                            className="block p-3 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Product
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('admin.categories.index')} 
                                            className="block p-3 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Category
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </motion.aside>

                        {/* Overlay */}
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}