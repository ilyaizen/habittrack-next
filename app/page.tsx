'use client';

import { HabitTrack } from '@/components/habit-track';

export default function Home() {
  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HabitTrack />
      </main>
    </div>
  );
}
