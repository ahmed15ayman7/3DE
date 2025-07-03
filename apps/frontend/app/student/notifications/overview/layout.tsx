"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

// Dynamic imports للتبويبات
const AllTab = dynamic(() => import('./@all/page'), { loading: () => <div /> });
const UnreadTab = dynamic(() => import('./@unread/page'), { loading: () => <div /> });
const ReadTab = dynamic(() => import('./@read/page'), { loading: () => <div /> });
const ImportantTab = dynamic(() => import('./@important/page'), { loading: () => <div /> });

const tabs = [
  { label: 'الكل', value: 'all' },
  { label: 'غير مقروء', value: 'unread' },
  { label: 'تم القراءة', value: 'read' },
  { label: 'مهم', value: 'important' },
];

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'important'>('all');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8 flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as 'all' | 'unread' | 'read' | 'important')}
            className={`pb-2 px-4 text-lg font-semibold border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-primary-main text-primary-main bg-primary-50'
                : 'border-transparent text-gray-500 hover:bg-gray-100'
            } rounded-t`}
            style={{ minWidth: 120 }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Parallel Routes */}
      <div className="rounded-lg bg-white shadow p-4 min-h-[300px] transition-all duration-200">
        {activeTab === 'all' && <AllTab />}
        {activeTab === 'unread' && <UnreadTab />}
        {activeTab === 'read' && <ReadTab />}
        {activeTab === 'important' && <ImportantTab />}
      </div>
    </div>
  );
} 