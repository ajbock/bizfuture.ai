// lib/brokers/getBrokers.ts
import { createClient } from "@/lib/supabase-server";
import type { BrokerFilters } from "@/components/brokers/BrokerFilterBar";

export async function getBrokers(filters: BrokerFilters) {
  const supabase = await createClient();
  let query = supabase.from("brokers").select("*").eq("status", "approved");

  if (filters.county) {
    query = query.contains("areas_served", [filters.county]);
  }
  if (filters.language) {
    query = query.contains("languages", [filters.language]);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}