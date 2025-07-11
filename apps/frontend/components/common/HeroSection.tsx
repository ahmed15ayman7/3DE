"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import  Button  from './Button';
import  Card  from './Card';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    backgroundImage?: string;
    backgroundVideo?: string;
    features?: Array<{
        icon: React.ReactNode;
        title: string;
        description: string;
    }>;
    variant?: 'default' | 'centered' | 'split';
    className?: string;
    animate?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    description,
    primaryAction,
    secondaryAction,
    backgroundImage,
    backgroundVideo,
    features = [],
    variant = 'default',
    className = '',
    animate = true,
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.3
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        }
    };

    const ContainerComponent = animate ? motion.div : 'div';
    const containerProps = animate ? { 
        variants: containerVariants, 
        initial: "hidden", 
        animate: "visible" 
    } : {};

    const ItemComponent = animate ? motion.div : 'div';
    const itemProps = animate ? { variants: itemVariants } : {};

    const ButtonComponent = animate ? motion.div : 'div';
    const buttonProps = animate ? { 
        variants: buttonVariants,
        whileHover: "hover"
    } : {};

    return (
        <ContainerComponent {...containerProps}>
            <div
                className={`
                    relative overflow-hidden rounded-2xl
                    ${backgroundImage || backgroundVideo ? 'min-h-[500px]' : 'py-16'}
                    ${className}
                `}
                style={{
                    backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Background Video */}
                {backgroundVideo && (
                    <video
                        autoPlay
                        muted
                        loop
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                )}

                {/* Overlay */}
                {(backgroundImage || backgroundVideo) && (
                    <div className="absolute inset-0 bg-black/40" />
                )}

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[500px]">
                        <div className={`${variant === 'split' ? 'md:col-span-6' : 'md:col-span-12'}`}>
                            <div className={variant === 'centered' ? 'text-center' : ''}>
                                <ItemComponent {...itemProps}>
                                    {subtitle && (
                                        <p className="text-blue-600 font-bold mb-2 block text-sm uppercase tracking-wider">
                                            {subtitle}
                                        </p>
                                    )}
                                </ItemComponent>

                                <ItemComponent {...itemProps}>
                                    <h1
                                        className={`
                                            text-4xl md:text-5xl lg:text-6xl font-bold mb-4
                                            ${backgroundImage || backgroundVideo ? 'text-white' : 'text-gray-900'}
                                            ${variant === 'centered' ? 'text-center' : ''}
                                        `}
                                    >
                                        {title}
                                    </h1>
                                </ItemComponent>

                                {description && (
                                    <ItemComponent {...itemProps}>
                                        <p
                                            className={`
                                                text-lg md:text-xl mb-6 max-w-2xl
                                                ${backgroundImage || backgroundVideo ? 'text-gray-200' : 'text-gray-600'}
                                                ${variant === 'centered' ? 'mx-auto text-center' : ''}
                                            `}
                                        >
                                            {description}
                                        </p>
                                    </ItemComponent>
                                )}

                                {/* Action Buttons */}
                                {(primaryAction || secondaryAction) && (
                                    <ButtonComponent {...buttonProps}>
                                        <div className={`
                                            flex gap-4
                                            ${variant === 'centered' ? 'justify-center' : ''}
                                            ${variant === 'default' ? 'flex-wrap' : ''}
                                        `}>
                                            {primaryAction && (
                                                <Button
                                                    variant="default"
                                                    size="lg"
                                                    onClick={primaryAction.onClick}
                                                    className="px-8 py-3 text-lg font-semibold flex items-center gap-3"
                                                >
                                                    {primaryAction.icon || <ArrowRight className="w-5 h-5" />}
                                                    {primaryAction.label}
                                                </Button>
                                            )}

                                            {secondaryAction && (
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={secondaryAction.onClick}
                                                    className={`
                                                        px-8 py-3 text-lg font-semibold flex items-center gap-3
                                                        ${backgroundImage || backgroundVideo ? 'text-white border-white hover:bg-white hover:text-gray-900' : ''}
                                                    `}
                                                >
                                                    {secondaryAction.icon || <Play className="w-5 h-5" />}
                                                    {secondaryAction.label}
                                                </Button>
                                            )}
                                        </div>
                                    </ButtonComponent>
                                )}
                            </div>
                        </div>

                        {/* Features Section */}
                        {features.length > 0 && variant === 'split' && (
                            <div className="md:col-span-6">
                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <ItemComponent key={index} {...itemProps}>
                                            <Card title={""} className="p-4 bg-white/90 backdrop-blur-sm">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-2xl text-blue-600 mt-1">
                                                        {feature.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-1">
                                                            {feature.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </ItemComponent>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ContainerComponent>
    );
};

export default HeroSection; 