import { createClient } from "./client"

export interface UserProfile {
  id: string
  email?: string
  display_name?: string
  avatar_url?: string
  valorant_agent?: string
  valorant_rank?: string
  created_at: string
  updated_at: string
}

// Client-side profile operations
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error updating profile:", error)
    return null
  }

  return data
}
