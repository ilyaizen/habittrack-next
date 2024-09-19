'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Define the structure of a Habit
type Habit = {
  id: string;
  name: string;
  days: Record<string, boolean>;
};

export function HabitTrack() {
  // State for storing habits
  const [habits, setHabits] = useState<Habit[]>([]);
  // State for new habit input
  const [newHabit, setNewHabit] = useState('');
  // State for current date (used for calendar navigation)
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for deletion confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  // Add this new state to track recently checked habits
  const [recentlyChecked, setRecentlyChecked] = useState<Record<string, boolean>>({});

  // Effect to load habits from localStorage on component mount
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    const defaultsInitialized = localStorage.getItem('defaultsInitialized');

    if (storedHabits && storedHabits !== '[]') {
      setHabits(JSON.parse(storedHabits));
    } else if (!defaultsInitialized) {
      // Set default habits only if they haven't been initialized before
      const defaultHabits: Habit[] = [
        { id: '1', name: 'Hygiene', days: {} },
        { id: '2', name: 'Workout', days: {} },
      ];
      setHabits(defaultHabits);
      localStorage.setItem('habits', JSON.stringify(defaultHabits));
      localStorage.setItem('defaultsInitialized', 'true');
    }
  }, []);

  // Effect to save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Function to add a new habit
  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { id: Date.now().toString(), name: newHabit, days: {} }]);
      setNewHabit('');
    }
  };

  // New function to handle key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addHabit();
    }
  };

  // Modify removeHabit to open confirmation modal
  const removeHabit = (habit: Habit) => {
    setHabitToDelete(habit);
    setIsModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (habitToDelete) {
      setHabits(habits.filter((h) => h.id !== habitToDelete.id));
      setIsModalOpen(false);
      setHabitToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false);
    setHabitToDelete(null);
  };

  // Modify the toggleDay function
  const toggleDay = (habitId: string, date: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const newDays = { ...habit.days, [date]: !habit.days[date] };

          // Set the recently checked state
          if (!habit.days[date]) {
            setRecentlyChecked((prev) => ({ ...prev, [`${habitId}-${date}`]: true }));
            // Remove the recently checked state after animation
            setTimeout(() => {
              setRecentlyChecked((prev) => ({ ...prev, [`${habitId}-${date}`]: false }));
            }, 300); // 300ms matches the animation duration
          }

          return { ...habit, days: newDays };
        }
        return habit;
      })
    );
  };

  // Function to get all days in a month
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Get days in the current month
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Get the day of the week for the first day of the month (0-6)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Function to navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Function to navigate to the next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Effect to log habits state whenever it changes
  useEffect(() => {
    console.log('Current habits:', habits);
  }, [habits]);

  // Add this function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full">
      {/* Form to add new habits */}
      <div className="mb-6 mt-6">
        <Label htmlFor="new-habit" className="mb-2 block text-lg font-semibold">
          Add New Habit
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="new-habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter new habit"
            className="flex-grow"
          />
          <Button onClick={addHabit} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button onClick={prevMonth} variant="outline" className="p-2 sm:p-4">
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
        <h2 className="text-lg font-semibold sm:text-xl">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <Button onClick={nextMonth} variant="outline" className="p-2 sm:p-4">
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="-mx-4 mb-6 overflow-x-auto sm:mx-0">
        <div className="min-w-full sm:min-w-[640px]">
          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 gap-1 px-4 sm:px-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold sm:text-sm">
                {day}
              </div>
            ))}
          </div>
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 px-4 sm:px-0">
            {/* Empty cells for days before the 1st of the month */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {/* Actual calendar days */}
            {daysInMonth.map((date) => (
              <div
                key={date.toString()}
                className={`relative aspect-square overflow-hidden rounded-lg border p-1 ${
                  isToday(date) ? 'bg-primary' : ''
                }`}
              >
                <div className="absolute right-0 top-0 rounded-bl bg-red-500 px-1 text-xs font-black text-white">
                  {date.getDate()}
                </div>
                <div className="max-h-[calc(100%-1rem)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                  {habits.map((habit) => {
                    const dateString = date.toISOString().split('T')[0];
                    const isChecked = habit.days[dateString];
                    const isRecentlyChecked = recentlyChecked[`${habit.id}-${dateString}`];
                    return (
                      <button
                        key={habit.id}
                        onClick={() => toggleDay(habit.id, dateString)}
                        className={cn(
                          'mb-1 w-full rounded p-1 text-left text-xs',
                          isChecked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block transition-transform',
                            isRecentlyChecked && 'animate-check-pop-in'
                          )}
                        >
                          {isChecked ? '✅ ' : ''}
                        </span>
                        {habit.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List of habits */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow">
            <h3 className="text-lg font-semibold">{habit.name}</h3>
            <Button variant="ghost" onClick={() => removeHabit(habit)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the habit &ldquo;{habitToDelete?.name}&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={confirmDelete}>Yes, Delete</Button>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
