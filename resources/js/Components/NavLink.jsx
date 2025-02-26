import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none dark:text-gray-200 ' +
                (active
                    ? 'border-rose-500 text-gray-800 focus:border-pink-500 dark:border-pink-500 dark:text-gray-100'
                    : 'border-transparent text-gray-500 hover:border-rose-300 hover:text-gray-700 focus:border-pink-400 focus:text-gray-700 dark:text-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300 dark:focus:text-gray-300') +
                className
            }
        >
            {children}
        </Link>
    );
}
