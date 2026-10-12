// Immigration offices for in-person reports and extensions. Coordinates are approximate
// (roughly the office's town), which is enough to find the nearest one. Directions search
// Google Maps by the office's name, so Google supplies the exact location.
export type Office = { name: string; area: string; lat: number; lng: number };

export const offices: Office[] = [
  { name: "Chiang Rai Immigration Office", area: "Chiang Rai", lat: 19.91, lng: 99.83 },
  { name: "Phayao Immigration Office", area: "Phayao", lat: 19.17, lng: 99.9 },
  { name: "Chiang Mai Immigration Office", area: "Chiang Mai", lat: 18.79, lng: 98.98 },
  { name: "Lampang Immigration Office", area: "Lampang", lat: 18.29, lng: 99.49 },
  { name: "Nan Immigration Office", area: "Nan", lat: 18.78, lng: 100.78 },
  { name: "Phitsanulok Immigration Office", area: "Phitsanulok", lat: 16.82, lng: 100.26 },
  { name: "Bangkok Immigration Division 1, Chaeng Watthana", area: "Bangkok", lat: 13.88, lng: 100.56 },
  { name: "Chonburi Immigration Office, Jomtien", area: "Pattaya / Chonburi", lat: 12.89, lng: 100.87 },
  { name: "Hua Hin Immigration Office", area: "Hua Hin", lat: 12.57, lng: 99.96 },
  { name: "Nakhon Ratchasima Immigration Office", area: "Korat", lat: 14.97, lng: 102.1 },
  { name: "Khon Kaen Immigration Office", area: "Khon Kaen", lat: 16.43, lng: 102.83 },
  { name: "Udon Thani Immigration Office", area: "Udon Thani", lat: 17.41, lng: 102.79 },
  { name: "Nong Khai Immigration Office", area: "Nong Khai", lat: 17.88, lng: 102.74 },
  { name: "Ubon Ratchathani Immigration Office", area: "Ubon Ratchathani", lat: 15.24, lng: 104.85 },
  { name: "Surat Thani Immigration Office", area: "Surat Thani", lat: 9.14, lng: 99.33 },
  { name: "Koh Samui Immigration Office", area: "Koh Samui", lat: 9.53, lng: 100.06 },
  { name: "Phuket Immigration Office", area: "Phuket", lat: 7.88, lng: 98.39 },
  { name: "Krabi Immigration Office", area: "Krabi", lat: 8.09, lng: 98.91 },
  { name: "Songkhla Immigration Office", area: "Songkhla / Hat Yai", lat: 7.19, lng: 100.59 },
];

// Straight-line distance in km between two points on Earth (the haversine formula).
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// The closest offices to a point, nearest first, with their distance.
export function nearestOffices(point: { lat: number; lng: number }, count = 3) {
  return offices
    .map((office) => ({ office, km: Math.round(distanceKm(point, office)) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
}

// Opens Google Maps with directions to the office. Only the office's name goes in the link,
// never the user's location: Google Maps uses the phone's own location for the start.
export function directionsUrl(office: Office): string {
  const params = new URLSearchParams({ api: "1", destination: `${office.name}, Thailand` });
  return `https://www.google.com/maps/dir/?${params}`;
}
