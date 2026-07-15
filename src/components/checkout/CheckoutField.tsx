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
          defaultValue={defaultValue}
          rows={3}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
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
          aria-describedby={error ? `${id}-error` : undefined}
          className={fieldClass}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="text-error text-small">
          {error}
        </p>
      )}
    </div>
  );
}
