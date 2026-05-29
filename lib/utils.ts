import {
  addHours,
  format,
  startOfDay,
} from 'date-fns';
// Import the correct locale for date-fns
import { enUS } from 'date-fns/locale';

export function getAvailableTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let i = startHour; i <= endHour; i++) {
    const slot = addHours(startOfDay(date), i);
    slots.push(format(slot, 'HH:mm', { locale: enUS }));
  }

  return slots;
}
