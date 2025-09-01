"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Target, Trophy, ChevronDown, X, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/lib/supabase/profile"

interface ValorantDashboardProps {
  isOpen?: boolean
  onClose?: () => void
}

const VALORANT_AGENTS = [
  { id: "jett", name: "Jett", role: "Duelist", color: "from-blue-400 to-cyan-400" },
  { id: "phoenix", name: "Phoenix", role: "Duelist", color: "from-orange-400 to-red-500" },
  { id: "sage", name: "Sage", role: "Sentinel", color: "from-green-400 to-emerald-500" },
  { id: "sova", name: "Sova", role: "Initiator", color: "from-blue-500 to-indigo-600" },
  { id: "brimstone", name: "Brimstone", role: "Controller", color: "from-orange-500 to-amber-600" },
  { id: "viper", name: "Viper", role: "Controller", color: "from-green-500 to-lime-600" },
  { id: "cypher", name: "Cypher", role: "Sentinel", color: "from-gray-400 to-slate-500" },
  { id: "reyna", name: "Reyna", role: "Duelist", color: "from-purple-400 to-pink-500" },
  { id: "killjoy", name: "Killjoy", role: "Sentinel", color: "from-yellow-400 to-orange-500" },
  { id: "breach", name: "Breach", role: "Initiator", color: "from-orange-600 to-red-600" },
  { id: "omen", name: "Omen", role: "Controller", color: "from-purple-600 to-indigo-700" },
  { id: "raze", name: "Raze", role: "Duelist", color: "from-red-400 to-pink-500" },
]

const VALORANT_RANKS = [
  { id: "iron", name: "Iron", tier: 1, color: "from-gray-600 to-gray-700" },
  { id: "bronze", name: "Bronze", tier: 2, color: "from-amber-600 to-orange-700" },
  { id: "silver", name: "Silver", tier: 3, color: "from-gray-300 to-gray-400" },
  { id: "gold", name: "Gold", tier: 4, color: "from-yellow-400 to-yellow-600" },
  { id: "platinum", name: "Platinum", tier: 5, color: "from-cyan-400 to-blue-500" },
  { id: "diamond", name: "Diamond", tier: 6, color: "from-purple-400 to-indigo-500" },
  { id: "ascendant", name: "Ascendant", tier: 7, color: "from-green-400 to-emerald-500" },
  { id: "immortal", name: "Immortal", tier: 8, color: "from-red-500 to-pink-600" },
  { id: "radiant", name: "Radiant", tier: 9, color: "from-yellow-300 to-orange-400" },
]

