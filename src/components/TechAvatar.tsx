import { getInitials } from "@/lib/initials";
import type { TechnicianListItem } from "@/lib/supabase/types";

export default function TechAvatar({
  tech,
  className,
}: {
  tech: TechnicianListItem;
  className: string;
}) {
  if (tech.profiles.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={tech.profiles.avatar_url}
        alt={tech.profiles.full_name}
        className={`${className} avatar-img`}
      />
    );
  }
  return <div className={className}>{getInitials(tech.profiles.full_name)}</div>;
}
