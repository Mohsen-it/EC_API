// src/Components/CartModal.jsx
import Modal from 'react-modal';
import { useCart } from '@/context/CartContext';
import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShoppingCart, Rocket, Sparkles } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
// تحديد العنصر الرئيسي للتطبيق (حسب إعدادات مشروعك)
Modal.setAppElement('#app');

export default function CartModal({ isOpen, onRequestClose }) {
    const { cart, updateQuantity, removeFromCart } = useCart();

    return (
        <>
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="fixed inset-0 flex justify-center items-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            
            <div className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded-lg w-96">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Your Cart</h2>
                <ul>
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <li key={item.id} className="flex justify-between items-center mb-4">
                                <span className="dark:text-white text-gray-700">
                                    {item.name} x {item.quantity}
                                </span>
                                <div className="  flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 bg-gray-300 rounded dark:text-white dark:bg-blue-600"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 bg-gray-300 rounded dark:bg-green-600"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-2 text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}
                </ul>
                {cart.length > 0 && (
                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold text-gray-800">
                            Total: $
                            {cart
                                .reduce((total, item) => total + item.price * item.quantity, 0)
                                .toFixed(2)}
                        </p>
                    </div>
                )}
                <button
                    onClick={onRequestClose}
                    className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </Modal>
        </>

    );
}
