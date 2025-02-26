import BounceCards from '@/Components/BounceCards';
import CartModal from '@/Components/CartModal';
import { useCart } from '@/context/CartContext'; // تأكد من تعديل المسار حسب بنية المشروع
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

const transformStyles = [
    'rotate(5deg) translate(-150px)',
    'rotate(0deg) translate(-70px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(70px)',
    'rotate(-5deg) translate(150px)',
];

const ProductShow = ({ product }) => {
    const [mainImage, setMainImage] = useState(
        product.images[0]?.image_url || '/default-image.jpg',
    );
    // const baseUrl = "http://127.0.0.1:8000/storage/"; // المسار الصحيح للصور
    const baseUrl = import.meta.env.VITE_STORAGE_URL;
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // دالة لإضافة منتج للسلة باستخدام الدالة من الـ Context
    const handleAddToCart = async (product) => {
        await addToCart(product);
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-6">
                <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
                    {/* صورة المنتج الرئيسية */}
                    <div className="flex justify-center">
                        <img
                            src={baseUrl + mainImage} // استخدم الصورة الرئيسية هنا
                            alt={product.name}
                            className="h-96 w-full rounded-lg object-cover"
                        />
                    </div>

                    {/* باقي الصور المصغّرة */}
                    {product.images.length > 0 && (
                        <div className="mt-4 flex justify-center gap-2 overflow-x-auto">
                            <BounceCards
                                className="custom-class"
                                images={product.images.map(
                                    (image) => `${baseUrl}${image.image_url}`,
                                )} // تمرير مصفوفة الصور
                                containerWidth={300}
                                containerHeight={300}
                                animationDelay={1}
                                animationStagger={0.08}
                                easeType="elastic.out(1, 0.5)"
                                transformStyles={transformStyles}
                                onClick={(index) => {
                                    const selectedImage =
                                        product.images[index].image_url;
                                    setMainImage(selectedImage); // تحديث الصورة الرئيسية
                                }}
                            />
                        </div>
                    )}

                    {/* تفاصيل المنتج */}
                    <div className="mt-6">
                        <br />
                        <br />
                        <br />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {product.name}
                        </h2>

                        <p className="mt-2 text-gray-600">
                            {product.description}
                        </p>

                        {/* السعر */}
                        <div className="mt-4">
                            <span className="text-lg font-bold text-green-600">{`${product.price}$`}</span>
                        </div>

                        {/* خصم إن وجد */}
                        {product.discount && (
                            <div className="mt-2">
                                <span className="text-red-500 line-through">{`$${product.original_price}`}</span>
                                <span className="ml-2 font-semibold text-green-600">{`${product.discount}% Off`}</span>
                            </div>
                        )}
                    </div>
                    {product.stock > 0 ? (
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full cursor-not-allowed rounded-lg bg-gray-400 py-3 font-semibold text-white"
                        >
                            Out of Stock
                        </button>
                    )}

                    {/* زر عرض السلة */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="fixed bottom-8 right-8 rounded-full bg-blue-600 p-4 text-white shadow-lg"
                    >
                        View Cart
                    </button>
                    <CartModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductShow;
