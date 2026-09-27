import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import AdminBrokersClient from "./AdminBrokersClient"

export default async function AdminBrokersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login")
  }

  return <AdminBrokersClient />
}