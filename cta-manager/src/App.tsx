import { Component, onMount, Show, createSignal } from 'solid-js';
import { Send } from 'lucide-solid';
import { session, initializeAuth, signOut } from './lib/auth';
import { Auth } from './components/Auth';
import { EventForm } from './components/EventForm';
import { Schedule } from './components/Schedule';
import { ThemeToggle } from './components/ThemeToggle';
import type { ScheduleEvent, EventType, GuildName } from './types';
import { supabase } from './lib/supabase';

const App: Component = () => {
  const [events, setEvents] = createSignal<ScheduleEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  onMount(() => {
    initializeAuth();
  });

  const handleAddEvent = (date: string, time: string, timestamp: number, type: EventType, memberCount?: number, guild?: GuildName) => {
    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      date,
      time,
      timestamp,
      type,
      memberCount,
      guild,
    };
    setEvents([...events(), newEvent]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events().filter((event) => event.id !== id));
  };

  const handleSubmit = async () => {
    if (events().length === 0) {
      alert('Please add at least one event to the schedule');
      return;
    }

    const scheduleId = crypto.randomUUID();

    setIsSubmitting(true);
    try {
      const payload = {
        events: events().map(({ id, date, time, memberCount, ...event }) => ({
          ...event,
          members_required: memberCount,
          schedule_id: scheduleId,
        })),
        submittedAt: Math.floor(Date.now() / 1000),
        userEmail: session()?.user?.email,
      };

      const {error: scheduleError} = await supabase.from('schedules').insert({
        id: scheduleId,
        timestamp: payload.submittedAt,
        created_by: payload.userEmail,
      });

      if (scheduleError) {
        throw new Error(`Failed to submit schedule: ${scheduleError.message}`);
      }

      const {error: eventsError} = await supabase.from('events').insert(payload.events)

      if (eventsError) {
        throw new Error(`Failed to submit schedule: ${eventsError.message}`);
      }

      

      // alert('Schedule submitted successfully!');
      setEvents([]);
    } catch (error) {
      console.error('Error submitting schedule:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Show
      when={session()}
      fallback={<Auth />}
    >
      <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-8">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Daily Schedule</h1>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <EventForm onAddEvent={handleAddEvent} />
            </div>

            <div class="space-y-4">
              <Schedule events={events()} onRemoveEvent={handleRemoveEvent} />

              <Show when={events().length > 0}>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting()}
                  class="w-full flex items-center justify-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send class="h-5 w-5" />
                  <span>{isSubmitting() ? 'Submitting...' : 'Submit Schedule'}</span>
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default App;