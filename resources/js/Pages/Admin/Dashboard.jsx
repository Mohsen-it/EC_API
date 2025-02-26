import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { 
    Users, 
    Package, 
    Tags,
    AlertCircle
} from "lucide-react";

export default function Dashboard() {
    const { 
        usersCount = 0, 
        productsCount = 0, 
        categoriesCount = 0,
        error,
        auth 
    } = usePage().props;

    const statsCards = [
        {
            title: "Total Users",
            value: usersCount,
            icon: Users,
            color: "blue",
            description: "Total registered users"
        },
        {
            title: "Total Products",
            value: productsCount,
            icon: Package,
            color: "green",
            description: "Products in catalog"
        },
        {
            title: "Categories",
            value: categoriesCount,
            icon: Tags,
            color: "purple",
            description: "Product categories"
        }
    ];

    const getBackgroundColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 dark:bg-blue-900/20',
            green: 'bg-green-100 dark:bg-green-900/20',
            purple: 'bg-purple-100 dark:bg-purple-900/20',
            red: 'bg-red-100 dark:bg-red-900/20'
        };
        return colors[color] || colors.blue;
    };

    const getTextColor = (color) => {
        const colors = {
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            purple: 'text-purple-600 dark:text-purple-400',
            red: 'text-red-600 dark:text-red-400'
        };
        return colors[color] || colors.blue;
    };

    if (error) {
        return (
            <AuthenticatedLayout>
                <div className="p-4 flex items-center space-x-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        Welcome back, {auth?.user?.name}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {statsCards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {card.title}
                                        </p>
                                        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                                            {card.value}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {card.description}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${getBackgroundColor(card.color)}`}>
                                        <card.icon className={`w-6 h-6 ${getTextColor(card.color)}`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}