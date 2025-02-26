import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function Create({ categories, product = null}) {
    const isEditMode = !!product;
    const { data, setData, post, put, errors, progress } = useForm({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        stock: product?.stock || "",
        categories: product?.categories?.map(cat => cat.id) || [],
        images: null,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [previewUrls, setPreviewUrls] = useState(product?.images || []);

    const validateFiles = (files) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 10 * 1024 * 1024;

        for (let file of files) {
            if (!validTypes.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}`);
                return false;
            }
            if (file.size > maxSize) {
                toast.error(`File too large: ${file.name}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.images && previewUrls.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        data.categories.forEach(category => formData.append('categories[]', category));

        if (data.images) {
            Array.from(data.images).forEach(file => formData.append('images[]', file));
        }

        const requestMethod = isEditMode ? put : post;
        const routeName = isEditMode ? `admin.products.update` : `admin.products.store`;
        
        requestMethod(route(routeName, isEditMode ? product.id : undefined), {
            data: formData,
            onSuccess: () => {
                toast.success(isEditMode ? "Product updated successfully!" : "Product created successfully!");
            },
            onError: () => {
                toast.error("Operation failed");
            },
        });
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && validateFiles(files)) {
            setData("images", files);
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...urls]);
        }
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (validateFiles(files)) {
            setData("images", files);
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => {
                prev.forEach(url => URL.revokeObjectURL(url));
                return urls;
            });
        }
    }, [setData]);

    const removeImage = (index) => {
        const newPreviewUrls = [...previewUrls];
        URL.revokeObjectURL(newPreviewUrls[index]);
        newPreviewUrls.splice(index, 1);
        setPreviewUrls(newPreviewUrls);

        if (data.images) {
            const dt = new DataTransfer();
            Array.from(data.images).forEach((file, i) => {
                if (i !== index) dt.items.add(file);
            });
            setData("images", dt.files);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditMode ? "Edit Product" : "Create Product"} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800"
                >
                    <div className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Product" : "Add New Product"}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Product Name */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter product name"
                                        required
                                    />
                                    {errors.name && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.name}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter product description"
                                    />
                                    {errors.description && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.description}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 sm:top-3 text-gray-500 dark:text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData("price", e.target.value)}
                                            className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="0.00"
                                            required
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    {errors.price && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.price}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData("stock", e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter stock quantity"
                                        required
                                        min="0"
                                    />
                                    {errors.stock && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.stock}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Categories
                                    </label>
                                    <select
                                        multiple
                                        value={data.categories}
                                        onChange={(e) => setData("categories", [...e.target.selectedOptions].map(o => o.value))}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        {categories?.length > 0 ? (
                                            categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Loading categories...</option>
                                        )}
                                    </select>
                                    {errors.categories && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.categories}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Product Images
                                    </label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 transition-all duration-200 ease-in-out ${
                                            isDragging
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                            <div className="mt-2 sm:mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <span>Upload files</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        multiple
                                                        accept="image/jpeg,image/png,image/gif"
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image Previews */}
                                    {previewUrls.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <AnimatePresence>
                                                {previewUrls.map((url, index) => (
                                                    <motion.div
                                                        key={url}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="relative aspect-square rounded-lg overflow-hidden group"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {progress && (
                                        <div className="mt-4">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress.percentage}%` }}
                                                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                Uploading... {progress.percentage}%
                                            </p>
                                        </div>
                                    )}

                                    {errors.images && (
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-sm text-red-500 dark:text-red-400"
                                        >
                                            {errors.images}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                      {isEditMode ? "Update Product" : "Create Product"}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}