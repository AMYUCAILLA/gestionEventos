export interface Event {
  id: string;
  title: string;
  guests: string[];
  dateTime: string; 
  timeZone: string; 
  description: string;
  recurrence?: Recurrence;
  reminderMinutesBefore?: number;
  category?: string;
  locationId: string;
}
export interface Recurrence {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  until?: string;
  count?: number;
}

