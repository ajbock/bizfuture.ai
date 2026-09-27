import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import AdminPhotosClient from "./AdminPhotosClient"

export default async function AdminPhotosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login")
  }

  return <AdminPhotosClient />
}