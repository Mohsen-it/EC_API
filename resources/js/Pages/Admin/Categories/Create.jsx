import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Create({ category = null }) {
    const isEditMode = !!category;
    const { data, setData, post, put, errors } = useForm({
        name: category?.name || "",
        description: category?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const requestMethod = isEditMode ? put : post;
        const routeName = isEditMode ? `admin.categories.update` : `admin.categories.store`;
        
        // تعديل طريقة إرسال المعرف في حالة التحديث
        const routeParams = isEditMode ? { category: category.id } : undefined;
        
        requestMethod(route(routeName, routeParams), data, {
            onSuccess: () => {
                toast.success(isEditMode ? "Category updated successfully!" : "Category created successfully!");
            },
            onError: () => {
                toast.error("Operation failed");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditMode ? "Edit Category" : "Create Category"} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800"
                >
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {isEditMode ? "Edit Category" : "Add New Category"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="space-y-4">
                                {/* Category Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter category name"
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
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter category description"
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
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {isEditMode ? "Update Category" : "Create Category"}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}