export function ValorantDashboard({ isOpen = true, onClose }: ValorantDashboardProps) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [playerName, setPlayerName] = useState("Agent")
  const [selectedAgent, setSelectedAgent] = useState(VALORANT_AGENTS[0])
  const [selectedRank, setSelectedRank] = useState(VALORANT_RANKS[3])
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const [showRankDropdown, setShowRankDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, task: "Deathmatch 1 Games", completed: false, progress: 0, target: 1 },
    { id: 2, task: "Win 1 Competitive Matches", completed: false, progress: 0, target: 1 },
    { id: 3, task: "Practice Aim Training 10min", completed: false, progress: 0, target: 10 },
    { id: 4, task: "Review 1 Pro Match", completed: false, progress: 0, target: 1 },
  ])

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      setIsLoading(true)
      const userProfile = await getUserProfile()

      if (userProfile) {
        setProfile(userProfile)
        setPlayerName(userProfile.display_name || "Agent")

        if (userProfile.valorant_agent) {
          const agent = VALORANT_AGENTS.find((a) => a.id === userProfile.valorant_agent)
          if (agent) setSelectedAgent(agent)
        }

        if (userProfile.valorant_rank) {
          const rank = VALORANT_RANKS.find((r) => r.id === userProfile.valorant_rank)
          if (rank) setSelectedRank(rank)
        }
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [user])

  const saveProfile = async () => {
    if (!user) return

    const updates = {
      display_name: playerName,
      valorant_agent: selectedAgent.id,
      valorant_rank: selectedRank.id,
    }

    const updatedProfile = await updateUserProfile(updates)
    if (updatedProfile) {
      setProfile(updatedProfile)
      console.log("[v0] Profile saved successfully")
    }
  }

  useEffect(() => {
    if (!isLoading && profile && playerName !== profile.display_name) {
      const timeoutId = setTimeout(() => {
        saveProfile()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [playerName, isLoading, profile])

  useEffect(() => {
    if (!isLoading && profile) {
      saveProfile()
    }
  }, [selectedAgent, selectedRank, isLoading, profile])

  const toggleGoalCompletion = (goalId: number) => {
    setDailyGoals((goals) =>
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, completed: !goal.completed, progress: !goal.completed ? goal.target : 0 }
          : goal,
      ),
    )
  }

  const containerContent = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/60 z-0"></div>
      <div className="absolute inset-0 rounded-xl border border-white/15 shadow-[0_0_15px_rgba(120,60,220,0.2)] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src="/images/robot-head.webp"
              alt="AI Assistant"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              />
            </div>
            <div>
              <h2 className="text-white font-medium">Profile</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src="/images/robot-head.webp"
              alt="AI Assistant"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl font-medium text-white mb-2">
              Good evening{playerName && playerName !== "Agent" ? `, ${playerName}` : ""}
            </h1>
            <p className="text-white/60 max-w-md mx-auto mb-8">How can I help you today?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
  {/* Kartu 1 */}
  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl cursor-pointer border border-white/5">
    <div className="flex flex-col items-center text-center"> {/* Perubahan utama di sini */}
      <User className="w-5 h-5 text-blue-400 mb-2" /> {/* Tambahkan mb-2 lagi */}
      <h3 className="text-white text-sm font-medium mb-1">Profile</h3>
      <p className="text-white/60 text-xs">Set up your agent and rank preferences</p>
    </div>
  </div>

  {/* Kartu 2 */}
  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl cursor-pointer border border-white/5">
    <div className="flex flex-col items-center text-center"> {/* Perubahan utama di sini */}
      <Target className="w-5 h-5 text-purple-400 mb-2" /> {/* Tambahkan mb-2 lagi */}
      <h3 className="text-white text-sm font-medium mb-1">Goals</h3>
      <p className="text-white/60 text-xs">Track your daily training objectives</p>
    </div>
  </div>

  {/* Kartu 3 */}
  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl cursor-pointer border border-white/5">
    <div className="flex flex-col items-center text-center"> {/* Perubahan utama di sini */}
      <Trophy className="w-5 h-5 text-green-400 mb-2" /> {/* Tambahkan mb-2 lagi */}
      <h3 className="text-white text-sm font-medium mb-1">Progress</h3>
      <p className="text-white/60 text-xs">Monitor your improvement and achievements</p>
    </div>
  </div>
</div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Player Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Player Name</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full bg-white/5 text-white rounded-xl px-3 py-2 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Main Agent</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                        className="w-full bg-white/5 text-white rounded-xl px-4 py-3 outline-none border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br", selectedAgent.color)}></div>
                          <div className="text-left">
                            <div className="font-medium">{selectedAgent.name}</div>
                            <div className="text-xs text-white/60">{selectedAgent.role}</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/50" />
                      </button>
                      <AnimatePresence>
                        {showAgentDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-20"
                          >
                            <div className="backdrop-blur-2xl bg-black/80 border border-white/10 max-h-60 overflow-y-auto rounded-xl">
                              {VALORANT_AGENTS.map((agent) => (
                                <button
                                  key={agent.id}
                                  onClick={() => {
                                    setSelectedAgent(agent)
                                    setShowAgentDropdown(false)
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3"
                                >
                                  <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br", agent.color)}></div>
                                  <div>
                                    <div className="font-medium text-white">{agent.name}</div>
                                    <div className="text-xs text-white/60">{agent.role}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Current Rank</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowRankDropdown(!showRankDropdown)}
                        className="w-full bg-white/5 text-white rounded-xl px-4 py-3 outline-none border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br", selectedRank.color)}></div>
                          <div className="text-left">
                            <div className="font-medium">{selectedRank.name}</div>
                            <div className="text-xs text-white/60">Tier {selectedRank.tier}</div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/50" />
                      </button>
                      <AnimatePresence>
                        {showRankDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-20"
                          >
                            <div className="backdrop-blur-2xl bg-black/80 border border-white/10 max-h-60 overflow-y-auto rounded-xl">
                              {VALORANT_RANKS.map((rank) => (
                                <button
                                  key={rank.id}
                                  onClick={() => {
                                    setSelectedRank(rank)
                                    setShowRankDropdown(false)
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3"
                                >
                                  <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br", rank.color)}></div>
                                  <div>
                                    <div className="font-medium text-white">{rank.name}</div>
                                    <div className="text-xs text-white/60">Tier {rank.tier}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Daily Goals</h3>
                <div className="space-y-3">
                  {dailyGoals.map((goal) => (
                    <div key={goal.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                              goal.completed
                                ? "bg-green-500 border-green-500"
                                : "border-white/30 hover:border-white/50",
                            )}
                          >
                            {goal.completed && <CheckCircle className="w-2 h-2 text-white" />}
                          </button>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              goal.completed ? "text-white/70 line-through" : "text-white",
                            )}
                          >
                            {goal.task}
                          </span>
                        </div>
                        <span className="text-xs text-white/60">
                          {goal.progress}/{goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            goal.completed ? "bg-green-500" : "bg-blue-500",
                          )}
                          style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">Today's Progress</span>
                    <span className="text-sm text-white">
                      {dailyGoals.filter((g) => g.completed).length}/{dailyGoals.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                      style={{
                        width: `${(dailyGoals.filter((g) => g.completed).length / dailyGoals.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (isOpen === undefined || isOpen === true) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            {containerContent}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return containerContent
}
