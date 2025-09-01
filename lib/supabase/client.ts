import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bdicjdyyutsragltmlai.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkaWNqZHl5dXRzcmFnbHRtbGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDQ1MTcsImV4cCI6MjA3MjI4MDUxN30.rkrsNzW3rZ9A8J_VVYDG31B__Q27jL1X_EOt7G38anA"

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
