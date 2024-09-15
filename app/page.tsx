'use client';

import { HabitTrack } from '@/components/habit-track';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto">
        <HabitTrack />
      </main>
    </div>
  );
}
