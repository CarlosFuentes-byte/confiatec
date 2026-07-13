"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/supabase/types";

const POLL_INTERVAL_MS = 3000;

export default function ConversationView({
  requestId,
  currentUserId,
  initialMessages,
}: {
  requestId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const poll = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("service_request_id", requestId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data as Message[]);
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSending(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .insert({ service_request_id: requestId, sender_id: currentUserId, body: trimmed })
      .select()
      .single();

    setSending(false);
    setBody("");
    if (data) setMessages((prev) => [...prev, data as Message]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="chat-empty">Todavía no hay mensajes. Escribe el primero.</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`chat-bubble ${mine ? "chat-bubble-mine" : "chat-bubble-theirs"}`}>
              {m.body}
              <span className="chat-bubble-time">
                {new Date(m.created_at).toLocaleTimeString("es-HN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" type="submit" disabled={sending}>
          Enviar
        </button>
      </form>
    </div>
  );
}
