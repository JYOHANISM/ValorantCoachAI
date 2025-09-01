"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Shield, LogIn, LogOut, User, Lock } from "lucide-react"
import { UnifiedInterface } from "./unified-interface"
import { ValorantDashboard } from "./valorant-dashboard"
import { ProtectedRoute } from "./protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getUserProfile, type UserProfile } from "@/lib/supabase/profile"

export function MainMenu() {
  const [activeView, setActiveView] = useState<"menu" | "chat" | "coach">("menu")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated || !user) return

      const userProfile = await getUserProfile()
      if (userProfile) {
        setProfile(userProfile)
      }
    }

    loadProfile()
  }, [isAuthenticated, user])

  const handleLogout = async () => {
    console.log("[v0] Main Menu: Logout initiated")
    await logout()
    setActiveView("menu")
  }

  const handleMenuItemClick = (itemId: string, requireAuth: boolean) => {
    console.log("[v0] Main Menu: Menu item clicked", { itemId, requireAuth, isAuthenticated })
    if (requireAuth && !isAuthenticated) {
      console.log("[v0] Main Menu: Authentication required, redirecting to auth")
      // Redirect to login page instead of showing auth form
      window.location.href = "/auth/login"
      return
    }
    console.log("[v0] Main Menu: Access granted, switching to", itemId)
    setActiveView(itemId as "chat" | "coach")
  }

  const menuItems = [
    {
      id: "chat",
      title: "Chat Secret Agent",
      description: "Get detailed answers to your questions and have conversations with AI",
      icon: MessageCircle,
      gradient: "from-blue-500/20 to-purple-500/20",
      hoverGradient: "hover:from-blue-500/30 hover:to-purple-500/30",
      requireAuth: false, // Chat is available to everyone
    },
    {
      id: "coach",
      title: "Profile Settings",
      description: "Get personalized Valorant coaching and improve your gameplay",
      icon: Shield,
      gradient: "from-red-500/20 to-orange-500/20",
      hoverGradient: "hover:from-red-500/30 hover:to-orange-500/30",
      requireAuth: true, // Coach requires authentication
    },
  ]

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  if (activeView === "chat") {
    return <UnifiedInterface initiallyOpen={true} onBack={() => setActiveView("menu")} />
  }

  if (activeView === "coach") {
    return (
      <ProtectedRoute requireAuth={true} onAuthRequired={() => (window.location.href = "/auth/login")}>
        <div className="relative min-h-screen overflow-hidden">
          <ValorantDashboard onClose={() => setActiveView("menu")} />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6 flex items-center gap-4"
        >
          <div className="flex items-center gap-2 text-white/80">
            <User className="w-4 h-4" />
            <span className="text-sm">Welcome, {user?.user_metadata?.display_name || user?.email}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white/80 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden"
          >
            <Image
              src="/images/robot-head.webp"
              alt="AI Assistant"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance"
          >
            {isAuthenticated
              ? `Good Evening${profile?.display_name ? `, ${profile.display_name}` : ""}`
              : "Good Evening"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/70 text-balance"
          >
            How can I help you today?
          </motion.p>
        </div>

        {/* Menu Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuItemClick(item.id, item.requireAuth)}
              className={`
                group relative p-8 rounded-2xl backdrop-blur-2xl border border-white/10
                bg-gradient-to-br ${item.gradient} ${item.hoverGradient}
                transition-all duration-300 text-left w-full
                shadow-lg hover:shadow-xl hover:border-white/20
                ${item.requireAuth && !isAuthenticated ? "opacity-90" : ""}
              `}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay rounded-2xl bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]}" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/15 transition-colors">
                    <item.icon className="w-6 h-6 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        {item.title}
                      </h3>
                      {item.requireAuth && !isAuthenticated && <Lock className="w-4 h-4 text-white/40" />}
                    </div>
                  </div>
                </div>

                <p className="text-white/60 group-hover:text-white/70 transition-colors leading-relaxed">
                  {item.description}
                  {item.requireAuth && !isAuthenticated && (
                    <span className="block text-white/40 text-sm mt-2">Sign in required</span>
                  )}
                </p>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </motion.div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-8"
          >
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-blue-600/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-500/90 border border-blue-400/30 hover:border-blue-300/50 text-white font-semibold backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 px-8 py-3">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in / Register
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12"
        >
          <p className="text-white/40 text-sm">Choose an option above to get started</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
