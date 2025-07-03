"use client";
// Parallel Route: التفضيلات
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
import { FaSun, FaMoon } from 'react-icons/fa';

export default function PreferencesTab() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [showNightModeTrial, setShowNightModeTrial] = useState(false);
    return (
        <div className="space-y-6">
            <Card title="المظهر">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">المظهر</h3>
                        <p className="text-gray-600">اختر مظهر واجهة التطبيق</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={theme === 'light' ? 'contained' : 'outlined'}
                            onClick={() => setTheme('light')}
                        >
                            <FaSun className="ml-2" />
                            فاتح
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'contained' : 'outlined'}
                            onClick={() => setTheme('dark')}
                        >
                            <FaMoon className="ml-2" />
                            داكن
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setShowNightModeTrial(true)}
                        >
                            تجربة الوضع الليلي
                        </Button>
                    </div>
                </div>
            </Card>
            {/* يمكن إضافة تجربة الوضع الليلي هنا */}
        </div>
    );
} 