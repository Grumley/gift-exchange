import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { FestiveParade } from './FestiveParade';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-32">
        {children}
        <FestiveParade className="absolute bottom-0 left-0" />
      </main>
    </div>
  );
}
