import { startOfDay, addDays } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export function getAppTimeZone(): string {
  return process.env.APP_TIMEZONE || "America/Bogota";
}

export function getTodayRangeUtc(timeZone: string = getAppTimeZone()): {
  startUtc: Date;
  nextStartUtc: Date;
} {
  const currentInstant = new Date();
  const currentTimeInZone = toZonedTime(currentInstant, timeZone);

  const startOfTodayInZone = startOfDay(currentTimeInZone);
  const startOfTomorrowInZone = startOfDay(addDays(currentTimeInZone, 1));

  const startUtc = fromZonedTime(startOfTodayInZone, timeZone);
  const nextStartUtc = fromZonedTime(startOfTomorrowInZone, timeZone);

  return { startUtc, nextStartUtc };
}
