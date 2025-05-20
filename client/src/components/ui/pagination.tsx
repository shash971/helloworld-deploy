import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate middle pages
      const leftBound = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages - 1, leftBound + maxVisiblePages - 3);
      
      // Add ellipsis if needed
      if (leftBound > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (rightBound < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <nav className={cn("relative z-0 inline-flex rounded-md shadow-sm -space-x-px", className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        className="rounded-l-md"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      
      {getPageNumbers().map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300"
            >
              {page}
            </span>
          );
        }
        
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-none",
              currentPage === page ? "bg-primary text-primary-foreground" : "bg-white text-neutral-500 hover:bg-neutral-50"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="sm"
        className="rounded-r-md"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  );
}
