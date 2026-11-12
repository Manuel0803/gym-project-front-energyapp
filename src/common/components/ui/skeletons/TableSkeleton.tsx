interface TableSkeletonProps {
  showToolbar?: boolean;
}

export function TableSkeleton({ showToolbar = false }: TableSkeletonProps) {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="h-9 w-36 bg-surface border border-border-primary rounded-md"></div>
          <div className="h-9 w-36 bg-surface border border-border-primary rounded-md"></div>
          <div className="h-9 w-32 bg-surface border border-border-primary rounded-md"></div>
          <div className="h-9 w-72 bg-surface border border-border-primary rounded-md"></div>
        </div>
      )}

      {/* Table Area */}
      <div className="bg-surface border border-border-primary rounded-lg overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-primary bg-background">
          <div className="h-3 w-28 bg-border-primary/50 rounded"></div>
          <div className="h-3 w-16 bg-border-primary/50 rounded"></div>
          <div className="h-3 w-24 bg-border-primary/50 rounded"></div>
          <div className="h-3 w-16 bg-border-primary/50 rounded"></div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between px-5 py-4 border-b border-border-primary last:border-b-0"
          >
            <div className="flex items-center gap-3 w-1/3">
              <div className="h-10 w-10 shrink-0 bg-border-primary/30 rounded-full"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-28 bg-border-primary/60 rounded"></div>
                <div className="h-2.5 w-20 bg-border-primary/30 rounded"></div>
              </div>
            </div>
            <div className="w-1/4">
              <div className="h-5 w-20 bg-border-primary/40 rounded-full"></div>
            </div>
            <div className="w-1/4">
              <div className="h-3.5 w-32 bg-border-primary/40 rounded"></div>
            </div>
            <div className="flex justify-center w-12">
              <div className="h-6 w-6 bg-border-primary/30 rounded"></div>
            </div>
          </div>
        ))}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border-primary">
          <div className="h-4 w-36 bg-border-primary/40 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-border-primary/30 rounded"></div>
            <div className="h-6 w-6 bg-border-primary/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
