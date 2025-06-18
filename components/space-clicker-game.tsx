"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  SpaceIcon as Planet,
  Orbit,
  Satellite,
  Telescope,
  Star,
  Sparkles,
  Atom,
  Zap,
  Globe,
} from "lucide-react"
import { formatNumber } from "@/utils/format-number"
import { ResponsiveGameLayout } from "./responsive-game-layout"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

const UPGRADES = [
  {
    id: "exploration",
    name: "Space Exploration",
    description: "Improve your ability to explore the cosmos",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Rocket className="h-4 w-4 mr-1" />,
  },
  {
    id: "space_station",
    name: "Space Station",
    description: "Build stations that generate cosmic energy automatically",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Satellite className="h-4 w-4 mr-1" />,
  },
  {
    id: "telescope",
    name: "Advanced Telescope",
    description: "Discover more celestial bodies in the universe",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Telescope className="h-4 w-4 mr-1" />,
  },
  {
    id: "colonization",
    name: "Planet Colonization",
    description: "Establish colonies on distant planets",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Planet className="h-4 w-4 mr-1" />,
  },
]

const ADVANCED_UPGRADES = [
  {
    id: "wormhole",
    name: "Wormhole Technology",
    description: "Develop technology to travel through wormholes",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2,
    maxLevel: 10,
    icon: <Orbit className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "exploration", level: 10 },
  },
  {
    id: "dyson_sphere",
    name: "Dyson Sphere",
    description: "Harness the energy of stars with massive structures",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3,
    maxLevel: 5,
    icon: <Star className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "space_station", level: 15 },
  },
  {
    id: "quantum_telescope",
    name: "Quantum Telescope",
    description: "See beyond the observable universe",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4,
    maxLevel: 3,
    icon: <Sparkles className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "telescope", level: 15 },
  },
  {
    id: "terraforming",
    name: "Terraforming Technology",
    description: "Transform hostile planets into habitable worlds",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5,
    maxLevel: 3,
    icon: <Globe className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "colonization", level: 10 },
  },
  {
    id: "intergalactic_empire",
    name: "Intergalactic Empire",
    description: "Expand your civilization across multiple galaxies",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0,
    maxLevel: 1,
    icon: <Atom className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "colonization", level: 15 },
  },
]

const SPACE_MESSAGES = [
  "🚀 New discovery!",
  "🌌 Galaxy explored!",
  "🪐 Planet colonized!",
  "⭐ Star charted!",
  "🌠 Cosmic energy!",
  "🛰️ Station deployed!",
  "🔭 New observation!",
  "👽 Contact made!",
]

const SPACE_RANKS = [
  { name: "Space Explorer", threshold: 0, icon: "🚀" },
  { name: "System Pioneer", threshold: 100, icon: "🌠" },
  { name: "Galaxy Navigator", threshold: 500, icon: "🌌" },
  { name: "Cosmic Voyager", threshold: 2000, icon: "🪐" },
  { name: "Stellar Warden", threshold: 10000, icon: "⭐" },
  { name: "Nebula Master", threshold: 50000, icon: "☄️" },
  { name: "Interstellar Conqueror", threshold: 200000, icon: "👽" },
  { name: "Universal Emperor", threshold: 1000000, icon: "👑" },
]

