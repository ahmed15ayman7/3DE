"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Paper,
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

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

    const ContainerComponent = animate ? motion.div : Box;
    const containerProps = animate ? { 
        variants: containerVariants, 
        initial: "hidden", 
        animate: "visible" 
    } : {};

    const ItemComponent = animate ? motion.div : Box;
    const itemProps = animate ? { variants: itemVariants } : {};

    const ButtonComponent = animate ? motion.div : Box;
    const buttonProps = animate ? { 
        variants: buttonVariants,
        whileHover: "hover"
    } : {};

    return (
        <ContainerComponent {...containerProps}>
            <Box
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
                    <Box className="absolute inset-0 bg-black/40" />
                )}

                {/* Content */}
                <Container maxWidth="lg" className="relative z-10">
                    <Grid container spacing={4} className="items-center min-h-[500px]">
                        <Grid item xs={12} md={variant === 'split' ? 6 : 12}>
                            <Box className={variant === 'centered' ? 'text-center' : ''}>
                                <ItemComponent {...itemProps}>
                                    {subtitle && (
                                        <Typography
                                            variant="overline"
                                            className="text-primary-main font-bold mb-2 block"
                                        >
                                            {subtitle}
                                        </Typography>
                                    )}
                                </ItemComponent>

                                <ItemComponent {...itemProps}>
                                    <Typography
                                        variant="h2"
                                        className={`
                                            font-bold mb-4
                                            ${backgroundImage || backgroundVideo ? 'text-white' : 'text-gray-900'}
                                            ${variant === 'centered' ? 'text-center' : ''}
                                        `}
                                    >
                                        {title}
                                    </Typography>
                                </ItemComponent>

                                {description && (
                                    <ItemComponent {...itemProps}>
                                        <Typography
                                            variant="h6"
                                            className={`
                                                mb-6 max-w-2xl
                                                ${backgroundImage || backgroundVideo ? 'text-gray-200' : 'text-gray-600'}
                                                ${variant === 'centered' ? 'mx-auto text-center' : ''}
                                            `}
                                        >
                                            {description}
                                        </Typography>
                                    </ItemComponent>
                                )}

                                {/* Action Buttons */}
                                {(primaryAction || secondaryAction) && (
                                    <ButtonComponent {...buttonProps}>
                                        <Box className={`
                                            flex gap-4
                                            ${variant === 'centered' ? 'justify-center' : ''}
                                            ${variant === 'default' ? 'flex-wrap' : ''}
                                        `}>
                                            {primaryAction && (
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={primaryAction.onClick}
                                                    startIcon={primaryAction.icon || <ArrowForwardIcon />}
                                                    className="px-8 py-3 text-lg font-semibold flex justify-center gap-3"
                                                >
                                                    {primaryAction.label}
                                                </Button>
                                            )}

                                            {secondaryAction && (
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    onClick={secondaryAction.onClick}
                                                    startIcon={secondaryAction.icon || <PlayArrowIcon />}
                                                    className={`
                                                        px-8 py-3 text-lg font-semibold
                                                        ${backgroundImage || backgroundVideo ? 'text-white border-white hover:bg-white hover:text-gray-900' : ''}
                                                    `}
                                                >
                                                    {secondaryAction.label}
                                                </Button>
                                            )}
                                        </Box>
                                    </ButtonComponent>
                                )}
                            </Box>
                        </Grid>

                        {/* Features Section */}
                        {features.length > 0 && variant === 'split' && (
                            <Grid item xs={12} md={6}>
                                <Box className="space-y-4">
                                    {features.map((feature, index) => (
                                        <ItemComponent key={index} {...itemProps}>
                                            <Paper className="p-4 bg-white/90 backdrop-blur-sm">
                                                <Box className="flex items-start gap-3">
                                                    <Box className="text-2xl text-primary-main mt-1">
                                                        {feature.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" className="font-semibold mb-1">
                                                            {feature.title}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-gray-600">
                                                            {feature.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </ItemComponent>
                                    ))}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </ContainerComponent>
    );
};

export default HeroSection; 