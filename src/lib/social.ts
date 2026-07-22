// The brand's public contact constants (facts.md §5/§6). All facts.md-VERIFIED. This is the single
// source for the phone + the one Instagram account, imported by the footer (every page) and the
// Contact page — never retyped. One typo in a phone number multiplies across every page and sends a
// real customer to a stranger, so it lives in exactly one place.
//
// Instagram is the ONLY social account (facts.md §6): no TikTok/Facebook/X/YouTube. Do not add an icon
// for a profile that does not exist. The handle is VERIFIED; the URL still owes a live click-test
// before cutover (owed-verification register #2).
//
// Plain constants (no server-only) so both the server-rendered footer/Contact and the drop banner can
// import them. IG constants moved out of the deleted src/lib/demo.ts in 1.04; phone added in 1.05.

export const INSTAGRAM_HANDLE = "@trajanovv2026";
export const INSTAGRAM_URL = "https://instagram.com/trajanovv2026";

// Displayed in local format; dialled in E.164 (facts.md §5 leaves the display format to Vladimir —
// local was chosen, matching the 1.02 footer; the tel: link is E.164 either way).
export const PHONE_DISPLAY = "078 820 520";
export const PHONE_TEL = "tel:+38978820520";

// Public contact email (facts.md §5, VERIFIED — cleared for public display 2026-07-21). A DOMAIN address
// (Cloudflare Email Routing → Vladimir's inbox), also the order-email from-address (D-2.05-3). Published
// on Contact as of 2.05. Distinct from ORDER_NOTIFICATION_EMAIL (the recipient inbox, never in the repo).
export const EMAIL = "info@trajanovv.com";
export const EMAIL_MAILTO = "mailto:info@trajanovv.com";
