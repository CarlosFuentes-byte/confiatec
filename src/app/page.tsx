import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import ForTechnicians from "@/components/ForTechnicians";
import Trust from "@/components/Trust";
import { createClient } from "@/lib/supabase/server";
import type { ServiceCategory } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon_slug")
    .order("id");

  return (
    <>
      <Hero categories={(categories as ServiceCategory[]) ?? []} />
      <HowItWorks />
      <Services />
      <ForTechnicians />
      <Trust />
    </>
  );
}
