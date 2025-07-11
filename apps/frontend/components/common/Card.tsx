"use client"
import React from 'react';
import {
    Card as ShadcnCard,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Share2, Bookmark } from 'lucide-react';

interface CardProps {
    title: string;
    description?: string;
    image?: string;
    tags?: string[];
    author?: {
        name: string;
        avatar?: string;
    };
    date?: string;
    likes?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    onLike?: () => void;
    onShare?: () => void;
    onBookmark?: () => void;
    onClick?: () => void;
    variant?: 'default' | 'course' | 'blog' | 'event';
    actionText?: string;
    onAction?: () => void;
    children?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    title,
    description,
    image,
    tags = [],
    author,
    date,
    likes = 0,
    isLiked = false,
    isBookmarked = false,
    onLike,
    onShare,
    onBookmark,
    onClick,
    variant = 'default',
    actionText,
    onAction,
    children,
    className,
}) => {
    const renderCardContent = () => {
        switch (variant) {
            case 'course':
                return (
                    <>
                        {image && (
                            <div className="relative h-40 overflow-hidden rounded-t-lg">
                                <img
                                    src={image}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <CardTitle className="text-lg font-bold">
                                    {title}
                                </CardTitle>
                                {tags.length > 0 && (
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                        {tags[0]}
                                    </span>
                                )}
                            </div>
                            {description && (
                                <p className="text-gray-600 text-sm mb-4">
                                    {description}
                                </p>
                            )}
                            {author && (
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    {author.avatar ? (
                                        <img
                                            src={author.avatar}
                                            alt={author.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-800 text-sm font-medium">
                                                {author.name[0]}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-gray-600 text-sm">
                                        {author.name}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                        {children}
                    </>
                );

            case 'blog':
                return (
                    <>
                        {image && (
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                                <img
                                    src={image}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-4">
                            <CardTitle className="text-lg font-bold mb-2">
                                {title}
                            </CardTitle>
                            {description && (
                                <p className="text-gray-600 text-sm mb-4">
                                    {description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                {author && (
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        {author.avatar ? (
                                            <img
                                                src={author.avatar}
                                                alt={author.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-800 text-sm font-medium">
                                                    {author.name[0]}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-gray-600 text-sm">
                                            {author.name}
                                        </span>
                                    </div>
                                )}
                                {date && (
                                    <span className="text-gray-500 text-sm">
                                        {date}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                        {children}
                    </>
                );

            case 'event':
                return (
                    <>
                        {image && (
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                                <img
                                    src={image}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-4">
                            <CardTitle className="text-lg font-bold mb-2">
                                {title}
                            </CardTitle>
                            {description && (
                                <p className="text-gray-600 text-sm mb-4">
                                    {description}
                                </p>
                            )}
                            {date && (
                                <p className="text-blue-600 text-sm mb-4">
                                    {date}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        {children}
                    </>
                );

            default:
                return (
                    <CardContent className="p-4">
                        <CardTitle className="text-lg font-bold mb-2">
                            {title}
                        </CardTitle>
                        {description && (
                            <p className="text-gray-600 text-sm">
                                {description}
                            </p>
                        )}
                        {children}
                    </CardContent>
                );
        }
    };

    return (
        <ShadcnCard
            className={cn(
                "bg-white text-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {renderCardContent()}
            {(onLike || onShare || onBookmark || onAction) && (
                <CardFooter className="flex justify-between p-4 border-t border-gray-100">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                        {onLike && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLike();
                                }}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                            </button>
                        )}
                        {onShare && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare();
                                }}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                            </button>
                        )}
                        {onBookmark && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBookmark();
                                }}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isBookmarked ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                            </button>
                        )}
                    </div>
                    {onAction && actionText && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction();
                            }}
                        >
                            {actionText}
                        </Button>
                    )}
                </CardFooter>
            )}
        </ShadcnCard>
    );
};

export default Card; 