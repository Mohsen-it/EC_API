import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const PageButton = ({ children, active, disabled, url, onClick, className }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const baseClasses = cn(
        "relative inline-flex items-center justify-center",
        "min-w-[2.5rem] h-10 px-4",
        "text-sm font-medium tracking-wide",
        "transition-all duration-300 ease-in-out",
        "rounded-full shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "dark:focus:ring-offset-gray-900"
    );
    
    const variants = {
        active: cn(
            "border-2 border-blue-600",
            "bg-gradient-to-r from-blue-500 to-blue-700",
            "text-white font-semibold",
            "transform scale-110",
            "shadow-xl shadow-blue-500/30",
            "dark:from-blue-600 dark:to-blue-800",
            "dark:shadow-blue-700/30"
        ),
        default: cn(
            "border border-gray-300",
            "bg-white/70 backdrop-blur-md",
            "text-gray-800",
            "hover:bg-gray-100 hover:text-blue-700",
            "hover:border-blue-300 hover:shadow-lg",
            "dark:border-gray-700 dark:bg-gray-800/70",
            "dark:text-gray-200 dark:hover:bg-gray-700/70",
            "dark:hover:text-blue-400 dark:hover:border-blue-900"
        ),
        disabled: cn(
            "border border-gray-200",
            "bg-gray-100/50",
            "text-gray-400",
            "cursor-not-allowed",
            "dark:border-gray-800 dark:bg-gray-800/40",
            "dark:text-gray-600"
        ),
        loading: "opacity-75 cursor-wait"
    };

    const handleClick = async (e) => {
        if (disabled || isLoading) return;
        e.preventDefault();
        
        if (url) {
            setIsLoading(true);
            await router.visit(url, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false)
            });
        } else if (onClick) {
            onClick(e);
        }
    };

    const variantClass = cn(
        active ? variants.active : (disabled ? variants.disabled : variants.default),
        isLoading && variants.loading
    );
    
    const combinedClasses = cn(baseClasses, variantClass, className);

    return (
        <button
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={combinedClasses}
            aria-current={active ? "page" : undefined}
            aria-disabled={disabled || isLoading}
        >
            {isLoading ? (
                <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
};

const Pagination = ({ links, className }) => {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsNavigating(true);
        const handleEnd = () => setIsNavigating(false);

        // Capture the unsubscribe functions returned by router.on
        const unsubscribeStart = router.on('start', handleStart);
        const unsubscribeEnd = router.on('finish', handleEnd);

        return () => {
            // Call the unsubscribe functions to cleanup
            if (unsubscribeStart) unsubscribeStart();
            if (unsubscribeEnd) unsubscribeEnd();
        };
    }, []);

    const firstPage = links[0]?.url;
    const lastPage = links[links.length - 1]?.url;
    const currentPageIndex = links.findIndex(link => link.active);
    const prevPage = links[currentPageIndex - 1]?.url;
    const nextPage = links[currentPageIndex + 1]?.url;

    return (
        <nav 
            className={cn(
                "relative z-0",
                "flex justify-center",
                "mt-8 w-full",
                "px-4 sm:px-0",
                isNavigating && "pointer-events-none opacity-75",
                className
            )} 
            aria-label="Pagination"
            role="navigation"
        >
            <div className="relative z-10 flex items-center justify-center gap-3">
                <PageButton
                    url={firstPage}
                    disabled={!firstPage || isNavigating}
                    className="hidden sm:flex hover:scale-110 transition-transform"
                    aria-label="Go to first page"
                >
                    <ChevronsLeft className="w-5 h-5 stroke-[2.5]" />
                </PageButton>

                <PageButton
                    url={prevPage}
                    disabled={!prevPage || isNavigating}
                    className="hover:scale-110 transition-transform"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </PageButton>

                <ul className="inline-flex items-center gap-2">
                    {links.map((link, index) => {
                        if (index === 0 || index === links.length - 1) return null;
                        
                        return (
                            <li key={index} className="transition-transform hover:scale-110">
                                <PageButton
                                    url={link.url}
                                    active={link.active}
                                    disabled={!link.url || isNavigating}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </PageButton>
                            </li>
                        );
                    })}
                </ul>

                <PageButton
                    url={nextPage}
                    disabled={!nextPage || isNavigating}
                    className="hover:scale-110 transition-transform"
                    aria-label="Go to next page"
                >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </PageButton>

                <PageButton
                    url={lastPage}
                    disabled={!lastPage || isNavigating}
                    className="hidden sm:flex hover:scale-110 transition-transform"
                    aria-label="Go to last page"
                >
                    <ChevronsRight className="w-5 h-5 stroke-[2.5]" />
                </PageButton>
            </div>
        </nav>
    );
};

export default Pagination;