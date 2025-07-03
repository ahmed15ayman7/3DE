"use client"
import React, { useState } from 'react';
import {
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
    Typography,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';


interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactElement;
    disabled?: boolean;
}

interface AccordionProps {
    items: AccordionItem[];
    expanded?: string[];
    onChange?: (expanded: string[]) => void;
    variant?: 'default' | 'outlined';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
    items,
    expanded: controlledExpanded,
    onChange,
    variant = 'default',
    color = 'primary',
    className = '',
}) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>([]);
    const expanded = controlledExpanded ?? uncontrolledExpanded;

    const handleChange = (id: string) => {
        const newExpanded = expanded.includes(id)
            ? expanded.filter((item) => item !== id)
            : [...expanded, id];

        if (onChange) {
            onChange(newExpanded);
        } else {
            setUncontrolledExpanded(newExpanded);
        }
    };

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
        <div className={className}>
            {items.map((item) => (
                <MuiAccordion
                    key={item.id}
                    expanded={expanded.includes(item.id)}
                    onChange={() => handleChange(item.id)}
                    disabled={item.disabled}
                    className={`
            ${variant === 'outlined' ? 'border border-gray-200 ' : ''}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            mb-2
            rounded-lg
            shadow-sm
            bg-white
            [&_.MuiAccordionSummary-root]:min-h-[48px]
            [&_.MuiAccordionSummary-root]:px-4
            [&_.MuiAccordionSummary-root]:py-2
            [&_.MuiAccordionSummary-content]:my-2
            [&_.MuiAccordionDetails-root]:px-4
            [&_.MuiAccordionDetails-root]:py-3
            [&_.MuiAccordionDetails-root]:bg-gray-50
            [&_.MuiAccordionDetails-root]:rounded-b-lg
          `}
                >
                    <MuiAccordionSummary
                        expandIcon={<ExpandMoreIcon className={getColorClass()} />}
                        className={`
              ${expanded.includes(item.id) ? 'bg-gray-50 ' : ''}
            `}
                    >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            {item.icon && (
                                <div className={getColorClass()}>
                                    {item.icon}
                                </div>
                            )}
                            <Typography
                                variant="subtitle1"
                                className={`
                  font-medium
                  text-gray-900
                `}
                            >
                                {item.title}
                            </Typography>
                        </div>
                    </MuiAccordionSummary>
                    <MuiAccordionDetails>
                        {item.content}
                    </MuiAccordionDetails>
                </MuiAccordion>
            ))}
        </div>
    );
};

export default Accordion; 