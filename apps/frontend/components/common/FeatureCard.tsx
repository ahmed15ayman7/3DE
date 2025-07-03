"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';

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
            <IconButton
                key={index}
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onRate?.();
                }}
                className="p-0"
            >
                {index < rating ? (
                    <StarIcon className="text-yellow-500 text-sm" />
                ) : (
                    <StarBorderIcon className="text-gray-300 text-sm" />
                )}
            </IconButton>
        ));
    };

    const CardComponent = animate ? motion.div : Box;
    const cardProps = animate ? { 
        variants: cardVariants, 
        initial: "hidden", 
        animate: "visible",
        whileHover: "hover"
    } : {};

    return (
        <CardComponent {...cardProps}>
            <Paper
                elevation={variant === 'compact' ? 1 : 2}
                className={`
                    overflow-hidden rounded-xl cursor-pointer transition-all duration-300
                    ${variant === 'compact' ? 'p-3' : 'p-4'}
                    ${variant === 'detailed' ? 'p-6' : ''}
                    ${className}
                    ${onClick ? 'hover:shadow-lg' : ''}
                `}
                onClick={onClick}
            >
                {/* Featured Badge */}
                {isFeatured && (
                    <Box className="absolute top-2 right-2 z-10">
                        <Chip
                            label="مميز"
                            size="small"
                            color="warning"
                            className="text-white font-bold"
                        />
                    </Box>
                )}

                {/* Image Section */}
                {image && (
                    <Box className="relative mb-4">
                        <img
                            src={image}
                            alt={title}
                            className={`
                                w-full object-cover rounded-lg
                                ${variant === 'compact' ? 'h-24' : 'h-32'}
                                ${variant === 'detailed' ? 'h-40' : ''}
                            `}
                        />
                        {onBookmark && (
                            <IconButton
                                className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBookmark();
                                }}
                            >
                                {isBookmarked ? (
                                    <BookmarkIcon className="text-primary-main" />
                                ) : (
                                    <BookmarkBorderIcon className="text-gray-600" />
                                )}
                            </IconButton>
                        )}
                    </Box>
                )}

                {/* Icon Section (if no image) */}
                {!image && icon && (
                    <Box className="flex justify-center mb-4">
                        <Box className="text-4xl text-primary-main">
                            {icon}
                        </Box>
                    </Box>
                )}

                {/* Content Section */}
                <Box>
                    <Typography
                        variant={variant === 'compact' ? 'h6' : 'h5'}
                        className="font-bold mb-2 text-gray-800 line-clamp-2"
                    >
                        {title}
                    </Typography>

                    {description && (
                        <Typography
                            variant="body2"
                            className="text-gray-600 mb-3 line-clamp-3"
                        >
                            {description}
                        </Typography>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <Box className="flex flex-wrap gap-1 mb-3">
                            {tags.slice(0, 3).map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    className="text-xs"
                                />
                            ))}
                            {tags.length > 3 && (
                                <Chip
                                    label={`+${tags.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                    className="text-xs"
                                />
                            )}
                        </Box>
                    )}

                    {/* Rating */}
                    {rating > 0 && (
                        <Box className="flex items-center gap-1 mb-2">
                            {renderStars(rating)}
                            <Typography variant="body2" className="text-gray-600 ml-2">
                                ({rating}/5)
                            </Typography>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    {variant === 'detailed' && (onBookmark || onRate) && (
                        <Box className="flex justify-between items-center pt-3 border-t border-gray-100">
                            {onRate && (
                                <Tooltip title="قيّم">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRate();
                                        }}
                                    >
                                        <StarBorderIcon className="text-gray-400" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            
                            {onBookmark && (
                                <Tooltip title={isBookmarked ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onBookmark();
                                        }}
                                    >
                                        {isBookmarked ? (
                                            <BookmarkIcon className="text-primary-main" />
                                        ) : (
                                            <BookmarkBorderIcon className="text-gray-400" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </CardComponent>
    );
};

export default FeatureCard; 