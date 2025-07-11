"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, Bookmark } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    image?: string;
    tags?: string[];
    rating?: number;
    isBookmarked?: boolean;
    isFeatured?: boolean;
    onClick?: () => void;
    onBookmark?: () => void;
    onRate?: () => void;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
    animate?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    image,
    tags = [],
    rating = 0,
    isBookmarked = false,
    isFeatured = false,
    onClick,
    onBookmark,
    onRate,
    variant = 'default',
    className = '',
    animate = true,
}) => {
    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                onClick={(e) => {
                    e.stopPropagation();
                    onRate?.();
                }}
                className="p-0 hover:scale-110 transition-transform"
            >
                {index < rating ? (
                    <Star className="text-yellow-500 text-sm fill-current" />
                ) : (
                    <Star className="text-gray-300 text-sm" />
                )}
            </button>
        ));
    };

    const CardComponent = animate ? motion.div : 'div';
    const cardProps = animate ? { 
        variants: cardVariants, 
        initial: "hidden", 
        animate: "visible",
        whileHover: "hover"
    } : {};

    return (
        <CardComponent {...cardProps}>
            <div
                className={cn(
                    "bg-white overflow-hidden rounded-xl cursor-pointer transition-all duration-300 shadow-sm border border-gray-200",
                    variant === 'compact' ? 'p-3' : variant === 'detailed' ? 'p-6' : 'p-4',
                    onClick && "hover:shadow-lg",
                    className
                )}
                onClick={onClick}
            >
                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-1 text-xs bg-yellow-500 text-white font-bold rounded-full">
                            مميز
                        </span>
                    </div>
                )}

                {/* Image Section */}
                {image && (
                    <div className="relative mb-4">
                        <img
                            src={image}
                            alt={title}
                            className={cn(
                                "w-full object-cover rounded-lg",
                                variant === 'compact' ? 'h-24' : variant === 'detailed' ? 'h-40' : 'h-32'
                            )}
                        />
                        {onBookmark && (
                            <button
                                className="absolute top-2 left-2 bg-white/80 hover:bg-white p-1 rounded-full transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBookmark();
                                }}
                            >
                                <Bookmark className={cn(
                                    "h-4 w-4",
                                    isBookmarked ? "text-blue-600 fill-current" : "text-gray-600"
                                )} />
                            </button>
                        )}
                    </div>
                )}

                {/* Icon Section (if no image) */}
                {!image && icon && (
                    <div className="flex justify-center mb-4">
                        <div className="text-4xl text-blue-600">
                            {icon}
                        </div>
                    </div>
                )}

                {/* Content Section */}
                <div>
                    <h3
                        className={cn(
                            "font-bold mb-2 text-gray-800 line-clamp-2",
                            variant === 'compact' ? 'text-lg' : 'text-xl'
                        )}
                    >
                        {title}
                    </h3>

                    {description && (
                        <p className="text-gray-600 mb-3 line-clamp-3 text-sm">
                            {description}
                        </p>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="px-2 py-1 text-xs text-gray-500">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Rating */}
                    {rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                            {renderStars(rating)}
                            <span className="text-sm text-gray-600 ml-1">
                                ({rating})
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </CardComponent>
    );
};

export default FeatureCard; 