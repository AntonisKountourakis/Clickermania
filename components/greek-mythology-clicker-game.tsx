"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Bolt, Zap } from "lucide-react"
import { ClickEffectManager, formatNumber } from "@/utils/click-effect-manager"

// Game state interface
interface GameState {
  ambrosia: number
  clickPower: number
  totalAmbrosia: number
  autoClickPower: number
  upgrades: Record<string, number>
  achievements: Record<string, boolean>
  lastUpdate: number
}

// Upgrade interface
interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  icon: JSX.Element
}

// Achievements
interface Achievement {
  id: string
  name: string
  description: string
  requirement: number
  icon: JSX.Element
}

export default function GreekMythologyClickerGame() {
  const [gameState, setGameState] = useState<GameState>({
    ambrosia: 0,
    clickPower: 1,
    totalAmbrosia: 0,
    autoClickPower: 0,
    upgrades: {},
    achievements: {},
    lastUpdate: Date.now(),
  })

  const [effects, setEffects] = useState<Array<{ id: number; x: number; y: number; value: string }>>([])
  const [showOfflineProgress, setShowOfflineProgress] = useState(false)
  const [offlineEarnings, setOfflineEarnings] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const clickEffectManagerRef = useRef<ClickEffectManager | null>(null)
  const effectIdRef = useRef(0)
  const gamePrefix = "greek-mythology-clicker"

  // Define upgrades
  const UPGRADES: Upgrade[] = [
    {
      id: "zeus_blessing",
      name: "Zeus's Blessing",
      description: "The king of gods improves your click power",
      baseCost: 10,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 50,
      icon: <Zap className="h-4 w-4 mr-1" />,
    },
    {
      id: "poseidon_trident",
      name: "Poseidon's Trident",
      description: "The sea god adds waves of ambrosia",
      baseCost: 50,
      priceMultiplier: 1.7,
      effect: 2,
      maxLevel: 30,
      icon: <Bolt className="h-4 w-4 mr-1" />,
    },
    {
      id: "dionysus_wine",
      name: "Dionysus' Wine",
      description: "Auto-generates ambrosia over time",
      baseCost: 100,
      priceMultiplier: 1.8,
      effect: 0.5,
      maxLevel: 20,
      icon: <Zap className="h-4 w-4 mr-1" />,
    },
    {
      id: "athena_wisdom",
      name: "Athena's Wisdom",
      description: "Increases all production by 10%",
      baseCost: 250,
      priceMultiplier: 2.0,
      effect: 0.1,
      maxLevel: 10,
      icon: <Zap className="h-4 w-4 mr-1" />,
    },
  ]

  // Define achievements
  const ACHIEVEMENTS: Achievement[] = [
    {
      id: "first_click",
      name: "Divine Touch",
      description: "Click for the first time",
      requirement: 1,
      icon: <Trophy className="h-4 w-4 mr-1" />,
    },
    {
      id: "hundred_ambrosia",
      name: "Olympian Novice",
      description: "Collect 100 ambrosia",
      requirement: 100,
      icon: <Trophy className="h-4 w-4 mr-1" />,
    },
    {
      id: "thousand_ambrosia",
      name: "Demigod Status",
      description: "Collect 1,000 ambrosia",
      requirement: 1000,
      icon: <Trophy className="h-4 w-4 mr-1" />,
    },
    {
      id: "first_upgrade",
      name: "Divine Favor",
      description: "Purchase your first upgrade",
      requirement: 1,
      icon: <Trophy className="h-4 w-4 mr-1" />,
    },
    {
      id: "all_upgrades",
      name: "Pantheon Master",
      description: "Own at least one of each upgrade",
      requirement: UPGRADES.length,
      icon: <Trophy className="h-4 w-4 mr-1" />,
    },
  ]

  // Initialize click effect manager
  useEffect(() => {
    if (containerRef.current) {
      clickEffectManagerRef.current = new ClickEffectManager(containerRef.current, {
        particleCount: 10,
        particleImages: ["✨", "⚡", "🏛️"],
        gravity: 0.1,
        particleLifetime: 1000,
        spread: 80,
        initialVelocity: { min: 5, max: 15 },
      })
    }

    return () => {
      if (clickEffectManagerRef.current) {
        clickEffectManagerRef.current.cleanup()
      }
    }
  }, [])

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem(`${gamePrefix}-progress`)
    if (savedGame) {
      try {
        const savedState = JSON.parse(savedGame) as GameState

        // Calculate offline progress
        const now = Date.now()
        const timeDiff = now - savedState.lastUpdate
        if (timeDiff > 5000 && savedState.autoClickPower > 0) {
          const seconds = Math.floor(timeDiff / 1000)
          const earnings = savedState.autoClickPower * seconds

          setOfflineEarnings(earnings)
          setShowOfflineProgress(true)

          savedState.ambrosia += earnings
          savedState.totalAmbrosia += earnings
        }

        savedState.lastUpdate = now
        setGameState(savedState)
      } catch (error) {
        console.error("Error loading saved game:", error)
      }
    }
  }, [])

  // Save game
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(
        `${gamePrefix}-progress`,
        JSON.stringify({
          ...gameState,
          lastUpdate: Date.now(),
        }),
      )
    }, 10000)

    return () => clearInterval(saveInterval)
  }, [gameState])

  // Auto clicker
  useEffect(() => {
    if (gameState.autoClickPower > 0) {
      const interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          ambrosia: prev.ambrosia + prev.autoClickPower,
          totalAmbrosia: prev.totalAmbrosia + prev.autoClickPower,
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [gameState.autoClickPower])

  // Handle click
  const handleClick = useCallback(() => {
    if (containerRef.current && clickEffectManagerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.random() * rect.width
      const y = Math.random() * (rect.height / 2) + rect.height / 4

      clickEffectManagerRef.current.createParticles(x, y)
    }

    setGameState((prev) => {
      const newAmbrosia = prev.ambrosia + prev.clickPower
      const newTotalAmbrosia = prev.totalAmbrosia + prev.clickPower

      // Check for achievements
      const newAchievements = { ...prev.achievements }
      let achievementUnlocked = false

      // First click achievement
      if (!prev.achievements.first_click) {
        newAchievements.first_click = true
        achievementUnlocked = true
      }

      // Ambrosia amount achievements
      if (newTotalAmbrosia >= 100 && !prev.achievements.hundred_ambrosia) {
        newAchievements.hundred_ambrosia = true
        achievementUnlocked = true
      }

      if (newTotalAmbrosia >= 1000 && !prev.achievements.thousand_ambrosia) {
        newAchievements.thousand_ambrosia = true
        achievementUnlocked = true
      }

      return {
        ...prev,
        ambrosia: newAmbrosia,
        totalAmbrosia: newTotalAmbrosia,
        achievements: newAchievements,
      }
    })
  }, [])

  // Buy upgrade
  const buyUpgrade = useCallback(
    (upgradeId: string) => {
      const upgrade = UPGRADES.find((u) => u.id === upgradeId)
      if (!upgrade) return

      setGameState((prev) => {
        const currentLevel = prev.upgrades[upgradeId] || 0
        if (currentLevel >= upgrade.maxLevel) return prev

        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.priceMultiplier, currentLevel))
        if (prev.ambrosia < cost) return prev

        const newUpgrades = {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1,
        }

        // Check for upgrade achievements
        const newAchievements = { ...prev.achievements }
        let achievementUnlocked = false

        // First upgrade achievement
        if (!prev.achievements.first_upgrade && Object.keys(newUpgrades).length > 0) {
          newAchievements.first_upgrade = true
          achievementUnlocked = true
        }

        // All upgrades achievement
        const uniqueUpgrades = Object.keys(newUpgrades).length
        if (uniqueUpgrades >= UPGRADES.length && !prev.achievements.all_upgrades) {
          newAchievements.all_upgrades = true
          achievementUnlocked = true
        }

        // Update stats based on the upgrade
        let newClickPower = prev.clickPower
        let newAutoClickPower = prev.autoClickPower

        if (upgradeId === "zeus_blessing") {
          newClickPower += upgrade.effect
        } else if (upgradeId === "poseidon_trident") {
          newClickPower += upgrade.effect
        } else if (upgradeId === "dionysus_wine") {
          newAutoClickPower += upgrade.effect
        } else if (upgradeId === "athena_wisdom") {
          // Global multiplier
          newClickPower *= 1 + upgrade.effect
          newAutoClickPower *= 1 + upgrade.effect
        }

        return {
          ...prev,
          ambrosia: prev.ambrosia - cost,
          clickPower: newClickPower,
          autoClickPower: newAutoClickPower,
          upgrades: newUpgrades,
          achievements: newAchievements,
        }
      })
    },
    [UPGRADES],
  )

  // Reset game
  const resetGame = useCallback(() => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setGameState({
        ambrosia: 0,
        clickPower: 1,
        totalAmbrosia: 0,
        autoClickPower: 0,
        upgrades: {},
        achievements: {},
        lastUpdate: Date.now(),
      })
      localStorage.removeItem(`${gamePrefix}-progress`)
    }
  }, [])

  // Collect offline earnings
  const collectOfflineEarnings = useCallback(() => {
    setShowOfflineProgress(false)
  }, [])

  return (
    <div className="greek-mythology-container min-h-screen p-4" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Greek Mythology Clicker</h1>
          <p className="text-lg text-amber-300">Collect ambrosia to gain the favor of the Olympian gods</p>
        </div>

        {/* Offline progress modal */}
        {showOfflineProgress && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-amber-50 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-2 text-amber-800">Welcome Back!</h3>
              <p className="mb-4 text-amber-700">While you were away, your divine powers collected:</p>
              <p className="text-2xl font-bold mb-6 text-center text-amber-600">
                {formatNumber(offlineEarnings)} Ambrosia
              </p>
              <Button onClick={collectOfflineEarnings} className="w-full bg-amber-500 hover:bg-amber-600">
                Collect
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card
              className="bg-amber-50 border-amber-200 cursor-pointer transition-all hover:shadow-lg active:scale-[0.99]"
              onClick={handleClick}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-amber-800">Divine Resources</CardTitle>
                <CardDescription className="text-amber-600">Click to collect ambrosia</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-amber-700">{formatNumber(gameState.ambrosia)} Ambrosia</div>
                  <div className="text-sm text-amber-600">
                    <span>+{formatNumber(gameState.clickPower)} per click</span>
                    {gameState.autoClickPower > 0 && (
                      <span> • +{formatNumber(gameState.autoClickPower)} per second</span>
                    )}
                  </div>
                </div>

                <div className="w-48 h-48 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mb-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-8xl">🏺</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg text-center">
                    <div className="text-sm text-amber-700">Total Ambrosia</div>
                    <div className="font-bold text-amber-800">{formatNumber(gameState.totalAmbrosia)}</div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg text-center">
                    <div className="text-sm text-amber-700">Achievements</div>
                    <div className="font-bold text-amber-800">
                      {Object.values(gameState.achievements).filter(Boolean).length}/{ACHIEVEMENTS.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="upgrades">
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-amber-800">Divine Upgrades</CardTitle>
                    <CardDescription className="text-amber-600">Enhance your ambrosia collection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {UPGRADES.map((upgrade) => {
                        const currentLevel = gameState.upgrades[upgrade.id] || 0
                        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.priceMultiplier, currentLevel))
                        const canAfford = gameState.ambrosia >= cost
                        const maxedOut = currentLevel >= upgrade.maxLevel

                        return (
                          <div key={upgrade.id} className="p-3 border border-amber-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <div className="font-medium text-amber-800 flex items-center">
                                  {upgrade.icon} {upgrade.name}
                                </div>
                                <div className="text-xs text-amber-600">
                                  Level: {currentLevel}/{upgrade.maxLevel}
                                </div>
                              </div>
                              <Badge className="bg-amber-200 text-amber-800">
                                {upgrade.id === "zeus_blessing"
                                  ? `+${upgrade.effect}/click`
                                  : upgrade.id === "poseidon_trident"
                                    ? `+${upgrade.effect}/click`
                                    : upgrade.id === "dionysus_wine"
                                      ? `+${upgrade.effect}/sec`
                                      : `+${upgrade.effect * 100}%`}
                              </Badge>
                            </div>
                            <div className="text-xs text-amber-700 mb-2">{upgrade.description}</div>
                            <Progress value={(currentLevel / upgrade.maxLevel) * 100} className="h-1 mb-2" />
                            <Button
                              onClick={() => buyUpgrade(upgrade.id)}
                              disabled={!canAfford || maxedOut}
                              className={`w-full ${
                                maxedOut
                                  ? "bg-green-500"
                                  : canAfford
                                    ? "bg-amber-500 hover:bg-amber-600"
                                    : "bg-gray-300 text-gray-500"
                              }`}
                            >
                              {maxedOut ? "Maxed Out" : `Buy (${formatNumber(cost)} Ambrosia)`}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-amber-800">Achievements</CardTitle>
                    <CardDescription className="text-amber-600">
                      {Object.values(gameState.achievements).filter(Boolean).length}/{ACHIEVEMENTS.length} Unlocked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ACHIEVEMENTS.map((achievement) => {
                        const unlocked = gameState.achievements[achievement.id] || false

                        let progress = 0
                        if (achievement.id === "first_click") {
                          progress = gameState.totalAmbrosia > 0 ? 100 : 0
                        } else if (achievement.id === "hundred_ambrosia") {
                          progress = Math.min(100, (gameState.totalAmbrosia / 100) * 100)
                        } else if (achievement.id === "thousand_ambrosia") {
                          progress = Math.min(100, (gameState.totalAmbrosia / 1000) * 100)
                        } else if (achievement.id === "first_upgrade") {
                          progress = Object.keys(gameState.upgrades).length > 0 ? 100 : 0
                        } else if (achievement.id === "all_upgrades") {
                          const uniqueUpgrades = Object.keys(gameState.upgrades).length
                          progress = Math.min(100, (uniqueUpgrades / UPGRADES.length) * 100)
                        }

                        return (
                          <div key={achievement.id} className="p-3 border border-amber-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium text-amber-800 flex items-center">
                                {achievement.icon} {achievement.name}
                              </div>
                              <Badge className={unlocked ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}>
                                {unlocked ? "Unlocked" : "Locked"}
                              </Badge>
                            </div>
                            <div className="text-xs text-amber-700 mb-2">{achievement.description}</div>
                            <Progress value={progress} className="h-1" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Button onClick={resetGame} className="mt-4 bg-red-500 hover:bg-red-600">
          Reset Game
        </Button>
      </div>
    </div>
  )
}
