import { useState, useMemo, ReactNode } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  RowSelectionState
} from '@tanstack/react-table';
import { Trash2, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';
import { TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { Inbox } from 'lucide-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  onDelete?: (ids: string[]) => void;
  filterComponent?: ReactNode;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  isLoading = false,
  onDelete,
  filterComponent,
  className
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={5} className={className} />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
          {searchKey && (
            <SearchBar 
              value={globalFilter ?? ''} 
              onChange={value => setGlobalFilter(String(value))} 
              placeholder={searchPlaceholder}
            />
          )}
          {filterComponent}
        </div>
        
        {onDelete && selectedRows.length > 0 && (
          <button
            onClick={() => {
              const ids = selectedRows.map(row => (row.original as any).id);
              if (ids.length > 0) onDelete(ids);
            }}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedRows.length})
          </button>
        )}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div 
                            className={cn("flex items-center gap-1", isSortable && "cursor-pointer select-none hover:text-foreground")}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {isSortable && (
                              <span className="w-4">
                                {{
                                  asc: <ChevronUp className="h-4 w-4" />,
                                  desc: <ChevronDown className="h-4 w-4" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-50 ml-1" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    <EmptyState 
                      icon={Inbox} 
                      title="No data found" 
                      description="No records to display at this moment." 
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        pageSize={table.getState().pagination.pageSize}
        onPageSizeChange={(size) => table.setPageSize(size)}
        totalItems={table.getFilteredRowModel().rows.length}
      />
    </div>
  );
}
