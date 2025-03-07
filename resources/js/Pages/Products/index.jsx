import CartModal from '@/Components/CartModal';
import Pagination from '@/Components/Pagination';
import TiltedCard from '@/Components/TiltedCard';
import { useCart } from '@/context/CartContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Filter, Search, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
        >
            <Link href={route('products.show', product.id)}>
                {product.images?.[0] && (
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <TiltedCard
                            imageSrc={`/storage/${product.images[0].image_url}`}
                            altText={product.name}
                            captionText={product.name}
                            containerHeight="100%"
                            containerWidth="100%"
                            imageHeight="100%"
                            imageWidth="100%"
                            rotateAmplitude={10}
                            scaleOnHover={1.15}
                            showTooltip={true}
                            displayOverlayContent={true}
                        />
                        <StockBadge stock={product.stock} />
                    </div>
                )}

                <div className="space-y-4 p-4 sm:p-5">
                    <h2 className="line-clamp-2 text-base font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-600 sm:text-lg dark:text-gray-200 dark:group-hover:text-blue-400">
                        {product.name}
                    </h2>
                    <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-lg font-bold text-transparent sm:text-xl dark:from-blue-400 dark:to-blue-600">
                            ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                            Stock: {product.stock}
                        </span>
                    </div>
                    <Categories categories={product.categories} />
                </div>
            </Link>

            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <AddToCartButton
                    stock={product.stock}
                    onAdd={() => onAddToCart(product)}
                />
            </div>
        </motion.div>
    );
};

const StockBadge = ({ stock }) => (
    <div
        className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium shadow-lg backdrop-blur-md transition-all duration-300 sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 ${stock > 0 ? 'bg-green-500/90 text-white dark:bg-green-600/90' : 'bg-red-500/90 text-white dark:bg-red-600/90'}`}
    >
        {stock > 0 ? 'In Stock' : 'Out of Stock'}
    </div>
);

const Categories = ({ categories }) => (
    <div className="flex flex-wrap gap-2">
        {categories?.length > 0 ? (
            categories.map((cat) => (
                <span
                    key={cat.id}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                    {cat.name}
                </span>
            ))
        ) : (
            <span className="text-xs italic text-gray-400">No categories</span>
        )}
    </div>
);

const AddToCartButton = ({ stock, onAdd }) => (
    <button
        onClick={stock > 0 ? onAdd : undefined}
        disabled={stock <= 0}
        className={`w-full rounded-xl px-3 py-2 font-semibold transition-all duration-300 sm:px-4 sm:py-3 ${
            stock > 0
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
        }`}
    >
        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
);

const CartButton = ({ onClick, itemCount = 0 }) => (
    <motion.button
        onClick={onClick}
        className="fixed bottom-2 right-2 z-50 md:bottom-4 md:right-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-2 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 md:p-3">
            <ShoppingCart size={24} className="md:size-12" />
            {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white md:-right-2 md:-top-2 md:h-5 md:w-5 md:text-xs">
                    {itemCount}
                </span>
            )}
        </div>
    </motion.button>
);
const SearchBar = ({ value, onChange }) => (
    <div className="relative mx-auto mb-4 w-full px-4 sm:mb-8 sm:max-w-md sm:px-0">
        <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
        />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-3 sm:pl-12 sm:pr-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
    </div>
);

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => (
    <div className="mx-auto mb-4 w-full max-w-5xl px-4 sm:mb-8 sm:px-0">
        <div className="mb-2 flex items-center space-x-2 sm:mb-3">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <h3 className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                Filter by Category
            </h3>
        </div>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelectCategory(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                    !selectedCategory
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
                All Products
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                        selectedCategory?.id === category.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">
                        ({category.products_count || 0})
                    </span>
                </button>
            ))}
        </div>
    </div>
);

export default function Products() {
    const { addToCart, cartItems } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { products = {}, categories = [] } = usePage().props;

    const filteredProducts = useMemo(() => {
        let list = products.data || [];
        if (searchTerm) {
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }
        if (selectedCategory) {
            list = list.filter((product) =>
                product.categories?.some(
                    (cat) => cat.id === selectedCategory.id,
                ),
            );
        }
        return list;
    }, [products.data, searchTerm, selectedCategory]);

    const handleAddToCart = async (product) => {
        try {
            const success = await addToCart(product);
            if (success) {
                toast.success(`${product.name} added to cart`, {
                    style: { background: '#4B5563', color: '#fff' },
                    iconTheme: { primary: '#10B981', secondary: '#fff' },
                });
            }
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-8 text-center sm:py-12"
                        >
                            <AlertCircle className="mx-auto h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
                            <h3 className="mt-3 text-base font-medium text-gray-900 sm:mt-4 sm:text-lg dark:text-white">
                                {searchTerm || selectedCategory
                                    ? 'No matching products found'
                                    : 'No products available'}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm dark:text-gray-400">
                                {searchTerm || selectedCategory
                                    ? 'Try adjusting your filters'
                                    : 'Check back later for new products'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {products.links && (
                    <div className="mt-6 sm:mt-8">
                        <Pagination
                            links={products.links}
                            className="my-custom-class"
                        />
                    </div>
                )}

                <CartButton
                    onClick={() => setIsModalOpen(true)}
                    itemCount={cartItems?.length}
                />

                <CartModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