export default function SpaceClickerGame() {
  const { isMobile } = useMobileOptimization({})

  // Game state
  const [stats, setStats] = useState({
    mainStat: 0,
    clickPower: 1,
    autoGeneration: 0,
    multiplier1: 1,
    multiplier2: 1,
    upgrades: {},
    streak: 0,
    achievements: [],
  })

  const [clickEffects, setClickEffects] = useState([])
  const [nextClickEffectId, setNextClickEffectId] = useState(0)
  const [activeTab, setActiveTab] = useState("stats")

  // Load saved game
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem("space-clicker-progress")
      if (savedGame) {
        setStats(JSON.parse(savedGame))
      }
    } catch (error) {
      console.error("Failed to load game:", error)
    }
  }, [])

  // Save game
  useEffect(() => {
    try {
      localStorage.setItem("space-clicker-progress", JSON.stringify(stats))
    } catch (error) {
      console.error("Failed to save game:", error)
    }
  }, [stats])

  // Auto-generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (stats.autoGeneration > 0) {
        setStats((prev) => ({
          ...prev,
          mainStat: prev.mainStat + prev.autoGeneration,
        }))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [stats.autoGeneration])

  // Click handler
  const handleClick = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Add click effect
      const randomMessage = SPACE_MESSAGES[Math.floor(Math.random() * SPACE_MESSAGES.length)]
      setClickEffects((prev) => [
        ...prev,
        {
          id: nextClickEffectId,
          x,
          y,
          text: randomMessage,
        },
      ])
      setNextClickEffectId((prev) => prev + 1)

      // Remove click effect after animation
      setTimeout(() => {
        setClickEffects((prev) => prev.filter((effect) => effect.id !== nextClickEffectId - 1))
      }, 1000)

      // Update stats
      setStats((prev) => ({
        ...prev,
        mainStat: prev.mainStat + prev.clickPower * prev.multiplier1 * prev.multiplier2,
      }))
    },
    [nextClickEffectId, stats.clickPower, stats.multiplier1, stats.multiplier2],
  )

  // Calculate upgrade price
  const calculateUpgradePrice = useCallback(
    (upgrade) => {
      const level = stats.upgrades[upgrade.id] || 0
      return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, level))
    },
    [stats.upgrades],
  )

  // Purchase upgrade
  const purchaseUpgrade = useCallback(
    (upgrade) => {
      const price = calculateUpgradePrice(upgrade)
      if (stats.mainStat >= price) {
        const currentLevel = stats.upgrades[upgrade.id] || 0
        if (currentLevel < upgrade.maxLevel) {
          setStats((prev) => {
            const newStats = { ...prev }
            newStats.mainStat -= price
            newStats.upgrades = { ...prev.upgrades, [upgrade.id]: currentLevel + 1 }

            // Apply upgrade effects
            if (upgrade.id === "exploration") {
              newStats.clickPower += upgrade.effect
            } else if (upgrade.id === "space_station") {
              newStats.autoGeneration += upgrade.effect
            } else if (upgrade.id === "telescope") {
              newStats.multiplier1 += upgrade.effect / 10
            } else if (upgrade.id === "colonization") {
              newStats.multiplier2 += upgrade.effect / 10
            }

            // Advanced upgrades
            if (upgrade.id === "wormhole") {
              newStats.clickPower *= 1 + upgrade.effect
            } else if (upgrade.id === "dyson_sphere") {
              newStats.autoGeneration *= 1 + upgrade.effect
            } else if (upgrade.id === "quantum_telescope") {
              newStats.multiplier1 *= 1 + upgrade.effect
            } else if (upgrade.id === "terraforming") {
              newStats.multiplier2 *= 1 + upgrade.effect
            } else if (upgrade.id === "intergalactic_empire") {
              newStats.clickPower *= 2
              newStats.autoGeneration *= 2
              newStats.multiplier1 *= 2
              newStats.multiplier2 *= 2
            }

            return newStats
          })
        }
      }
    },
    [calculateUpgradePrice, stats.mainStat],
  )

  // Get current rank
  const getCurrentRank = useCallback(() => {
    let currentRank = SPACE_RANKS[0]
    for (let i = SPACE_RANKS.length - 1; i >= 0; i--) {
      if (stats.mainStat >= SPACE_RANKS[i].threshold) {
        currentRank = SPACE_RANKS[i]
        break
      }
    }
    return currentRank
  }, [stats.mainStat])

  // Get next rank
  const getNextRank = useCallback(() => {
    for (let i = 0; i < SPACE_RANKS.length; i++) {
      if (stats.mainStat < SPACE_RANKS[i].threshold) {
        return SPACE_RANKS[i]
      }
    }
    return null
  }, [stats.mainStat])

  const currentRank = getCurrentRank()
  const nextRank = getNextRank()

  // Calculate progress to next rank
  const calculateProgress = useCallback(() => {
    if (!nextRank) return 100
    const prevThreshold = SPACE_RANKS[SPACE_RANKS.indexOf(nextRank) - 1]?.threshold || 0
    const progress = ((stats.mainStat - prevThreshold) / (nextRank.threshold - prevThreshold)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }, [nextRank, stats.mainStat])

  // Check if upgrade is unlocked
  const isUpgradeUnlocked = useCallback(
    (upgrade) => {
      if (!upgrade.unlockRequirement) return true
      const { id, level } = upgrade.unlockRequirement
      return (stats.upgrades[id] || 0) >= level
    },
    [stats.upgrades],
  )

  return (
    <ResponsiveGameLayout backgroundClass="space-bg">
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Space Explorer</CardTitle>
            <CardDescription className="text-gray-200">
              Explore the cosmos and build your galactic empire!
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stats Display */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Zap className="h-6 w-6 mr-2 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Energy</div>
                  <div className="text-xl font-bold text-purple-300">{formatNumber(stats.mainStat)}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div>
                  <div className="text-sm text-gray-500">Power</div>
                  <div className="text-xl font-bold text-purple-300">
                    {formatNumber(stats.clickPower * stats.multiplier1 * stats.multiplier2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Rank Display */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{currentRank.icon}</span>
                  <span className="font-bold text-purple-300">{currentRank.name}</span>
                </div>
                {nextRank && (
                  <div className="text-sm text-gray-500">
                    Next: {nextRank.icon} {nextRank.name} ({formatNumber(nextRank.threshold)})
                  </div>
                )}
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Custom Collection Section */}
            <div className="galaxy-grid mb-4 grid grid-cols-4 gap-2">
              {["🌎", "🌙", "🔴", "🪐", "☀️", "✨", "🌌", "🕳️"].map((body, i) => (
                <div key={i} className="celestial-item bg-gray-800/30 rounded-md p-2 text-center">
                  <div className="celestial-emoji text-2xl">{body}</div>
                  <div className="celestial-count text-xs text-gray-300">{i + 1}</div>
                </div>
              ))}
            </div>

            {/* Main Click Button */}
            <div className="relative mb-6">
              <Button
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-lg shadow-lg transition-all hover:shadow-xl active:scale-95"
                onClick={handleClick}
              >
                <Rocket className="h-8 w-8 mr-4" />
                EXPLORE SPACE
              </Button>

              {/* Click Effects */}
              {clickEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="absolute pointer-events-none animate-float text-lg font-bold"
                  style={{
                    left: `${effect.x}px`,
                    top: `${effect.y}px`,
                    animation: "float 1s ease-out forwards",
                  }}
                >
                  {effect.text}
                </div>
              ))}
            </div>

            {/* Auto-generation Display */}
            {stats.autoGeneration > 0 && (
              <div className="text-center mb-4 text-sm text-gray-500">
                Auto-generating {formatNumber(stats.autoGeneration * stats.multiplier1 * stats.multiplier2)} Energy per
                second
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="stats" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Click Power</div>
                    <div className="text-lg font-bold text-purple-300">{formatNumber(stats.clickPower)}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Auto-Gen</div>
                    <div className="text-lg font-bold text-purple-300">{formatNumber(stats.autoGeneration)}/s</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Multiplier 1</div>
                    <div className="text-lg font-bold text-purple-300">x{stats.multiplier1.toFixed(1)}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Multiplier 2</div>
                    <div className="text-lg font-bold text-purple-300">x{stats.multiplier2.toFixed(1)}</div>
                  </div>
                </div>
              </TabsContent>

              {/* Upgrades Tab */}
              <TabsContent value="upgrades" className="space-y-3">
                {UPGRADES.map((upgrade) => {
                  const level = stats.upgrades[upgrade.id] || 0
                  const price = calculateUpgradePrice(upgrade)
                  const canAfford = stats.mainStat >= price
                  const maxedOut = level >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          {upgrade.icon}
                          <span className="font-medium">{upgrade.name}</span>
                          <Badge variant="outline" className="ml-2">
                            Lvl {level}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">{upgrade.description}</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
                        disabled={!canAfford || maxedOut}
                        onClick={() => purchaseUpgrade(upgrade)}
                      >
                        {maxedOut ? "MAX" : formatNumber(price)}
                      </Button>
                    </div>
                  )
                })}
              </TabsContent>

              {/* Advanced Upgrades Tab */}
              <TabsContent value="advanced" className="space-y-3">
                {ADVANCED_UPGRADES.map((upgrade) => {
                  const level = stats.upgrades[upgrade.id] || 0
                  const price = calculateUpgradePrice(upgrade)
                  const canAfford = stats.mainStat >= price
                  const maxedOut = level >= upgrade.maxLevel
                  const unlocked = isUpgradeUnlocked(upgrade)

                  if (!unlocked) {
                    return (
                      <div key={upgrade.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg opacity-70">
                        <div className="flex items-center">
                          <span className="font-medium">??? Locked ???</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Requires {upgrade.unlockRequirement?.id.replace(/_/g, " ")} level{" "}
                          {upgrade.unlockRequirement?.level}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={upgrade.id}
                      className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          {upgrade.icon}
                          <span className="font-medium">{upgrade.name}</span>
                          <Badge variant="outline" className="ml-2">
                            Lvl {level}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">{upgrade.description}</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
                        disabled={!canAfford || maxedOut}
                        onClick={() => purchaseUpgrade(upgrade)}
                      >
                        {maxedOut ? "MAX" : formatNumber(price)}
                      </Button>
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-50px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </ResponsiveGameLayout>
  )
}
