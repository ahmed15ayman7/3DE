'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@3de/ui';

interface AnimatedButtonProps {
  children: React.ReactNode;
  animationType?: 'scale' | 'bounce' | 'pulse' | 'shake';
  hoverEffect?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  animationType = 'scale',
  hoverEffect = true,
  ...buttonProps
}) => {
  const animationVariants = {
    scale: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    },
    bounce: {
      hover: { 
        y: -2,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 10 
        }
      },
      tap: { y: 0 }
    },
    pulse: {
      hover: { 
        scale: 1.05,
        transition: { 
          repeat: Infinity, 
          repeatType: "reverse" as const, 
          duration: 0.6 
        }
      },
      tap: { scale: 0.95 }
    },
    shake: {
      hover: { 
        x: [-2, 2, -2, 2, 0],
        transition: { duration: 0.3 }
      },
      tap: { x: 0 }
    }
  };

  const selectedAnimation = animationVariants[animationType];

  if (!hoverEffect) {
    return <Button {...buttonProps}>{children}</Button>;
  }

  return (
    <motion.div
      whileHover={selectedAnimation.hover}
      whileTap={selectedAnimation.tap}
      style={{ display: 'inline-block' }}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </motion.div>
  );
};

// مكون للزر مع أيقونة متحركة
interface AnimatedIconButtonProps {
  children?: React.ReactNode;
  icon: React.ReactNode;
  iconAnimation?: 'rotate' | 'bounce' | 'pulse';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  children,
  icon,
  iconAnimation = 'rotate',
  ...buttonProps
}) => {
  const iconVariants = {
    rotate: {
      hover: { rotate: 360 },
      tap: { rotate: 0 }
    },
    bounce: {
      hover: { 
        y: [-2, 0, -2],
        transition: { 
          repeat: Infinity, 
          duration: 0.6 
        }
      },
      tap: { y: 0 }
    },
    pulse: {
      hover: { 
        scale: [1, 1.2, 1],
        transition: { 
          repeat: Infinity, 
          duration: 0.8 
        }
      },
      tap: { scale: 1 }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: 'inline-block' }}
    >
      <Button {...buttonProps}>
        <motion.span
          variants={iconVariants[iconAnimation]}
          whileHover="hover"
          whileTap="tap"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {icon}
        </motion.span>
        {children && <span style={{ marginRight: '0.5rem' }}>{children}</span>}
      </Button>
    </motion.div>
  );
}; 