// Everything the user has told us. Dates are YYYY-MM-DD text, or "" when not entered.
export type Profile = {
  arrivalDate: string;
  slipDueDate: string;
  permittedUntil: string;
  hasReentryPermit: boolean;
};

export const emptyProfile: Profile = {
  arrivalDate: "",
  slipDueDate: "",
  permittedUntil: "",
  hasReentryPermit: false,
};

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function dateOrEmpty(value: unknown): string {
  return typeof value === "string" && isoDate.test(value) ? value : "";
}

// Saved data can be missing, old, or edited by hand, so never trust it:
// keep only the fields that have the right shape.
export function parseProfile(raw: string | null): Profile {
  if (!raw) return emptyProfile;
  try {
    const data = JSON.parse(raw);
    return {
      arrivalDate: dateOrEmpty(data.arrivalDate),
      slipDueDate: dateOrEmpty(data.slipDueDate),
      permittedUntil: dateOrEmpty(data.permittedUntil),
      hasReentryPermit: data.hasReentryPermit === true,
    };
  } catch {
    return emptyProfile;
  }
}

// Coming back into Thailand restarts the 90-day count, and the old slip date no longer applies.
export function afterReentry(profile: Profile, today: string): Profile {
  return { ...profile, arrivalDate: today, slipDueDate: "" };
}
