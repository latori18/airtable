import { differenceInCalendarDays, parseISO } from "date-fns";
import { TimelineItem } from "../types/timeline";

export function daysBetween(start: Date, end: Date): number {
  return differenceInCalendarDays(end, start);
}

export function dateToX(
  date: Date,
  offsetDate: Date,
  zoom: number
): number {
  return daysBetween(offsetDate, date) * zoom;
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function getEffectiveEndDate(dateStr: string) {
  return parseISO(dateStr);
}

export function isOverlapping(item1: TimelineItem, item2: TimelineItem) {
  const start1 = parseISO(item1.start);
  const end1 = getEffectiveEndDate(item1.end);

  const start2 = parseISO(item2.start);
  const end2 = getEffectiveEndDate(item2.end);

  return start1 < end2 && start2 < end1;
}
