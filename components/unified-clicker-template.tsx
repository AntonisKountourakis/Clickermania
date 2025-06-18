"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/utils/format-number"
import { ResponsiveGameLayout } from "./responsive-game-layout"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import type React from "react"

interface UpgradeType {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  icon: React.ReactNode
  unlockRequirement?: { id: string; level: number }
}

interface RankType {
  name: string
  threshold: number
  icon?: string
}

interface GameSettings {
  name: string
  description: string
  storageKey: string
  mainStatName: string
  mainStatIcon: any
  secondaryStatName?: string
  secondaryStatIcon?: any
  clickButtonText: string
  clickButtonIcon?: React.ReactNode
  backgroundClass: string
  headerGradientClass: string
  buttonGradientClass: string
  textColorClass: string
  accentColorClass: string
  clickMessages: string[]
  ranks: RankType[]
  upgrades: UpgradeType[]
  advancedUpgrades?: UpgradeType[]
}

interface GameStats {
  mainStat: number
  clickPower: number
  autoGeneration: number
  multiplier1: number
  multiplier2: number
  upgrades: Record<string, number>
  streak: number
  achievements: string[]
}

interface UnifiedClickerTemplateProps {
  settings: GameSettings
  initialStats?: Partial<GameStats>
  renderCustomCollection?: (stats: GameStats) => React.ReactNode
}

