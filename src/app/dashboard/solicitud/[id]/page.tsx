import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationView from "@/components/dashboard/ConversationView";
import type { Message } from "@/lib/supabase/types";

type RequestWithParties = {
  id: string;
  client_id: string;
  technician_id: string | null;
  address_text: string;
  service_categories: { name: string };
  client: { full_name: string };
  technician: { full_name: string } | null;
};

export default async function SolicitudConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: request } = await supabase
    .from("service_requests")
    .select(
      "id, client_id, technician_id, address_text, service_categories(name), client:profiles!service_requests_client_id_fkey(full_name), technician:profiles!service_requests_technician_id_fkey(full_name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!request) notFound();

  const req = request as unknown as RequestWithParties;

  if (req.client_id !== user.id && req.technician_id !== user.id) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("service_request_id", id)
    .order("created_at", { ascending: true });

  const isClient = user.id === req.client_id;
  const otherPartyName = isClient
    ? (req.technician?.full_name ?? "Técnico")
    : req.client.full_name;

  return (
    <section className="auth-page">
      <div className="wrap" style={{ maxWidth: "640px" }}>
        <div className="sec-head" style={{ marginBottom: "20px" }}>
          <span className="eyebrow">{req.service_categories.name}</span>
          <h2>Conversación con {otherPartyName}</h2>
          <p>{req.address_text}</p>
        </div>
        <ConversationView
          requestId={req.id}
          currentUserId={user.id}
          initialMessages={(messages as Message[]) ?? []}
        />
      </div>
    </section>
  );
}
