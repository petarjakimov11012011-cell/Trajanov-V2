// Timezone resolution for drop times (D-1.04-4).
//
// Drop config carries a NAIVE local wall-clock string with no offset ("2026-08-15T20:00") plus the
// fixed zone below. Vladimir says "Friday 20:00"; North Macedonia is UTC+1 in winter and UTC+2 in
// summer, so a hand-written offset in config would be silently wrong for half the year. This module is
// the ONE place that resolves a wall-clock to an absolute instant, DST-aware, so the DB always holds a
// `timestamptz` and create_order() keeps comparing against now() in the database.
//
// Pure, dependency-free (uses only Intl), so it is trivially unit-testable across a DST boundary.

/** The brand operates in one place. Every drop time is this zone's wall-clock (D-1.04-4). */
export const DROP_TIMEZONE = "Europe/Skopje";

/** "YYYY-MM-DDTHH:mm" — a naive local wall-clock, no timezone/offset. */
const WALL_CLOCK_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export function isWallClock(value: string): boolean {
  return WALL_CLOCK_RE.test(value);
}

/**
 * The offset, in ms, that `timeZone` is AHEAD of UTC at a given absolute instant. Positive east of
 * UTC (Skopje is +1h/+2h). Computed by asking Intl what wall-clock the zone shows for that instant and
 * treating that reading as if it were UTC.
 */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(instant)) p[part.type] = part.value;
  const shownAsUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return shownAsUtc - instant.getTime();
}

/**
 * Resolve a naive Europe/Skopje (or given zone) wall-clock string to the absolute UTC instant it
 * denotes, correctly across DST boundaries (D-1.04-4). Throws on a malformed string — a bad drop time
 * must fail the sync loudly, never open the drop an hour early.
 *
 *   resolveWallClockToUtc("2026-08-15T20:00") -> 2026-08-15T18:00:00.000Z  (summer, UTC+2)
 *   resolveWallClockToUtc("2026-01-15T20:00") -> 2026-01-15T19:00:00.000Z  (winter, UTC+1)
 */
export function resolveWallClockToUtc(wall: string, timeZone: string = DROP_TIMEZONE): Date {
  const m = WALL_CLOCK_RE.exec(wall);
  if (!m) {
    throw new Error(
      `Invalid drop time "${wall}": expected a naive wall-clock "YYYY-MM-DDTHH:mm" with no offset (D-1.04-4).`,
    );
  }
  const [, y, mo, d, h, mi] = m;
  // Interpret the wall-clock digits as if they were UTC, then subtract the zone's offset to land on the
  // true instant. Refine once so DST transition days resolve to the correct side of the jump.
  const naiveAsUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), 0);
  let offset = zoneOffsetMs(new Date(naiveAsUtc), timeZone);
  let instant = naiveAsUtc - offset;
  offset = zoneOffsetMs(new Date(instant), timeZone);
  instant = naiveAsUtc - offset;
  return new Date(instant);
}
