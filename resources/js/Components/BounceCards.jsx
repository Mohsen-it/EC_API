import { gsap } from 'gsap';
import { useEffect } from 'react';

export default function BounceCards({
    className = '',
    images = [],
    containerWidth = 400,
    containerHeight = 400,
    animationDelay = 0.5,
    animationStagger = 0.06,
    easeType = 'elastic.out(1, 0.8)',
    transformStyles = [
        'rotate(10deg) translate(-170px)',
        'rotate(5deg) translate(-85px)',
        'rotate(-3deg)',
        'rotate(-10deg) translate(85px)',
        'rotate(2deg) translate(170px)',
    ],
    onClick, // إضافة الدالة onClick
}) {
    useEffect(() => {
        gsap.fromTo(
            '.card',
            { scale: 0 },
            {
                scale: 1,
                stagger: animationStagger,
                ease: easeType,
                delay: animationDelay,
            },
        );
    }, [animationStagger, easeType, animationDelay]);

    return (
        <div
            className={`absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center ${className}`}
            style={{
                width: containerWidth,
                height: containerHeight,
            }}
        >
            {images.map((src, idx) => (
                <div
                    key={idx}
                    className="card sm:border-6 absolute aspect-square w-16 cursor-pointer overflow-hidden rounded-[20px] border-4 border-white sm:w-20 sm:rounded-[25px] md:w-32 lg:w-40 lg:rounded-[30px] lg:border-8 xl:w-48"
                    style={{
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        transform:
                            transformStyles[idx] !== undefined
                                ? transformStyles[idx]
                                : 'none',
                    }}
                    onClick={() => onClick(idx)} // استدعاء الدالة onClick مع الـ index
                >
                    <img
                        className="h-full w-full object-cover"
                        src={src}
                        alt={`card-${idx}`}
                    />
                </div>
            ))}
        </div>
    );
}
