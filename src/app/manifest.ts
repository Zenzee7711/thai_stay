import type { MetadataRoute } from "next";

// What phones use when the page is added to the Home Screen: name, colours and icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Thai Stay",
    short_name: "Thai Stay",
    description: "Track your 90-day report and visa dates in Thailand.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f1",
    theme_color: "#f6f5f1",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
