import { useEffect } from "react";
import { gsap } from "gsap";

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)"
  ],
  onClick // إضافة الدالة onClick
}) {
  useEffect(() => {
    gsap.fromTo(
      ".card",
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay
      }
    );
  }, [animationStagger, easeType, animationDelay]);

  return (
    <div
      className={`absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className="card absolute w-16 sm:w-20 md:w-32 lg:w-40 xl:w-48 aspect-square border-4 sm:border-6 lg:border-8 border-white rounded-[20px] sm:rounded-[25px] lg:rounded-[30px] overflow-hidden cursor-pointer"
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            transform:
              transformStyles[idx] !== undefined ? transformStyles[idx] : "none"
          }}
          onClick={() => onClick(idx)} // استدعاء الدالة onClick مع الـ index
        >
          <img
            className="w-full h-full object-cover"
            src={src}
            alt={`card-${idx}`}
          />
        </div>
      ))}
    </div>
  );
  
  
}
