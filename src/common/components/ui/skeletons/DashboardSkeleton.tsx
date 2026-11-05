interface DashboardSkeletonProps {
  canViewRevenue?: boolean;
}

export function DashboardSkeleton({
  canViewRevenue = true,
}: DashboardSkeletonProps) {
  const cardCount = canViewRevenue ? 4 : 3;

  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-surface border border-border-primary rounded"></div>
          <div className="h-4 w-32 bg-surface border border-border-primary rounded mt-2"></div>
        </div>
        <div className="h-6 w-24 bg-surface border border-border-primary rounded"></div>
      </div>

      <div
        className={`grid gap-4 ${
          canViewRevenue
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-surface border border-border-primary rounded-lg p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-24 bg-border-primary/50 rounded"></div>
              <div className="h-8 w-8 bg-border-primary/30 rounded-full"></div>
            </div>
            <div className="h-8 w-16 bg-border-primary/80 rounded mt-2"></div>
            <div className="h-3 w-32 bg-border-primary/40 rounded mt-3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {Array.from({ length: canViewRevenue ? 2 : 1 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface border border-border-primary rounded-xl p-6 flex flex-col h-full min-h-100"
            >
              <div className="mb-4">
                <div className="h-6 w-56 bg-border-primary/50 rounded mb-2"></div>
                <div className="h-4 w-72 bg-border-primary/30 rounded"></div>
              </div>
              <div className="flex-1 mt-4 flex items-end justify-between opacity-30 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-50 bg-linear-to-t from-brand-main/20 to-transparent rounded-t-full blur-xl"></div>

                <div className="absolute inset-0 flex flex-col justify-between py-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-full border-t border-dashed border-border-primary"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border-primary rounded-lg flex flex-col h-100">
          <div className="flex items-center justify-between p-5 border-b border-border-primary">
            <div className="h-5 w-32 bg-border-primary/50 rounded"></div>
            <div className="h-5 w-8 bg-brand-surface rounded"></div>
          </div>
          <div className="flex-1 p-0 flex flex-col">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 border-b border-border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-border-primary/40 rounded-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-border-primary/60 rounded"></div>
                    <div className="h-3 w-16 bg-border-primary/30 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-12 bg-border-primary/40 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
