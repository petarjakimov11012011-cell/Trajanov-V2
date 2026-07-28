/**
 * Which field a failed submit should send focus to.
 *
 * WHY THIS EXISTS. Both forms build their error map by running a few checks in whatever order the
 * checks happen to be written — CheckoutForm fills `name`, `city`, `address` in one loop and `phone`
 * afterwards. `Object.keys(errors)[0]` therefore names the first check that failed, not the first
 * field the customer will reach. Focus has to land on the first invalid field in DOM order or the
 * customer is dropped past a field they still have to fix.
 *
 * Pure and DOM-free on purpose: the suite runs on `environment: "node"` (vitest.config.ts), so the
 * decision is unit-testable and only the two-line `.focus()` call stays in the component.
 */
export function firstInvalidField<K extends string>(
  errors: Partial<Record<K, string>>,
  domOrder: readonly K[],
): K | null {
  for (const name of domOrder) {
    if (errors[name]) return name;
  }
  return null;
}

/**
 * Move keyboard focus to a named control inside `form`.
 *
 * `form.elements.namedItem()` returns `RadioNodeList | Element | null`; the `instanceof HTMLElement`
 * guard rejects the list case and the missing case in one check, so a renamed field degrades to
 * "focus did not move" rather than throwing inside a submit handler.
 */
export function focusFormField(form: HTMLFormElement, name: string): boolean {
  const el = form.elements.namedItem(name);
  if (!(el instanceof HTMLElement)) return false;
  el.focus();
  return true;
}
