export type EventType = 'World Boss' | 'Dynamic Event' | 'Guild War' | 'Castle Siege' | 'Tax Collection' | 'Riftstone Boss' | 'Archboss';
export type GuildName = 'Bored Apes' | 'Bored Dragons';

export interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  type: EventType;
  memberCount?: number;
  guild?: GuildName;
}