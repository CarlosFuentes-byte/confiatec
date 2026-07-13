import type { SupabaseClient } from "@supabase/supabase-js";

export const OTHER_CATEGORY_VALUE = "otro";

export async function resolveCategoryId(
  supabase: SupabaseClient,
  categoryId: number | string,
  customName: string
): Promise<number> {
  if (categoryId !== OTHER_CATEGORY_VALUE) {
    return Number(categoryId);
  }

  const trimmed = customName.trim();

  const { data: existing } = await supabase
    .from("service_categories")
    .select("id")
    .ilike("name", trimmed)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("service_categories")
    .insert({ name: trimmed, icon_slug: "generico" })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}
