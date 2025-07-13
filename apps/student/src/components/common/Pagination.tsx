'use client';

import { Button } from '@3de/ui';

interface PaginationProps {
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function Pagination({ 
  currentPage, 
  onPrevious, 
  onNext, 
  hasNext = true, 
  hasPrevious = true 
}: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2">
      <Button 
        variant="outline" 
        disabled={!hasPrevious || currentPage === 0} 
        onClick={onPrevious}
      >
        السابق
      </Button>
      <Button 
        variant="outline" 
        onClick={onNext}
        disabled={!hasNext}
      >
        التالي
      </Button>
    </div>
  );
} 