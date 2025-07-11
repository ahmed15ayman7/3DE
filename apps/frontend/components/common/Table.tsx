"use client" 
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    width?: string | number;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    page?: number;
    rowsPerPage?: number;
    totalRows?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
    orderBy?: string;
    order?: 'asc' | 'desc';
    onSort?: (orderBy: string, order: 'asc' | 'desc') => void;
    className?: string;
}

const Table: React.FC<TableProps> = ({
    columns,
    data,
    page = 0,
    rowsPerPage = 10,
    totalRows = 0,
    onPageChange,
    onRowsPerPageChange,
    orderBy,
    order = 'asc',
    onSort,
    className = '',
}) => {
    const handleChangePage = (newPage: number) => {
        onPageChange?.(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onRowsPerPageChange?.(parseInt(event.target.value, 10));
    };

    const handleSort = (columnId: string) => {
        if (!onSort) return;
        const isAsc = orderBy === columnId && order === 'asc';
        onSort(columnId, isAsc ? 'desc' : 'asc');
    };

    const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
        switch (align) {
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            default:
                return 'text-left';
        }
    };

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    return (
        <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className={cn(
                                        "px-4 py-3 text-sm font-medium text-gray-900",
                                        getAlignmentClass(column.align),
                                        column.sortable && "cursor-pointer hover:bg-gray-100 transition-colors"
                                    )}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.id)}
                                >
                                    <div className={cn(
                                        "flex items-center space-x-1 rtl:space-x-reverse",
                                        getAlignmentClass(column.align)
                                    )}>
                                        <span className="whitespace-nowrap">{column.label}</span>
                                        {column.sortable && (
                                            <div className="flex flex-col">
                                                <ChevronUp 
                                                    className={cn(
                                                        "h-3 w-3",
                                                        orderBy === column.id && order === 'asc' 
                                                            ? "text-blue-600" 
                                                            : "text-gray-400"
                                                    )}
                                                />
                                                <ChevronDown 
                                                    className={cn(
                                                        "h-3 w-3 -mt-1",
                                                        orderBy === column.id && order === 'desc' 
                                                            ? "text-blue-600" 
                                                            : "text-gray-400"
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.id}
                                        className={cn(
                                            "px-4 py-3 text-sm text-gray-600",
                                            getAlignmentClass(column.align)
                                        )}
                                    >
                                        {column.render
                                            ? column.render(row[column.id], row)
                                            : row[column.id]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm text-gray-700">صفوف في الصفحة:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="text-sm py-1 px-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {[5, 10, 25, 50].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm text-gray-700">
                        {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalRows)} من {totalRows}
                    </span>
                    
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <button
                            onClick={() => handleChangePage(page - 1)}
                            disabled={page === 0}
                            className="px-2 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            السابق
                        </button>
                        <button
                            onClick={() => handleChangePage(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="px-2 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table; 