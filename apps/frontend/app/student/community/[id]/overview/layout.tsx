"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

// Dynamic imports للتبويبات
// const ForumsTab = dynamic(() => import('./@forums/page'), { loading: () => <div /> });
const GroupsTab = dynamic(() => import('./@groups/page'), { loading: () => <div /> });
const EventsTab = dynamic(() => import('./@events/page'), { loading: () => <div /> });

const tabs = [
//   { label: 'المنتديات', value: 'forums' },
  { label: 'المجموعات', value: 'groups' },
  { label: 'الأحداث', value: 'events' },
];

export default function CommunityLayout() {
  const [activeTab, setActiveTab] = useState<'forums' | 'groups' | 'events'>('groups');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8 flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as 'forums' | 'groups' | 'events')}
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
        {/* {activeTab === 'forums' && <ForumsTab />} */}
        {activeTab === 'groups' && <GroupsTab />}
        {activeTab === 'events' && <EventsTab />}
      </div>
    </div>
  );
} 