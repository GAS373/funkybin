import type { MetadataRoute } from "next";
import { GAME_NAME, SEO_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${GAME_NAME} | funkybin.dev`,
    short_name: GAME_NAME,
    description: SEO_DESCRIPTION,
    start_url: SITE_URL,
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}