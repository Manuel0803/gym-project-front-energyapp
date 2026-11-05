import { ThemeToggle } from '@/common/components/layout/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative transition-colors">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {children}
    </div>
  );
}
