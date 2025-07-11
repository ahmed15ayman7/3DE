import { LazyMotion, domAnimation, m } from 'framer-motion';

interface CustomPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
}

export const CustomPhoneInput = ({
    value,
    onChange,
    error,
    helperText,
}: CustomPhoneInputProps) => {
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهاتف
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="أدخل رقم الهاتف"
                            className={`
                                w-full pl-12 pr-4 py-3 border rounded-lg transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                ${error 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300 hover:border-gray-400 focus:border-primary'
                                }
                            `}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            🇪🇬 +20
                        </div>
                    </div>
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
}; 