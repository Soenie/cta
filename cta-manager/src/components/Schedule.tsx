import { Component, For, Show } from 'solid-js';
import { Calendar, Trash2, Skull, Sword, Castle, CoinsIcon, Swords } from 'lucide-solid';
import { Button } from '@kobalte/core';
import type { ScheduleEvent } from '../types';

interface ScheduleProps {
  events: ScheduleEvent[];
  onRemoveEvent: (id: string) => void;
}

const eventTypeConfig = {
  'World Boss': { icon: Skull, color: '#EF4444', bgColor: '#FEE2E2' },
  'Dynamic Event': { icon: Sword, color: '#8B5CF6', bgColor: '#EDE9FE' },
  'Guild War': { icon: Swords, color: '#10B981', bgColor: '#D1FAE5' },
  'Castle Siege': { icon: Castle, color: '#F59E0B', bgColor: '#FEF3C7' },
  'Tax Collection': { icon: CoinsIcon, color: '#6366F1', bgColor: '#E0E7FF' },
  'Riftstone Boss': { icon: Skull, color: '#666666', bgColor: '#F3F4F6' },
  'Archboss': { icon: Skull, color: '#EC4899', bgColor: '#FCE7F3' },
};

export const Schedule: Component<ScheduleProps> = (props) => {
  const groupedEvents = () => {
    const groups = props.events.reduce((acc, event) => {
      const key = event.time;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {} as Record<string, ScheduleEvent[]>);

    return Object.entries(groups)
      .sort(([timeA], [timeB]) => {
        const hourA = parseInt(timeA.split(':')[0]);
        const hourB = parseInt(timeB.split(':')[0]);
        return (hourA === 0 ? 24 : hourA) - (hourB === 0 ? 24 : hourB);
      });
  };

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex items-center space-x-2 mb-6">
        <Calendar class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Schedule</h2>
      </div>
      
      <Show
        when={groupedEvents().length > 0}
        fallback={<p class="text-gray-500 dark:text-gray-400 text-center py-4">No events scheduled yet</p>}
      >
        <div class="relative">
          <div class="absolute top-0 bottom-0 left-16 w-px bg-gray-200 dark:bg-gray-700" />
          <div class="space-y-6">
            <For each={groupedEvents()}>
              {([time, timeEvents]) => (
                <div class="relative">
                  <div class="absolute left-[3.85rem] top-[0.6rem] w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-gray-800" />
                  <div class="flex">
                    <div class="w-16 flex-none pt-1">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white">
                        {time}
                      </div>
                    </div>
                    <div class="flex-grow pl-8">
                      <For each={timeEvents}>
                        {(event, index) => {
                          const { icon: EventIcon, color } = eventTypeConfig[event.type];
                          return (
                            <div
                              class={`flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 pt-1 -ml-2 ${
                                index() === 0 ? '-mt-1' : 'mt-2'
                              }`}
                            >
                              <div 
                                class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                                style={{ 'background-color': color, color: 'white' }}
                              >
                                <EventIcon class="h-4 w-4" />
                                <span>{event.type}</span>
                                <Show when={event.guild}>
                                  <span class="border-l border-white/30 pl-2 ml-1">
                                    {event.guild}
                                  </span>
                                </Show>
                                <Show when={event.memberCount !== undefined}>
                                  <span class="border-l border-white/30 pl-2 ml-1">
                                    {event.memberCount}+
                                  </span>
                                </Show>
                              </div>
                              <Button.Root
                                onClick={() => props.onRemoveEvent(event.id)}
                                class="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 p-1"
                              >
                                <Trash2 class="h-5 w-5" />
                              </Button.Root>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};