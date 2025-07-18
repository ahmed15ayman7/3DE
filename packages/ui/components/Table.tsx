"use client";
import React, { useState } from 'react';
export interface TableColumn<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'bordered';
  loading?: boolean;
  emptyMessage?: string;
}

const getSizeClasses = (size: TableProps['size']) => {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-base';
  }
};

const getVariantClasses = (variant: TableProps['variant']) => {
  switch (variant) {
    case 'striped':
      return {
        table: 'min-w-full divide-y divide-gray-200',
        header: 'bg-gray-50',
        row: 'hover:bg-gray-50 even:bg-gray-50'
      };
    case 'bordered':
      return {
        table: 'min-w-full border border-gray-200',
        header: 'bg-gray-50 border-b border-gray-200',
        row: 'hover:bg-gray-50 border-b border-gray-200'
      };
    default:
      return {
        table: 'min-w-full divide-y divide-gray-200',
        header: 'bg-gray-50',
        row: 'hover:bg-gray-50'
      };
  }
};

const getAlignClasses = (align: TableColumn['align']) => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};

export function Table<T = any>({
  data,
  columns,
  sortable = false,
  selectable = false,
  onRowSelect,
  onSort,
  className = '',
  size = 'md',
  variant = 'default',
  loading = false,
  emptyMessage = 'لا توجد بيانات'
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);

  const handleSort = (key: string) => {
    if (!sortable) return;

    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleRowSelect = (index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
    onRowSelect?.(data.filter((_, i) => newSelectedRows.has(i)));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = new Set(data.map((_, i) => i));
      setSelectedRows(allIndices);
      onRowSelect?.(data);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const renderSortIcon = (key: string) => {
    if (!sortable) return null;

    const isActive = sortKey === key;
    return (
      <svg
        className={`w-4 h-4 ml-1 ${isActive ? 'text-primary-main' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isActive && sortDirection === 'desc' 
            ? "M5 15l7-7 7 7" 
            : "M19 9l-7 7-7-7"
          }
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 h-8 rounded mb-2"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-6 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={variantClasses.table}>
        <thead className={variantClasses.header}>
          <tr>
            {selectable && (
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary-main focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${getAlignClasses(column.align)}
                  ${column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && renderSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${variantClasses.row} transition-colors duration-150`}
            >
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={(e) => handleRowSelect(rowIndex, e.target.checked)}
                    className="rounded border-gray-300 text-primary-main focus:ring-blue-500"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-6 py-4 whitespace-nowrap ${sizeClasses}
                    ${getAlignClasses(column.align)}
                  `}
                >
                  {column.render
                    ? column.render((row as any)[column.key], row, rowIndex)
                    : (row as any)[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = '',
  align = 'left'
}) => {
  return (
    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignClasses(align)} ${className}`}>
      {children}
    </th>
  );
};

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  align = 'left'
}) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${getAlignClasses(align)} ${className}`}>
      {children}
    </td>
  );
}; 