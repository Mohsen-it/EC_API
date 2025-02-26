import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // تأكد من تعديل المسار حسب بنية المشروع
import CartModal from '@/Components/CartModal';
import BounceCards from '@/Components/BounceCards'


const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)"
];



const ProductShow = ({ product }) => {
    const [mainImage, setMainImage] = useState(product.images[0]?.image_url || '/default-image.jpg');
    // const baseUrl = "http://127.0.0.1:8000/storage/"; // المسار الصحيح للصور
    const baseUrl = import.meta.env.VITE_STORAGE_URL;
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // دالة لإضافة منتج للسلة باستخدام الدالة من الـ Context
    const handleAddToCart = async (product) => {
        const success = await addToCart(product);
        // if (success) {
        //     alert(`${product.name} has been added to your cart!`);
        // }
    };

    return (
        <AuthenticatedLayout>

            <div className="container mx-auto p-6">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    {/* صورة المنتج الرئيسية */}
                    <div className="flex justify-center">
                        <img
                            src={baseUrl + mainImage} // استخدم الصورة الرئيسية هنا
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* باقي الصور المصغّرة */}
                    {product.images.length > 0 && (
                        <div className="flex gap-2 mt-4 justify-center overflow-x-auto">
                            <BounceCards
                                className="custom-class"
                                images={product.images.map(image => `${baseUrl}${image.image_url}`)} // تمرير مصفوفة الصور
                                containerWidth={300}
                                containerHeight={300}
                                animationDelay={1}
                                animationStagger={0.08}
                                easeType="elastic.out(1, 0.5)"
                                transformStyles={transformStyles}
                                onClick={(index) => {
                                    const selectedImage = product.images[index].image_url;
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
                        <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
                   
                        <p className="text-gray-600 mt-2">{product.description}</p>

                        {/* السعر */}
                        <div className="mt-4">
                            <span className="text-lg font-bold text-green-600">{`${product.price}$`}</span>
                        </div>

                        {/* خصم إن وجد */}
                        {product.discount && (
                            <div className="mt-2">
                                <span className="text-red-500 line-through">{`$${product.original_price}`}</span>
                                <span className="ml-2 text-green-600 font-semibold">{`${product.discount}% Off`}</span>
                            </div>
                        )}
                    </div>
                    {product.stock > 0 ? (
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 focus:ring-4 focus:ring-blue-300"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                        >
                            Out of Stock
                        </button>
                    )}

                    {/* زر عرض السلة */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg"
                    >
                        View Cart
                    </button>
                    <CartModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductShow;
