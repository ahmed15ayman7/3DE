import { forwardRef } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface FormInputProps {
    label?: string;
    type?: string;
    error?: boolean;
    helperText?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, type = 'text', error, helperText, ...props }, ref) => {
        return (
            <LazyMotion features={domAnimation}>
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <div className="relative">
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                                {props.required && <span className="text-red-500 mr-1">*</span>}
                            </label>
                        )}
                        <input
                            ref={ref}
                            type={type}
                            className={`
                                w-full px-4 py-3 border rounded-lg transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                ${error 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300 hover:border-gray-400 focus:border-primary'
                                }
                                ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                            `}
                            {...props}
                        />
                        {error && helperText && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <span className="mr-1">⚠</span>
                                {helperText}
                            </p>
                        )}
                    </div>
                </m.div>
            </LazyMotion>
        );
    }
);

FormInput.displayName = 'FormInput'; 