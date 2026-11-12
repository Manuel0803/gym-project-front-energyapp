export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8">
        <div className="flex flex-col gap-6">
          <div className="h-5 w-44 bg-border-primary/60 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-20 bg-border-primary/40 rounded"></div>
              <div className="h-10 w-full bg-background border border-border-primary/50 rounded"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-20 bg-border-primary/40 rounded"></div>
              <div className="h-10 w-full bg-background border border-border-primary/50 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-28 bg-border-primary/40 rounded"></div>
              <div className="h-10 w-full bg-background border border-border-primary/50 rounded"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-32 bg-border-primary/40 rounded"></div>
              <div className="h-10 w-full bg-background border border-border-primary/50 rounded"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
          <div className="h-10 w-28 border border-border-primary rounded-sm bg-transparent"></div>
          <div className="h-10 w-36 bg-border-primary/50 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
