"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthFormProps {
  onBack: () => void
  onAuthSuccess: (user: { name: string; email: string }) => void
}

export function AuthForm({ onBack, onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Auth Form: Starting authentication process", {
      isLogin,
      formData: { ...formData, password: "***" },
    })
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      console.log("[v0] Auth Form: Validation failed - missing required fields")
      setIsLoading(false)
      return
    }

    if (!isLogin && !formData.name) {
      console.log("[v0] Auth Form: Validation failed - missing name for registration")
      setIsLoading(false)
      return
    }

    // Simulate API call
    console.log("[v0] Auth Form: Simulating API call...")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful authentication
    const userData = {
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
    }

    console.log("[v0] Auth Form: Authentication successful, calling onAuthSuccess", userData)
    onAuthSuccess(userData)

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    console.log("[v0] Auth Form: Input changed", { field, hasValue: !!value })
  }

  const toggleFormType = () => {
    console.log(
      "[v0] Auth Form: Toggling form type from",
      isLogin ? "login" : "register",
      "to",
      !isLogin ? "login" : "register",
    )
    setIsLogin(!isLogin)
    setFormData({ name: "", email: "", password: "" })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            console.log("[v0] Auth Form: Back button clicked")
            onBack()
          }}
          className="mb-8 flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to menu
        </motion.button>

        {/* Auth form container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative backdrop-blur-3xl bg-black/60 border border-white/15 rounded-3xl p-8 shadow-2xl"
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay rounded-3xl bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center"
              >
                <img
                  src="/images/robot-head-large.png"
                  alt="Robot Head"
                  className="w-10 h-10 object-contain"
                  width={40}
                  height={40}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {isLogin ? "Welcome back" : "Create account"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/60"
              >
                {isLogin ? "Sign in to continue" : "Join us to get started"}
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Toggle form type */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleFormType}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-blue-400 hover:text-blue-300">{isLogin ? "Sign up" : "Sign in"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
