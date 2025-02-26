import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-gray-800 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div className="transition-transform duration-300 hover:scale-110">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-700 dark:text-white" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white text-gray-800 dark:bg-gray-800 px-6 py-4 shadow-lg sm:max-w-md sm:rounded-lg  dark:text-gray-200">
                {children}
            </div>
        </div>
    );
}
