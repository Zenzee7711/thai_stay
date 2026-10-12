// Facts about the browser that change how safely we can keep saved dates.

export type DeviceInfo = {
  userAgent: string;
  maxTouchPoints: number;
  standalone: boolean; // true when opened from the Home Screen
};

// Safari on iPhone and iPad may delete a site's saved data if the site isn't opened for 7 days.
// Pages added to the Home Screen keep their data, so we suggest that to iOS users only.
export function isAppleMobile({ userAgent, maxTouchPoints }: DeviceInfo): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // iPads report themselves as a Mac, but a Mac has no touch screen.
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

export function shouldSuggestHomeScreen(device: DeviceInfo): boolean {
  return isAppleMobile(device) && !device.standalone && !inAppBrowser(device.userAgent);
}

// Browsers built into chat and social apps keep their own storage, which is often cleared.
// Returns the app's name, or null in a normal browser.
export function inAppBrowser(userAgent: string): string | null {
  if (/\bLine\//.test(userAgent)) return "LINE";
  if (/Instagram/.test(userAgent)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB/.test(userAgent)) return "Facebook";
  if (/musical_ly|BytedanceWebview|TikTok/.test(userAgent)) return "TikTok";
  return null;
}

// LINE opens a link in the phone's normal browser when it carries openExternalBrowser=1.
export function openInBrowserUrl(currentUrl: string): string {
  const url = new URL(currentUrl);
  url.searchParams.set("openExternalBrowser", "1");
  return url.toString();
}
