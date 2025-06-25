
import { useState, useMemo } from 'react';

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination<T>(data: T[], options: PaginationOptions = {}) {
  const { initialPage = 1, pageSize = 10 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage
  };
}
