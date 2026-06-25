// Generate available time slots for a given date
// Excludes slots that are already booked

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

export const SERVICES = [
  "General Consultation",
  "Strategy Session",
  "Technical Review",
  "Product Demo",
  "Onboarding Call",
  "Q&A Session",
];

export function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function getMaxDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().split("T")[0];
}

export function formatTimeSlot(slot: string) {
  const [h, m] = slot.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${ampm}`;
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
