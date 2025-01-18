import { Component, For, Show, createSignal } from 'solid-js';
import { Clock, Plus, Users, CalendarPlus, Sword, Skull, Castle, CoinsIcon, Swords } from 'lucide-solid';
import { Button } from '@kobalte/core';
import type { EventType, GuildName } from '../types';

interface EventFormProps {
  onAddEvent: (date: string, time: string, timestamp: number, type: EventType, memberCount?: number, guild?: GuildName) => void;
}

const eventTypeConfig = [
  { type: 'World Boss' as EventType, icon: Skull, color: '#EF4444' },
  { type: 'Inter Server' as EventType, icon: Sword, color: '#3B82F6' },
  { type: 'Dynamic Event' as EventType, icon: Sword, color: '#8B5CF6' },
  { type: 'Guild War' as EventType, icon: Swords, color: '#10B981' },
  { type: 'Castle Siege' as EventType, icon: Castle, color: '#F59E0B' },
  { type: 'Tax Collection' as EventType, icon: CoinsIcon, color: '#6366F1' },
  { type: 'Archboss Peace' as EventType, icon: Skull, color: '#EC4899' },
  { type: 'Archboss Conflict' as EventType, icon: Skull, color: '#FF0000' },
];

const guilds: GuildName[] = ['Bored Apes', 'Bored Dragons'];
const timeSlots = ['12','13', '14', '15','16', '17', '18', '19', '20', '21','22', '23', '24'];

export const EventForm: Component<EventFormProps> = (props) => {
  const [date, setDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [time, setTime] = createSignal('15:00');
  const [type, setType] = createSignal<EventType>('World Boss');
  const [memberCount, setMemberCount] = createSignal<string>('');
  const [guild, setGuild] = createSignal<GuildName | undefined>();
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setError(null);

    if (!date() || !time() || !type()) {
      setError('Please fill in all required fields');
      return;
    }

    if (memberCount() && !/^\d*$/.test(memberCount())) {
      setError('Member count must be a valid number');
      return;
    }

    if ((type() === 'Guild War' || type() === 'Riftstone Boss') && !guild()) {
      setError('Please select a guild');
      return;
    }

    
    // const selectedDate = new Date(date());
    // selectedDate.setHours(parseInt(time().split(':')[0], 10), 0, 0, 0);
    // const timestamp = Math.floor(selectedDate.getTime() / 1000);
    
// Convert the above date functions to use UTC time
    const selectedDate = new Date(date());
    selectedDate.setUTCHours(parseInt(time().split(':')[0], 10), 0, 0, 0);
    const timestamp = Math.floor(selectedDate.getTime() / 1000);


    const parsedMemberCount = memberCount() ? parseInt(memberCount(), 10) : undefined;
    
    props.onAddEvent(
      date(),
      time(),
      timestamp,
      type(),
      parsedMemberCount && parsedMemberCount >= 0 ? parsedMemberCount : undefined,
      guild()
    );

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    // setTime('15:00');
    // setType('World Boss');
    setMemberCount('');
    setGuild(undefined);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <div class="flex items-center space-x-2 mb-4">
        <CalendarPlus class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">New Event</h2>
      </div>

      {error() && (
        <div class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
          {error()}
        </div>
      )}

      <div class="flex flex-col space-y-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Clock class="h-4 w-4" />
          Date
        </label>
        <input
          type="date"
          value={date()}
          onChange={(e) => setDate(e.currentTarget.value)}
          min={new Date().toISOString().split('T')[0]}
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Clock class="h-4 w-4" />
          Time (UTC)
        </label>
        <div class="flex flex-wrap gap-2">
          <For each={timeSlots}>
            {(hour) => (
              <Button.Root
                type="button"
                onClick={() => setTime(`${hour}:00`)}
                class={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  time() === `${hour}:00`
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {hour}:00
              </Button.Root>
            )}
          </For>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
          Event Type
        </label>
        <div class="flex flex-wrap gap-2">
          <For each={eventTypeConfig}>
            {({ type: eventType, icon: Icon, color }) => (
              <Button.Root
                type="button"
                onClick={() => {
                  setType(eventType);
                  if (eventType !== 'Guild War' && eventType !== 'Riftstone Boss') {
                    setGuild(undefined);
                  }
                }}
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
                style={{
                  'background-color': type() === eventType ? color : '#F3F4F6',
                  'color': type() === eventType ? 'white' : '#4B5563',
                }}
              >
                <Icon class="h-4 w-4" />
                {eventType}
              </Button.Root>
            )}
          </For>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-between">
          <span>Minimum Member Count</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
        </label>
        <div class="relative">
          <Users class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            value={memberCount()}
            onInput={(e) => setMemberCount(e.currentTarget.value)}
            placeholder="Enter minimum members needed"
            class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <Show when={type() === 'Guild War' || type() === 'Riftstone Boss'}>
        <div class="flex flex-col space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
            Select Guild
          </label>
          <div class="flex flex-wrap gap-2">
            <For each={guilds}>
              {(guildName) => (
                <Button.Root
                  type="button"
                  onClick={() => setGuild(guildName)}
                  class={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    guild() === guildName
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {guildName}
                </Button.Root>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Button.Root
        type="submit"
        class="w-full flex items-center justify-center space-x-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus class="h-5 w-5" />
        <span>Add Event</span>
      </Button.Root>
    </form>
  );
};