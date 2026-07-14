import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientRequestsPanel, {
  type ClientRequestWithSnippet,
} from "@/components/dashboard/ClientRequestsPanel";
import TechnicianRequestsPanel, {
  type TechnicianRequestWithSnippet,
} from "@/components/dashboard/TechnicianRequestsPanel";
import type { ClientRequestRow, TechnicianRequestRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mi panel — ConfiaTec",
};

async function lastMessageByRequest(
  supabase: Awaited<ReturnType<typeof createClient>>,
  requestIds: string[]
) {
  if (requestIds.length === 0) return new Map<string, string>();

  const { data } = await supabase
    .from("messages")
    .select("service_request_id, body, created_at")
    .in("service_request_id", requestIds)
    .order("created_at", { ascending: true });

  const map = new Map<string, string>();
  for (const m of data ?? []) {
    map.set(m.service_request_id, m.body);
  }
  return map;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "technician") {
    const { data: technicianProfile } = await supabase
      .from("technician_profiles")
      .select("profile_id, featured, verified")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!technicianProfile) redirect("/tecnicos/unirse");

    const { data: requests } = await supabase
      .from("service_requests")
      .select(
        "*, client:profiles!service_requests_client_id_fkey(full_name), service_categories(name)"
      )
      .eq("technician_id", user.id)
      .order("created_at", { ascending: false });

    const rows = (requests as TechnicianRequestRow[]) ?? [];
    const snippets = await lastMessageByRequest(
      supabase,
      rows.map((r) => r.id)
    );
    const withSnippet: TechnicianRequestWithSnippet[] = rows.map((r) => ({
      ...r,
      snippet: snippets.get(r.id) ?? (r.status === "pending" ? "Sin mensajes todavía" : "Sin mensajes todavía"),
    }));

    return (
      <TechnicianRequestsPanel
        requests={withSnippet}
        profileId={user.id}
        featured={technicianProfile.featured}
        verified={technicianProfile.verified}
      />
    );
  }

  const { data: requests } = await supabase
    .from("service_requests")
    .select(
      "*, technician:profiles!service_requests_technician_id_fkey(full_name), service_categories(name), reviews(id, rating, comment)"
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (requests as ClientRequestRow[]) ?? [];
  const snippets = await lastMessageByRequest(
    supabase,
    rows.map((r) => r.id)
  );
  const withSnippet: ClientRequestWithSnippet[] = rows.map((r) => ({
    ...r,
    snippet: snippets.get(r.id) ?? (r.status === "pending" ? "Sin técnico asignado todavía" : "Sin mensajes todavía"),
  }));

  return <ClientRequestsPanel requests={withSnippet} />;
}
