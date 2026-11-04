import { ThemeToggle } from '@/common/components/layout/ThemeToggle';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative transition-colors selection:bg-brand-main selection:text-white">
      {/* Isolated layout: Top right theme toggle only. Strictly NO sidebar and NO navbar. */}
      <aside className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </aside>

      {children}
    </div>
  );
}
