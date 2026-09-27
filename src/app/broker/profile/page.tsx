import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import EditBrokerProfile from "./EditBrokerProfile"

export default async function BrokerProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: broker } = await supabase
    .from("brokers")
    .select("*")
    .eq("email", user.email)
    .single()

  if (!broker) redirect("/broker")

  return <EditBrokerProfile broker={broker} />
}