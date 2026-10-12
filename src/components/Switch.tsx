type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

// An on/off switch. role="switch" + aria-checked tell screen readers it is a toggle.
export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-3 text-left text-sm"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-line"
        } group-focus-visible:ring-4 group-focus-visible:ring-accent/20`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
      {label}
    </button>
  );
}
