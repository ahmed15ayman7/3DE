import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showTotalItems?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  className?: string;
}

const getSizeClasses = (size: PaginationProps['size']) => {
  switch (size) {
    case 'sm':
      return {
        button: 'px-2 py-1 text-xs',
        select: 'px-2 py-1 text-xs'
      };
    case 'lg':
      return {
        button: 'px-4 py-2 text-base',
        select: 'px-3 py-2 text-base'
      };
    default:
      return {
        button: 'px-3 py-2 text-sm',
        select: 'px-2 py-1 text-sm'
      };
  }
};

const getVariantClasses = (variant: PaginationProps['variant']) => {
  switch (variant) {
    case 'minimal':
      return {
        container: 'flex items-center justify-between',
        navigation: 'flex items-center gap-1',
        button: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        activeButton: 'border-blue-500 bg-blue-500 text-white hover:bg-primary-main',
        disabledButton: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
      };
    default:
      return {
        container: 'flex items-center justify-between',
        navigation: 'flex items-center gap-2',
        button: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md',
        activeButton: 'border-blue-500 bg-blue-500 text-white hover:bg-primary-main rounded-md',
        disabledButton: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed rounded-md'
      };
  }
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = false,
  showTotalItems = false,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    onItemsPerPageChange?.(newItemsPerPage);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`${variantClasses.container} ${className}`}>
      <div className="flex items-center gap-4">
        {showTotalItems && (
          <div className="text-sm text-gray-700">
            عرض {startItem} إلى {endItem} من {totalItems} نتيجة
          </div>
        )}
        
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">عرض</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className={`
                ${sizeClasses.select}
                border border-gray-300 rounded-md bg-white text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              `}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">في الصفحة</span>
          </div>
        )}
      </div>

      <div className={variantClasses.navigation}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            ${sizeClasses.button}
            ${variantClasses.button}
            ${currentPage === 1 ? variantClasses.disabledButton : ''}
            transition-colors duration-200
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={`${sizeClasses.button} text-gray-500`}>...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                className={`
                  ${sizeClasses.button}
                  ${page === currentPage ? variantClasses.activeButton : variantClasses.button}
                  transition-colors duration-200
                `}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            ${sizeClasses.button}
            ${variantClasses.button}
            ${currentPage === totalPages ? variantClasses.disabledButton : ''}
            transition-colors duration-200
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = ''
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      عرض {startItem} إلى {endItem} من {totalItems} نتيجة
    </div>
  );
};

export interface ItemsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export const ItemsPerPage: React.FC<ItemsPerPageProps> = ({
  value,
  onChange,
  options = [10, 25, 50, 100],
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-700">عرض</span>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">في الصفحة</span>
    </div>
  );
}; 