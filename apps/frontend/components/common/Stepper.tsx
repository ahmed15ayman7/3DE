"use client"
import React from 'react';
import {
    Stepper as MuiStepper,
    Step as MuiStep,
    StepLabel as MuiStepLabel,
    StepContent as MuiStepContent,
    Box,
} from '@mui/material';


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
                return 'text-primary-main';
            case 'secondary':
                return 'text-secondary-main';
            case 'success':
                return 'text-success-main';
            case 'error':
                return 'text-error-main';
            case 'warning':
                return 'text-warning-main';
            case 'info':
                return 'text-info-main';
            default:
                return '';
        }
    };

    return (
        <MuiStepper
            activeStep={activeStep}
            orientation={orientation}
            alternativeLabel={alternativeLabel}
            nonLinear={nonLinear}
            className={`
        ${className}
        ${getColorClass()}
        [&_.MuiStepConnector-line]:border-current
        [&_.MuiStepLabel-label]:text-gray-600
        [&_.MuiStepLabel-label.Mui-active]:text-current
        [&_.MuiStepLabel-label.Mui-completed]:text-current
        [&_.MuiStepLabel-label]:text-sm
        [&_.MuiStepLabel-label]:font-medium
        [&_.MuiStepLabel-optional]:text-gray-400
        [&_.MuiStepLabel-optional]:text-xs
        [&_.MuiStepContent-root]:border-l-2
        [&_.MuiStepContent-root]:border-current
        [&_.MuiStepContent-root]:pl-4
        [&_.MuiStepContent-root]:mt-2
        [&_.MuiStepContent-root]:mb-4
      `}
        >
            {steps.map((step, index) => (
                <MuiStep
                    key={index}
                    completed={step.completed}
                    disabled={step.disabled}
                >
                    <MuiStepLabel
                        optional={step.optional ? 'optional' : undefined}
                        icon={step.icon}
                        className={`
              ${step.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        {step.label}
                        {step.description && (
                            <Box className="text-xs text-gray-500  mt-1">
                                {step.description}
                            </Box>
                        )}
                    </MuiStepLabel>
                    {orientation === 'vertical' && step.content && (
                        <MuiStepContent>
                            {step.content}
                        </MuiStepContent>
                    )}
                </MuiStep>
            ))}
        </MuiStepper>
    );
};

export default Stepper; 