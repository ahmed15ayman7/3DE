"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

// Dynamic imports للتبويبات
const PersonalTab = dynamic(() => import('./@personal/page'), { loading: () => <div /> });
const SecurityTab = dynamic(() => import('./@security/page'), { loading: () => <div /> });
const PreferencesTab = dynamic(() => import('./@preferences/page'), { loading: () => <div /> });

const tabs = [
  { label: 'البيانات الشخصية', value: 'personal' },
  { label: 'الأمان', value: 'security' },
  { label: 'التفضيلات', value: 'preferences' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8 flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as 'personal' | 'security' | 'preferences')}
            className={`pb-2 px-4 text-lg font-semibold border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-primary-main text-primary-main'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Parallel Routes */}
      <div>
        {activeTab === 'personal' && <PersonalTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
      </div>
    </div>
  );
} 