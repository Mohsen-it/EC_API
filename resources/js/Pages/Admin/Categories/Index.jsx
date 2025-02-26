import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    SearchIcon,
    FolderIcon,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';

const PaginationButton = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md ${
            disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

export default function Index({ categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const categoriesArray = Array.isArray(categories) ? categories : [];

    const filteredAndSortedCategories = useMemo(() => {
        return categoriesArray
            .filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                const modifier = sortDirection === 'asc' ? 1 : -1;
                return a.name.localeCompare(b.name) * modifier;
            });
    }, [categoriesArray, searchTerm, sortField, sortDirection]);

    const totalItems = filteredAndSortedCategories.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = filteredAndSortedCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach(i => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const renderPagination = () => (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 px-4">
            <div className="flex items-center space-x-4">
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="rounded-md border-gray-300 text-sm dark:bg-gray-700 
                        dark:border-gray-600 dark:text-white focus:ring-blue-500 
                        focus:border-blue-500"
                >
                    {[10, 25, 50, 100].map(value => (
                        <option key={value} value={value}>
                            {value} per page
                        </option>
                    ))}
                </select>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </span>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                    <PaginationButton
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </PaginationButton>

                    <PaginationButton
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </PaginationButton>

                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum, index) => (
                            pageNum === '...' ? (
                                <span key={`dots-${index}`} className="px-3 py-1 text-gray-500">
                                    {pageNum}
                                </span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 
                                        ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    <PaginationButton
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </PaginationButton>

                    <PaginationButton
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </PaginationButton>
                </div>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Categories Management" />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6">
                            {/* Header Section */}
                            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FolderIcon className="w-6 h-6 mr-2 hidden sm:inline-block" />
                                    Categories ({categoriesArray.length})
                                </h2>
                                
                                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
                                    <div className="relative w-full sm:w-auto">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                        />
                                    </div>
                                    
                                    <Link
                                        href={route('admin.categories.create')}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition w-full sm:w-auto"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Category
                                    </Link>
                                </div>
                            </div>

                            {/* Content Section */}
                            {currentItems.length > 0 ? (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {currentItems.map((category) => (
                                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {category.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {category.description || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('admin.categories.edit', category.id)}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                >
                                                                    <PencilIcon className="w-5 h-5" />
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.categories.destroy', category.id)}
                                                                    method="delete"
                                                                    as="button"
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="grid grid-cols-1 gap-4 md:hidden">
                                        {currentItems.map((category) => (
                                            <div
                                                key={category.id}
                                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3"
                                            >
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {category.description || '-'}
                                                    </p>
                                                </div>

                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={route('admin.categories.edit', category.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.categories.destroy', category.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPagination()}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        No categories found
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new category.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}