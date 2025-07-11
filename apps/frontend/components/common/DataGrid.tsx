'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from './Input';
import Button from './Button';

interface Column {
    field: string;
    headerName: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    renderCell?: (value: any, row: any) => React.ReactNode;
}

interface DataGridProps {
    columns: Column[];
    rows: any[];
    pageSize?: number;
    pageSizeOptions?: number[];
    loading?: boolean;
    checkboxSelection?: boolean;
    onRowClick?: (row: any) => void;
    className?: string;
}

const DataGrid: React.FC<DataGridProps> = ({
    columns,
    rows,
    pageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    loading = false,
    checkboxSelection = false,
    onRowClick,
    className = '',
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    // Filter rows based on search term
    const filteredRows = useMemo(() => {
        if (!searchTerm) return rows;
        
        return rows.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [rows, searchTerm]);

    // Sort rows
    const sortedRows = useMemo(() => {
        if (!sortField) return filteredRows;
        
        return [...filteredRows].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredRows, sortField, sortDirection]);

    // Paginate rows
    const paginatedRows = useMemo(() => {
        const startIndex = currentPage * currentPageSize;
        return sortedRows.slice(startIndex, startIndex + currentPageSize);
    }, [sortedRows, currentPage, currentPageSize]);

    const totalPages = Math.ceil(sortedRows.length / currentPageSize);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleRowSelect = (rowId: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedRows.size === paginatedRows.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedRows.map(row => row.id)));
        }
    };

    const renderCell = (column: Column, row: any) => {
        const value = row[column.field];
        
        if (column.renderCell) {
            return column.renderCell(value, row);
        }
        
        return value;
    };

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="bg-gray-200 h-10 rounded-t-lg mb-2"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-12 rounded mb-2"></div>
                ))}
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        <select
                            value={currentPageSize}
                            onChange={(e) => {
                                setCurrentPageSize(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size} per page
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        {sortedRows.length} of {rows.length} rows
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {checkboxSelection && (
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedRows.length && paginatedRows.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.field}
                                    className={`px-4 py-3 text-left text-sm font-medium text-gray-900 ${
                                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                    }`}
                                    onClick={() => column.sortable && handleSort(column.field)}
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.headerName}</span>
                                        {column.sortable && sortField === column.field && (
                                            sortDirection === 'asc' ? 
                                                <ChevronUp className="w-4 h-4" /> : 
                                                <ChevronDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedRows.map((row, index) => (
                            <tr
                                key={row.id || index}
                                className={`hover:bg-gray-50 ${
                                    onRowClick ? 'cursor-pointer' : ''
                                } ${selectedRows.has(row.id) ? 'bg-blue-50' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {checkboxSelection && (
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(row.id)}
                                            onChange={() => handleRowSelect(row.id)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                )}
                                {columns.map((column) => (
                                    <td key={column.field} className="px-4 py-3 text-sm text-gray-600">
                                        {renderCell(column, row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataGrid; 