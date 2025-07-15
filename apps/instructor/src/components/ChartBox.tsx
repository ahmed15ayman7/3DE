'use client';

import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  className?: string;
}

export function BarChart({ data, title, height = 200, className = '' }: BarChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-end space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    item.color || 'bg-primary-main'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PieChartProps {
  data: ChartData[];
  title: string;
  size?: number;
  className?: string;
}

export function PieChart({ data, title, size = 200, className = '' }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500'
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative" style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} 251.2`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            cumulativePercentage += percentage;

            return (
              <div
                key={index}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from ${(cumulativePercentage - percentage) * 3.6}deg, ${
                    item.color || colors[index % colors.length].replace('bg-', 'rgb(')
                  } 0deg, ${
                    item.color || colors[index % colors.length].replace('bg-', 'rgb(')
                  } ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`
                }}
              />
            );
          })}
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${item.color || colors[index % colors.length]}`}
                />
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900 mr-auto">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title: string;
  height?: number;
  className?: string;
}

export function LineChart({ data, title, height = 200, className = '' }: LineChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="#1a365d"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="#1a365d"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{item.label}: {item.value}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DashboardChartsProps {
  className?: string;
}

export function DashboardCharts({ className = '' }: DashboardChartsProps) {
  const studentGradesData = [
    { label: 'A', value: 25, color: 'bg-green-500' },
    { label: 'B', value: 35, color: 'bg-blue-500' },
    { label: 'C', value: 20, color: 'bg-yellow-500' },
    { label: 'D', value: 15, color: 'bg-orange-500' },
    { label: 'F', value: 5, color: 'bg-red-500' }
  ];

  const coursePerformanceData = [
    { label: 'البرمجة', value: 85 },
    { label: 'قواعد البيانات', value: 78 },
    { label: 'الخوارزميات', value: 92 },
    { label: 'الشبكات', value: 70 }
  ];

  const monthlyProgressData = [
    { label: 'يناير', value: 65 },
    { label: 'فبراير', value: 70 },
    { label: 'مارس', value: 75 },
    { label: 'أبريل', value: 80 },
    { label: 'مايو', value: 85 },
    { label: 'يونيو', value: 78 }
  ];

  const attendanceData = [
    { label: 'حاضر', value: 120, color: 'bg-green-500' },
    { label: 'متأخر', value: 25, color: 'bg-yellow-500' },
    { label: 'غائب', value: 11, color: 'bg-red-500' }
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <BarChart
        data={coursePerformanceData}
        title="أداء الكورسات (متوسط الدرجات)"   
      />
      <PieChart
        data={studentGradesData}
        title="توزيع درجات الطلاب"
      />
      <LineChart
        data={monthlyProgressData}
        title="تقدم الطلاب الشهري"
      />
      <PieChart
        data={attendanceData}
        title="إحصائيات الحضور"
      />
    </div>
  );
}

// Statistics Cards Component
interface StatisticsCardsProps {
  className?: string;
}

export function StatisticsCards({ className = '' }: StatisticsCardsProps) {
  const stats = [
    {
      title: 'متوسط الدرجات',
      value: '78.5',
      change: '+2.3',
      changeType: 'increase' as const,
      icon: '📊',
      description: 'من الشهر الماضي'
    },
    {
      title: 'معدل الحضور',
      value: '85%',
      change: '+5%',
      changeType: 'increase' as const,
      icon: '✅',
      description: 'هذا الأسبوع'
    },
    {
      title: 'الواجبات المسلمة',
      value: '142',
      change: '+18',
      changeType: 'increase' as const,
      icon: '📝',
      description: 'هذا الشهر'
    },
    {
      title: 'معدل المشاركة',
      value: '72%',
      change: '-3%',
      changeType: 'decrease' as const,
      icon: '💬',
      description: 'من الأسبوع الماضي'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <div className={`flex items-center mt-2 text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {stat.changeType === 'increase' ? '↗️' : '↘️'}
                </span>
                {stat.change} {stat.description}
              </div>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 

// مكون ChartBox موحد
interface ChartBoxProps {
  title: string;
  type: 'bar' | 'pie' | 'line';
  data: ChartData[];
  height?: number;
  className?: string;
}

export default function ChartBox({ title, type, data, height = 300, className = '' }: ChartBoxProps) {
  const chartProps = { data, title, height, className };
  
  switch (type) {
    case 'bar':
      return <BarChart {...chartProps} />;
    case 'pie':
      return <PieChart {...chartProps} />;
    case 'line':
      return <LineChart {...chartProps} />;
    default:
      return <BarChart {...chartProps} />;
  }
} 