import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  filterPlaceholder?: string;
  pagination?: boolean;
  itemsPerPage?: number;
  actionComponent?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  className,
  emptyMessage = "No data available",
  filterPlaceholder = "Search...",
  pagination = true,
  itemsPerPage = 10,
  actionComponent
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterValue) return data;
    
    return data.filter(row => {
      return Object.entries(row as Record<string, any>).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(filterValue);
        }
        return false;
      });
    });
  }, [data, filterValue]);
  
  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField] as any;
      const bValue = b[sortField] as any;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage, pagination]);
  
  // Handle sorting
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="pl-8 pr-4 py-2 w-40 lg:w-64"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-3 top-3 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr className="bg-neutral-50">
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider",
                    column.sortable && "sortable",
                    column.sortable && sortField === column.accessor && sortDirection === 'asc' && "asc",
                    column.sortable && sortField === column.accessor && sortDirection === 'desc' && "desc",
                    column.className
                  )}
                  onClick={() => column.sortable && typeof column.accessor === 'string' && handleSort(column.accessor as keyof T)}
                >
                  {column.header}
                </th>
              ))}
              {actionComponent && (
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr 
                  key={String(row[keyField])}
                  className={cn("hover:bg-neutral-50", onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, index) => (
                    <td 
                      key={index} 
                      className={cn("px-6 py-4 whitespace-nowrap text-sm text-neutral-600", column.className)}
                    >
                      {typeof column.accessor === 'function' 
                        ? column.accessor(row) 
                        : row[column.accessor] as React.ReactNode}
                    </td>
                  ))}
                  {actionComponent && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actionComponent(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actionComponent ? 1 : 0)} 
                  className="px-6 py-8 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-neutral-700">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{" "}
            <span className="font-medium">{sortedData.length}</span> results
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
