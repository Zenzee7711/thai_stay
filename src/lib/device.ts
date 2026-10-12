// Safari on iPhone and iPad may delete a site's saved data if the site isn't opened for 7 days.
// Pages added to the Home Screen keep their data, so we suggest that to iOS users only.

export type DeviceInfo = {
  userAgent: string;
  maxTouchPoints: number;
  standalone: boolean; // true when opened from the Home Screen
};

export function isAppleMobile({ userAgent, maxTouchPoints }: DeviceInfo): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // iPads report themselves as a Mac, but a Mac has no touch screen.
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

export function shouldSuggestHomeScreen(device: DeviceInfo): boolean {
  return isAppleMobile(device) && !device.standalone;
}
