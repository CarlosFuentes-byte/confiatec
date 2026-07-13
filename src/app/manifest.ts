import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConfiaTec — Tu técnico verificado",
    short_name: "ConfiaTec",
    description:
      "Encuentra técnicos verificados de oficios en San Pedro Sula y Tegucigalpa.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1E27",
    theme_color: "#0B1E27",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
