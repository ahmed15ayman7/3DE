"use client" 
import React from 'react';
import {
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
    TablePagination as MuiTablePagination,
    TableSortLabel as MuiTableSortLabel,
    Paper,
} from '@mui/material';


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

    const handleChangePage = (_: unknown, newPage: number) => {
        onPageChange?.(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onRowsPerPageChange?.(parseInt(event.target.value, 10));
    };

    const handleSort = (columnId: string) => {
        if (!onSort) return;
        const isAsc = orderBy === columnId && order === 'asc';
        onSort(columnId, isAsc ? 'desc' : 'asc');
    };

    return (
        <Paper className={className}>
            <MuiTableContainer>
                <MuiTable
                    className={`
            [&_.MuiTableCell-root]:px-4
            [&_.MuiTableCell-root]:py-3
            [&_.MuiTableCell-root]:text-sm
            [&_.MuiTableCell-head]:font-medium
            [&_.MuiTableCell-head]:text-gray-900
            [&_.MuiTableCell-head]:bg-gray-50
            [&_.MuiTableCell-body]:text-gray-600
            [&_.MuiTableRow-root]:border-b
            [&_.MuiTableRow-root]:border-gray-200
            [&_.MuiTableRow-root:hover]:bg-gray-50
          `}
                >
                    <MuiTableHead>
                        <MuiTableRow>
                            {columns.map((column) => (
                                <MuiTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ width: column.width }}
                                    sortDirection={orderBy === column.id ? order : false}
                                >
                                    {column.sortable ? (
                                        <MuiTableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                            className="whitespace-nowrap"
                                        >
                                            {column.label}
                                        </MuiTableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </MuiTableCell>
                            ))}
                        </MuiTableRow>
                    </MuiTableHead>
                    <MuiTableBody>
                        {data.map((row, rowIndex) => (
                            <MuiTableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <MuiTableCell
                                        key={column.id}
                                        align={column.align}
                                    >
                                        {column.render
                                            ? column.render(row[column.id], row)
                                            : row[column.id]}
                                    </MuiTableCell>
                                ))}
                            </MuiTableRow>
                        ))}
                    </MuiTableBody>
                </MuiTable>
            </MuiTableContainer>
            <MuiTablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={`
          [&_.MuiTablePagination-selectLabel]:text-sm
          [&_.MuiTablePagination-displayedRows]:text-sm
          [&_.MuiTablePagination-select]:text-sm
          [&_.MuiTablePagination-select]:py-1
          [&_.MuiTablePagination-select]:px-2
          [&_.MuiTablePagination-select]:rounded-md
          [&_.MuiTablePagination-select]:border
          [&_.MuiTablePagination-select]:border-gray-300
          [&_.MuiTablePagination-select]:bg-white
        `}
            />
        </Paper>
    );
};

export default Table; 