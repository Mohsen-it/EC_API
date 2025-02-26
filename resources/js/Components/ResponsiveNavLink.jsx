import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-rose-400 bg-rose-50 text-rose-700 focus:border-pink-500 focus:bg-rose-100 focus:text-rose-800 dark:border-rose-500 dark:bg-rose-900/50 dark:text-rose-300 dark:focus:border-rose-300 dark:focus:bg-rose-900 dark:focus:text-rose-200'
                    : 'border-transparent text-gray-600 hover:border-rose-300 hover:bg-rose-50 hover:text-gray-800 focus:border-rose-300 focus:bg-rose-50 focus:text-gray-800 dark:text-gray-400 dark:hover:border-rose-600 dark:hover:bg-rose-700 dark:hover:text-gray-200 dark:focus:border-rose-600 dark:focus:bg-rose-700 dark:focus:text-gray-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}