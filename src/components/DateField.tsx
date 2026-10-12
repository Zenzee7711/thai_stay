type DateFieldProps = {
  id: string;
  label: string;
  hint?: string; // the ? means this prop is optional
  value: string;
  onChange: (value: string) => void;
};

export default function DateField({ id, label, hint, value, onChange }: DateFieldProps) {
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {/* text-base (16px) stops iPhones from zooming in when the field is tapped. */}
      <input
        id={id}
        type="date"
        value={value}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2.5 text-base focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
      />
    </div>
  );
}
