import {cn} from '@/lib/utils';

// Checkout field — default / focus / error / disabled.
//  • default:  surface-2 fill, 1px border-strong, muted label
//  • focus:    2px mustard border, no outline (CSS)
//  • error:    1px error border + error helper text below
//  • disabled: surface fill, muted text, not-allowed
export function CheckoutField({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  error,
  disabled,
  required,
  defaultValue,
  autoComplete,
  inputMode,
  textarea,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  textarea?: boolean;
}) {
  const fieldClass = cn(
    'w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors duration-[var(--motion-fast)] focus:outline-none',
    disabled
      ? 'bg-surface text-muted-foreground border-border cursor-not-allowed'
      : 'bg-surface-2',
    !disabled && !error && 'border-border-strong focus:border-mustard focus:border-2',
    !disabled && error && 'border-error focus:border-error focus:border-2',
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-small text-muted-foreground font-medium"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          defaultValue={defaultValue}
          rows={3}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={fieldClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className={fieldClass}
        />
      )}

      {/* PERSISTENT live region (D-2.25-5). It is in the DOM from first paint — empty, and `sr-only`
          until there is something to say — rather than being mounted together with its text. A live
          region inserted in the same tick as its first message is unreliable: several screen readers
          only announce changes to a region they were already tracking, so the previous
          conditionally-mounted <p> announced nothing at all on a failed submit and the customer was
          told about the error only if they navigated back to the field.

          `sr-only` is `position: absolute`, so while the region is empty it contributes no box and
          the field's spacing is byte-identical to before this change.

          role="alert" is assertive on purpose: a submit the customer just pressed and that did NOT
          go through has to interrupt, not queue behind whatever is being read.

          The size stays `text-small` (13px, brand.md §4) — see D-2.25-6. */}
      <p
        id={`${id}-error`}
        role="alert"
        className={cn('text-error text-small', !error && 'sr-only')}
      >
        {error}
      </p>
    </div>
  );
}
