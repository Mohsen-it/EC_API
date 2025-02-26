import { useCart } from '@/context/CartContext';
import Modal from 'react-modal';

// تحديد العنصر الرئيسي للتطبيق (حسب إعدادات مشروعك)
Modal.setAppElement('#app');

export default function CartModal({ isOpen, onRequestClose }) {
    const { cart, updateQuantity, removeFromCart } = useCart();

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:text-white">
                <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
                    Your Cart
                </h2>
                <ul className="space-y-4">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between"
                            >
                                <span className="text-gray-700 dark:text-white">
                                    {item.name} x {item.quantity}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        }
                                        className="rounded bg-gray-300 px-2 py-1 text-sm dark:bg-blue-600 dark:text-white"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1,
                                            )
                                        }
                                        className="rounded bg-gray-300 px-2 py-1 text-sm dark:bg-green-600"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-2 text-sm text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-300">
                            Your cart is empty.
                        </p>
                    )}
                </ul>
                {cart.length > 0 && (
                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            Total: $
                            {cart
                                .reduce(
                                    (total, item) =>
                                        total + item.price * item.quantity,
                                    0,
                                )
                                .toFixed(2)}
                        </p>
                    </div>
                )}
                <button
                    onClick={onRequestClose}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition duration-300"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}
