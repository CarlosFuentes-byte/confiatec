import type { SupabaseClient } from "@supabase/supabase-js";

export function fileExtension(file: File) {
  return file.name.split(".").pop() ?? "bin";
}

export async function uploadFile(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  file: File
) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
}

export function getPublicFileUrl(supabase: SupabaseClient, bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
