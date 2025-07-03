"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    children: React.ReactNode[];
    itemsPerView?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
    children,
    itemsPerView = 4,
    autoPlay = false,
    autoPlayInterval = 3000,
    showArrows = true,
    showDots = true,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = children.length;
    const maxIndex = Math.max(0, totalItems - itemsPerView);

    const next = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    };

    useEffect(() => {
        if (!autoPlay) return;

        const interval = setInterval(next, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, currentIndex, maxIndex]);

    if (totalItems === 0) return null;

    return (
        <div className={`relative ${className}`}>
            {/* Carousel Container */}
            <div className="overflow-hidden">
                <motion.div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                        width: `${(totalItems * 100) / itemsPerView}%`
                    }}
                >
                    {children.map((child, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0"
                            style={{ width: `${100 / totalItems}%` }}
                        >
                            <div className="px-2">
                                {child}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && totalItems > itemsPerView && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && totalItems > itemsPerView && (
                <div className="flex justify-center mt-4 space-x-2 space-x-reverse">
                    {Array.from({ length: maxIndex + 1 }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex
                                    ? 'bg-primary-500 w-6'
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel; 