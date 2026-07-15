// Normalise a Macedonian phone number to the DB's stored form, `+389########` (the orders.phone_normalized
// CHECK, ^\+389\d{8}$). Vladimir's own 078820520 must pass → +38978820520. Returns null when it cannot be
// normalised, so the caller can reject before create_order() rather than trip a DB CHECK mid-transaction.
//
// NOTE (TODO 2.02): the ^\+389\d{8}$ shape is the orchestrator's best read of MK numbering, not a VERIFIED
// fact (see the schema migration). If it ever rejects a real number, loosening it here + in the DB is the fix.
export function normalizeMkPhone(raw: string): string | null {
  const s = (raw ?? "").replace(/[\s\-().]/g, "");
  if (/^\+389\d{8}$/.test(s)) return s; // already normalised
  if (/^00389\d{8}$/.test(s)) return "+" + s.slice(2); // 00389… international prefix
  if (/^389\d{8}$/.test(s)) return "+" + s; // missing the +
  if (/^0\d{8}$/.test(s)) return "+389" + s.slice(1); // local 0########
  return null;
}
