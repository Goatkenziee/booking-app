import {
  addHours,
  format,
  startOfDay,
} from 'date-fns';

export function getAvailableTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let i = startHour; i <= endHour; i++) {
    const slot = addHours(startOfDay(date), i);
    slots.push(format(slot, 'HH:mm'));
  }

  return slots;
}