export function UnifiedClickerTemplate({
  settings,
  initialStats = {},
  renderCustomCollection,
}: UnifiedClickerTemplateProps) {
  const {
    name,
    description,
    storageKey,
    mainStatName,
    mainStatIcon: MainStatIcon,
    secondaryStatName,
    secondaryStatIcon: SecondaryStatIcon,
    clickButtonText,
    clickButtonIcon,
    backgroundClass,
    headerGradientClass,
    buttonGradientClass,
    textColorClass,
    accentColorClass,
    clickMessages,
    ranks,
    upgrades,
    advancedUpgrades = [],
  } = settings

  const { isMobile } = useMobileOptimization({})

  // Game state
  const [stats, setStats] = useState<GameStats>({
    mainStat: 0,
    clickPower: 1,
    autoGeneration: 0,
    multiplier1: 1,
    multiplier2: 1,
    upgrades: {},
    streak: 0,
    achievements: [],
    ...initialStats,
  })

  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; text: string }[]>([])
  const [nextClickEffectId, setNextClickEffectId] = useState(0)
  const [activeTab, setActiveTab] = useState("stats")

  // Load saved game
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(storageKey)
      if (savedGame) {
        setStats(JSON.parse(savedGame))
      }
    } catch (error) {
      console.error("Failed to load game:", error)
    }
  }, [storageKey])

  // Save game
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(stats))
    } catch (error) {
      console.error("Failed to save game:", error)
    }
  }, [stats, storageKey])

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
    (event: React.MouseEvent) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Add click effect
      const randomMessage = clickMessages[Math.floor(Math.random() * clickMessages.length)]
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
    [clickMessages, nextClickEffectId, stats.clickPower, stats.multiplier1, stats.multiplier2],
  )

  // Calculate upgrade price
  const calculateUpgradePrice = useCallback(
    (upgrade: UpgradeType) => {
      const level = stats.upgrades[upgrade.id] || 0
      return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, level))
    },
    [stats.upgrades],
  )

  // Purchase upgrade
  const purchaseUpgrade = useCallback(
    (upgrade: UpgradeType) => {
      const price = calculateUpgradePrice(upgrade)
      if (stats.mainStat >= price) {
        const currentLevel = stats.upgrades[upgrade.id] || 0
        if (currentLevel < upgrade.maxLevel) {
          setStats((prev) => {
            const newStats = { ...prev }
            newStats.mainStat -= price
            newStats.upgrades = { ...prev.upgrades, [upgrade.id]: currentLevel + 1 }

            // Apply upgrade effects
            if (upgrade.id === "click_power" || upgrade.id.includes("strength") || upgrade.id.includes("exploration")) {
              newStats.clickPower += upgrade.effect
            } else if (
              upgrade.id === "auto_generation" ||
              upgrade.id.includes("warriors") ||
              upgrade.id.includes("space_station")
            ) {
              newStats.autoGeneration += upgrade.effect
            } else if (
              upgrade.id.includes("quality") ||
              upgrade.id.includes("weapons") ||
              upgrade.id.includes("telescope")
            ) {
              newStats.multiplier1 += upgrade.effect / 10
            } else if (
              upgrade.id.includes("variety") ||
              upgrade.id.includes("feasts") ||
              upgrade.id.includes("colonization")
            ) {
              newStats.multiplier2 += upgrade.effect / 10
            }

            // Advanced upgrades
            if (upgrade.id.includes("master") || upgrade.id.includes("berserker") || upgrade.id.includes("wormhole")) {
              newStats.clickPower *= 1 + upgrade.effect
            } else if (
              upgrade.id.includes("factory") ||
              upgrade.id.includes("longships") ||
              upgrade.id.includes("dyson_sphere")
            ) {
              newStats.autoGeneration *= 1 + upgrade.effect
            } else if (
              upgrade.id.includes("secret") ||
              upgrade.id.includes("runes") ||
              upgrade.id.includes("quantum_telescope")
            ) {
              newStats.multiplier1 *= 1 + upgrade.effect
            } else if (
              upgrade.id.includes("delivery") ||
              upgrade.id.includes("conquest") ||
              upgrade.id.includes("terraforming")
            ) {
              newStats.multiplier2 *= 1 + upgrade.effect
            } else if (
              upgrade.id.includes("empire") ||
              upgrade.id.includes("valhalla") ||
              upgrade.id.includes("intergalactic_empire")
            ) {
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
    let currentRank = ranks[0]
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (stats.mainStat >= ranks[i].threshold) {
        currentRank = ranks[i]
        break
      }
    }
    return currentRank
  }, [ranks, stats.mainStat])

  // Get next rank
  const getNextRank = useCallback(() => {
    for (let i = 0; i < ranks.length; i++) {
      if (stats.mainStat < ranks[i].threshold) {
        return ranks[i]
      }
    }
    return null
  }, [ranks, stats.mainStat])

  const currentRank = getCurrentRank()
  const nextRank = getNextRank()

  // Calculate progress to next rank
  const calculateProgress = useCallback(() => {
    if (!nextRank) return 100
    const prevThreshold = ranks[ranks.indexOf(nextRank) - 1]?.threshold || 0
    const progress = ((stats.mainStat - prevThreshold) / (nextRank.threshold - prevThreshold)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }, [nextRank, ranks, stats.mainStat])

  // Check if upgrade is unlocked
  const isUpgradeUnlocked = useCallback(
    (upgrade: UpgradeType) => {
      if (!upgrade.unlockRequirement) return true
      const { id, level } = upgrade.unlockRequirement
      return (stats.upgrades[id] || 0) >= level
    },
    [stats.upgrades],
  )

  return (
    <ResponsiveGameLayout backgroundClass={backgroundClass}>
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className={`${headerGradientClass} text-white rounded-t-lg`}>
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <CardDescription className="text-gray-200">{description}</CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stats Display */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <MainStatIcon className={`h-6 w-6 mr-2 ${accentColorClass}`} />
                <div>
                  <div className="text-sm text-gray-500">{mainStatName}</div>
                  <div className={`text-xl font-bold ${textColorClass}`}>{formatNumber(stats.mainStat)}</div>
                </div>
              </div>

              <div className="flex items-center">
                {SecondaryStatIcon && <SecondaryStatIcon className={`h-5 w-5 mr-2 ${accentColorClass}`} />}
                <div>
                  <div className="text-sm text-gray-500">{secondaryStatName || "Power"}</div>
                  <div className={`text-xl font-bold ${textColorClass}`}>
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
                  <span className={`font-bold ${textColorClass}`}>{currentRank.name}</span>
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
            {renderCustomCollection && renderCustomCollection(stats)}

            {/* Main Click Button */}
            <div className="relative mb-6">
              <Button
                className={`w-full py-6 text-xl font-bold ${buttonGradientClass} text-white rounded-lg shadow-lg transition-all hover:shadow-xl active:scale-95`}
                onClick={handleClick}
              >
                {clickButtonIcon}
                {clickButtonText}
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
                Auto-generating {formatNumber(stats.autoGeneration * stats.multiplier1 * stats.multiplier2)}{" "}
                {mainStatName} per second
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="stats" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                {advancedUpgrades.length > 0 && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
              </TabsList>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Click Power</div>
                    <div className={`text-lg font-bold ${textColorClass}`}>{formatNumber(stats.clickPower)}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Auto-Gen</div>
                    <div className={`text-lg font-bold ${textColorClass}`}>{formatNumber(stats.autoGeneration)}/s</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Multiplier 1</div>
                    <div className={`text-lg font-bold ${textColorClass}`}>x{stats.multiplier1.toFixed(1)}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Multiplier 2</div>
                    <div className={`text-lg font-bold ${textColorClass}`}>x{stats.multiplier2.toFixed(1)}</div>
                  </div>
                </div>
              </TabsContent>

              {/* Upgrades Tab */}
              <TabsContent value="upgrades" className="space-y-3">
                {upgrades.map((upgrade) => {
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
                        className={buttonGradientClass}
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
              {advancedUpgrades.length > 0 && (
                <TabsContent value="advanced" className="space-y-3">
                  {advancedUpgrades.map((upgrade) => {
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
                          className={buttonGradientClass}
                          disabled={!canAfford || maxedOut}
                          onClick={() => purchaseUpgrade(upgrade)}
                        >
                          {maxedOut ? "MAX" : formatNumber(price)}
                        </Button>
                      </div>
                    )
                  })}
                </TabsContent>
              )}
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

export default UnifiedClickerTemplate
