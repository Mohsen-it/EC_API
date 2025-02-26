import { useState, useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { useCart } from '@/context/CartContext';
import CartModal from '@/Components/CartModal';
import TiltedCard from '@/Components/TiltedCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, AlertCircle, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="group bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
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

                <div className="p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 dark:text-gray-200 dark:group-hover:text-blue-400">
                        {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 dark:text-gray-400">
                        {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-600">
                            ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Stock: {product.stock}
                        </span>
                    </div>
                    <Categories categories={product.categories} />
                </div>
            </Link>

            <div className="px-5 pb-5">
                <AddToCartButton stock={product.stock} onAdd={() => onAddToCart(product)} />
            </div>
        </motion.div>
    );
};

const StockBadge = ({ stock }) => (
    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-md transition-all duration-300
        ${stock > 0 ? 'bg-green-500/90 text-white dark:bg-green-600/90' : 'bg-red-500/90 text-white dark:bg-red-600/90'}`}>
        {stock > 0 ? 'In Stock' : 'Out of Stock'}
    </div>
);

const Categories = ({ categories }) => (
    <div className="flex flex-wrap gap-2">
        {categories?.length > 0 ? (
            categories.map(cat => (
                <span key={cat.id} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {cat.name}
                </span>
            ))
        ) : (
            <span className="text-sm italic text-gray-400">No categories</span>
        )}
    </div>
);

const AddToCartButton = ({ stock, onAdd }) => (
    <button
        onClick={stock > 0 ? onAdd : undefined}
        disabled={stock <= 0}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300
            ${stock > 0
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'}
        `}
    >
        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
);

const CartButton = ({ onClick, itemCount = 0 }) => (
    <motion.button
        onClick={onClick}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="relative p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
            <ShoppingCart size={28} />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </div>
    </motion.button>
);

const SearchBar = ({ value, onChange }) => (
    <div className="relative w-full max-w-md mx-auto mb-8 px-4 sm:px-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
    </div>
);

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => (
    <div className="w-full max-w-5xl mx-auto mb-8 px-4 sm:px-0">
        <div className="flex items-center space-x-2 mb-3">
            <Filter size={20} className="text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelectCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${!selectedCategory
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
                `}
            >
                All Products
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${selectedCategory?.id === category.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
                    `}
                >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">({category.products_count || 0})</span>
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
    const { products = {}, categories = [] } = usePage().props; // Receive products and categories from props

    // Compute filtered products based on search and category filters
    const filteredProducts = useMemo(() => {
        let list = products.data || [];

        if (searchTerm) {
            list = list.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            list = list.filter(product =>
                product.categories?.some(cat => cat.id === selectedCategory.id)
            );
        }

        return list;
    }, [products.data, searchTerm, selectedCategory]);

    const handleAddToCart = async (product) => {
        try {
            const success = await addToCart(product);
            if (success) {
                toast.success(`${product.name} added to cart`, {
                    style: {
                        background: '#4B5563',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                        >
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-12"
                        >
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                {searchTerm || selectedCategory ? 'No matching products found' : 'No products available'}
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Check back later for new products'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {products.links && (
                    <div className="mt-8">
                        <Pagination links={products.links} className="my-custom-class" />
                    </div>
                )}

                <CartButton
                    onClick={() => setIsModalOpen(true)}
                    itemCount={cartItems?.length}
                />

                <CartModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
            </div>
        </AuthenticatedLayout>
    );
}