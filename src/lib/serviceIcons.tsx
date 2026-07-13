import type { ReactNode } from "react";

export const SERVICE_ICONS: Record<string, ReactNode> = {
  Electricista: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />,
  Fontanero: <path d="M6 4h6v6H6zM12 10h4a2 2 0 0 1 2 2v8M18 16h4" />,
  Barbero: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.5 13M20 20 8.5 11" />
    </>
  ),
  Cerrajero: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11 20 20M16 20h4v-4" />
    </>
  ),
  Pintor: (
    <>
      <path d="M9 3h6v6l-3 3-3-3z" />
      <path d="M12 12v9M9 21h6" />
    </>
  ),
  Jardinero: (
    <path d="M12 22v-9M12 13c-4 0-6-3-6-7 4 0 6 2 6 4 0-2 2-4 6-4 0 4-2 7-6 7z" />
  ),
  "Electrodomésticos": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h2" />
    </>
  ),
  "Albañilería": <path d="M4 20h16M6 20V10l6-6 6 6v10" />,
};

export const DEFAULT_SERVICE_ICON: ReactNode = (
  <circle cx="12" cy="12" r="9" />
);

export function getServiceIcon(name: string): ReactNode {
  return SERVICE_ICONS[name] ?? DEFAULT_SERVICE_ICON;
}
