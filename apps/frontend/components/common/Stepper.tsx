"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
    label: string;
    description?: string;
    icon?: React.ReactElement;
    content?: React.ReactNode;
    optional?: boolean;
    completed?: boolean;
    disabled?: boolean;
}

interface StepperProps {
    steps: Step[];
    activeStep?: number;
    orientation?: 'horizontal' | 'vertical';
    alternativeLabel?: boolean;
    nonLinear?: boolean;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const Stepper: React.FC<StepperProps> = ({
    steps,
    activeStep = 0,
    orientation = 'horizontal',
    alternativeLabel = false,
    nonLinear = false,
    color = 'primary',
    className = '',
}) => {
    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-600 border-blue-600 bg-blue-600';
            case 'secondary':
                return 'text-gray-600 border-gray-600 bg-gray-600';
            case 'success':
                return 'text-green-600 border-green-600 bg-green-600';
            case 'error':
                return 'text-red-600 border-red-600 bg-red-600';
            case 'warning':
                return 'text-yellow-600 border-yellow-600 bg-yellow-600';
            case 'info':
                return 'text-cyan-600 border-cyan-600 bg-cyan-600';
            default:
                return 'text-blue-600 border-blue-600 bg-blue-600';
        }
    };

    const getStepStatus = (index: number, step: Step) => {
        if (step.completed) return 'completed';
        if (index === activeStep) return 'active';
        if (index < activeStep) return 'completed';
        return 'pending';
    };

    if (orientation === 'vertical') {
        return (
            <div className={cn("space-y-4", className)}>
                {steps.map((step, index) => {
                    const status = getStepStatus(index, step);
                    const isActive = status === 'active';
                    const isCompleted = status === 'completed';
                    
                    return (
                        <div key={index} className="flex">
                            <div className="flex flex-col items-center mr-4 rtl:mr-0 rtl:ml-4">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                                        isCompleted && "bg-blue-600 border-blue-600 text-white",
                                        isActive && "border-blue-600 text-blue-600 bg-blue-50",
                                        !isActive && !isCompleted && "border-gray-300 text-gray-500 bg-gray-50",
                                        step.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4" />
                                    ) : step.icon ? (
                                        step.icon
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "w-0.5 h-8 mt-2",
                                            isCompleted ? "bg-blue-600" : "bg-gray-300"
                                        )}
                                    />
                                )}
                            </div>
                            
                            <div className="flex-1 pb-4">
                                <div className={cn(
                                    "flex items-center",
                                    step.optional && "justify-between"
                                )}>
                                    <h3 className={cn(
                                        "text-sm font-medium",
                                        isActive && "text-blue-600",
                                        isCompleted && "text-blue-600",
                                        !isActive && !isCompleted && "text-gray-600",
                                        step.disabled && "opacity-50"
                                    )}>
                                        {step.label}
                                    </h3>
                                    {step.optional && (
                                        <span className="text-xs text-gray-400">اختياري</span>
                                    )}
                                </div>
                                
                                {step.description && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {step.description}
                                    </p>
                                )}
                                
                                {isActive && step.content && (
                                    <div className="mt-4 pl-4 border-l-2 border-blue-600">
                                        {step.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Horizontal Stepper
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(index, step);
                    const isActive = status === 'active';
                    const isCompleted = status === 'completed';
                    
                    return (
                        <div key={index} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                                        isCompleted && "bg-blue-600 border-blue-600 text-white",
                                        isActive && "border-blue-600 text-blue-600 bg-blue-50",
                                        !isActive && !isCompleted && "border-gray-300 text-gray-500 bg-gray-50",
                                        step.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4" />
                                    ) : step.icon ? (
                                        step.icon
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                
                                <div className="mt-2 text-center">
                                    <div className={cn(
                                        "text-sm font-medium",
                                        isActive && "text-blue-600",
                                        isCompleted && "text-blue-600",
                                        !isActive && !isCompleted && "text-gray-600",
                                        step.disabled && "opacity-50"
                                    )}>
                                        {step.label}
                                    </div>
                                    
                                    {step.description && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {step.description}
                                        </div>
                                    )}
                                    
                                    {step.optional && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            اختياري
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-4",
                                        isCompleted ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper; 