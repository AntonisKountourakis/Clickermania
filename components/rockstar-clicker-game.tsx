"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Music, Users, Radio, Mic2, Film, Plane, RotateCcw } from "lucide-react"
import { createParticle } from "@/utils/click-effect"

// Custom component to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toFixed(0)
  }
}

// Define stages for the career progression
const careerStages = [
  { name: "Street Performer", threshold: 0, color: "text-zinc-400" },
  { name: "Local Gigs", threshold: 1000, color: "text-amber-400" },
  { name: "Regional Artist", threshold: 10000, color: "text-orange-500" },
  { name: "National Act", threshold: 100000, color: "text-red-500" },
  { name: "Major Label", threshold: 1000000, color: "text-purple-500" },
  { name: "Platinum Artist", threshold: 10000000, color: "text-pink-500" },
  { name: "World Tour", threshold: 100000000, color: "text-rose-400" },
  { name: "Rock Legend", threshold: 1000000000, color: "text-rose-300" },
]

interface Upgrade {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  baseValue: number
  count: number
  passive: boolean
  icon: JSX.Element
  color: string
}

// Game component
export default function RockstarClicker() {
  const [fans, setFans] = useState<number>(0)
  const [totalFans, setTotalFans] = useState<number>(0)
  const [clickValue, setClickValue] = useState<number>(1)
  const [passiveIncome, setPassiveIncome] = useState<number>(0)
  const [level, setLevel] = useState<number>(0)
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false)
  const [rockstarRotate, setRockstarRotate] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [availableParticles, _] = useState<string[]>(["🎸", "🎵", "🎤", "🎹", "🎷", "🥁", "🤘", "🎧", "🎻", "🎺"])

  // Define upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "guitar",
      name: "Guitar",
      description: "Increase your performance value",
      basePrice: 10,
      priceMultiplier: 1.2,
      baseValue: 1,
      count: 0,
      passive: false,
      icon: <Music className="h-6 w-6 text-amber-500" />,
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
    },
    {
      id: "amplifier",
      name: "Amplifier",
      description: "Makes your sound louder and more powerful",
      basePrice: 50,
      priceMultiplier: 1.3,
      baseValue: 4,
      count: 0,
      passive: false,
      icon: <Radio className="h-6 w-6 text-red-500" />,
      color: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      id: "bandMembers",
      name: "Band Members",
      description: "They play even when you take a break",
      basePrice: 100,
      priceMultiplier: 1.4,
      baseValue: 1,
      count: 0,
      passive: true,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      id: "recordingStudio",
      name: "Recording Studio",
      description: "Record your songs and earn passive fans",
      basePrice: 1000,
      priceMultiplier: 1.5,
      baseValue: 10,
      count: 0,
      passive: true,
      icon: <Mic2 className="h-6 w-6 text-violet-500" />,
      color: "bg-gradient-to-r from-violet-500 to-violet-600",
    },
    {
      id: "musicVideo",
      name: "Music Video",
      description: "Reach a wider audience with your videos",
      basePrice: 12000,
      priceMultiplier: 1.7,
      baseValue: 80,
      count: 0,
      passive: true,
      icon: <Film className="h-6 w-6 text-pink-500" />,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
    },
    {
      id: "worldTour",
      name: "World Tour",
      description: "Tour the world and gain millions of fans",
      basePrice: 130000,
      priceMultiplier: 2,
      baseValue: 470,
      count: 0,
      passive: true,
      icon: <Plane className="h-6 w-6 text-green-500" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ])

  // Calculate level based on total fans
  useEffect(() => {
    let newLevel = 0
    for (let i = careerStages.length - 1; i >= 0; i--) {
      if (totalFans >= careerStages[i].threshold) {
        newLevel = i
        break
      }
    }

    if (newLevel > level) {
      setLevel(newLevel)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    } else {
      setLevel(newLevel)
    }

    // Calculate progress to next level
    if (newLevel < careerStages.length - 1) {
      const currentThreshold = careerStages[newLevel].threshold
      const nextThreshold = careerStages[newLevel + 1].threshold
      const progress = ((totalFans - currentThreshold) / (nextThreshold - currentThreshold)) * 100
      setProgress(Math.min(progress, 100))
    } else {
      setProgress(100)
    }
  }, [totalFans, level])

  // Calculate passive income
  useEffect(() => {
    let newPassiveIncome = 0
    upgrades.forEach((upgrade) => {
      if (upgrade.passive) {
        newPassiveIncome += upgrade.baseValue * upgrade.count
      }
    })
    setPassiveIncome(newPassiveIncome)
  }, [upgrades])

  // Apply passive income on interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveIncome > 0) {
        setFans((prev) => prev + passiveIncome / 10)
        setTotalFans((prev) => prev + passiveIncome / 10)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [passiveIncome])

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem("rockstar-clicker-progress")
    if (savedGame) {
      try {
        const { fans, totalFans, clickValue, upgrades: savedUpgrades } = JSON.parse(savedGame)
        setFans(fans)
        setTotalFans(totalFans)
        setClickValue(clickValue)
        setUpgrades((prevUpgrades) =>
          prevUpgrades.map((upgrade) => {
            const savedUpgrade = savedUpgrades.find((u: Upgrade) => u.id === upgrade.id)
            if (savedUpgrade) {
              return {
                ...upgrade,
                count: savedUpgrade.count,
              }
            }
            return upgrade
          }),
        )
      } catch (e) {
        console.error("Error loading saved game:", e)
      }
    }
  }, [])

  // Save game
  useEffect(() => {
    const saveGame = () => {
      const gameState = {
        fans,
        totalFans,
        clickValue,
        upgrades: upgrades.map(({ id, count }) => ({ id, count })),
      }
      localStorage.setItem("rockstar-clicker-progress", JSON.stringify(gameState))
    }

    const interval = setInterval(saveGame, 10000)
    window.addEventListener("beforeunload", saveGame)

    return () => {
      clearInterval(interval)
      window.removeEventListener("beforeunload", saveGame)
      saveGame()
    }
  }, [fans, totalFans, clickValue, upgrades])

  // Handle click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Create particles at click position
      const numParticles = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < numParticles; i++) {
        const randomEmoji = availableParticles[Math.floor(Math.random() * availableParticles.length)]
        createParticle(x, y, randomEmoji, e.currentTarget)
      }

      // Add fans and update total
      setFans((prev) => prev + clickValue)
      setTotalFans((prev) => prev + clickValue)

      // Animation effect
      setRockstarRotate(true)
      setTimeout(() => setRockstarRotate(false), 150)
    },
    [clickValue, availableParticles],
  )

  // Handle buying an upgrade
  const handleBuyUpgrade = useCallback(
    (id: string) => {
      setUpgrades((prevUpgrades) => {
        return prevUpgrades.map((upgrade) => {
          if (upgrade.id === id) {
            const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, upgrade.count))

            if (fans >= cost) {
              setFans((prev) => prev - cost)

              // Update click value for non-passive upgrades
              if (!upgrade.passive) {
                setClickValue((prev) => prev + upgrade.baseValue)
              }

              return {
                ...upgrade,
                count: upgrade.count + 1,
              }
            }
          }
          return upgrade
        })
      })
    },
    [fans],
  )

  // Reset game
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      localStorage.removeItem("rockstar-clicker-progress")
      setFans(0)
      setTotalFans(0)
      setClickValue(1)
      setLevel(0)
      setUpgrades((prev) =>
        prev.map((upgrade) => ({
          ...upgrade,
          count: 0,
        })),
      )
    }
  }

  // Calculate upgrade cost
  const getUpgradeCost = (upgrade: Upgrade) => {
    return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, upgrade.count))
  }

  // Get stage color
  const currentStageColor = careerStages[level]?.color || "text-white"

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-4 sm:p-8 relative overflow-hidden">
      {/* Stage lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 -right-20 w-60 h-60 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Sound waves animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div
            className="absolute inset-0 border-4 border-purple-500/10 rounded-full animate-ping"
            style={{ animationDuration: "3s", animationDelay: "0s" }}
          ></div>
          <div
            className="absolute inset-0 border-4 border-pink-500/10 rounded-full animate-ping"
            style={{ animationDuration: "3s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute inset-0 border-4 border-blue-500/10 rounded-full animate-ping"
            style={{ animationDuration: "3s", animationDelay: "2s" }}
          ></div>
        </div>
      </div>

      {/* Level up notification */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`text-4xl md:text-6xl font-bold ${careerStages[level].color} text-center animate-bounce shadow-lg px-8 py-4 rounded-xl bg-black/70 backdrop-blur-md`}
          >
            LEVEL UP!
            <br />
            <span className="text-2xl md:text-3xl">{careerStages[level].name}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 animate-pulse-slow">
            Rock Star Clicker
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Build your music career and become a legend!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <div className="md:col-span-2 space-y-6">
            {/* Main game area */}
            <Card
              className="shadow-xl bg-gradient-to-b from-purple-900/70 to-fuchsia-900/70 backdrop-blur-md border border-purple-500/50 hover:shadow-purple-500/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
              onClick={handleClick}
            >
              <CardHeader className="bg-gradient-to-r from-purple-800 to-fuchsia-800 rounded-t-xl border-b border-purple-700/50">
                <CardTitle className="text-2xl font-bold text-center text-white">{careerStages[level].name}</CardTitle>
                <CardDescription className="text-center text-purple-200/80">
                  Rock the stage and gain fans!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-purple-950/90 to-fuchsia-950/90">
                <div className="text-center mb-4">
                  <div className={`text-4xl md:text-5xl font-bold ${currentStageColor} mb-2 text-shadow-glow`}>
                    {formatNumber(fans)} <span className="text-2xl md:text-3xl">Fans</span>
                  </div>
                  <div className="text-sm text-purple-300/80">
                    {passiveIncome > 0 && `+${formatNumber(passiveIncome)} fans per second`}
                  </div>
                </div>

                {/* Progress to next level */}
                <div className="w-full mb-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className={`${currentStageColor}`}>{careerStages[level].name}</span>
                    {level < careerStages.length - 1 && (
                      <span className={`${careerStages[level + 1].color}`}>{careerStages[level + 1].name}</span>
                    )}
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-purple-950"
                    indicatorClassName="bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                  {level < careerStages.length - 1 && (
                    <div className="text-xs text-right mt-1 text-purple-300/80">
                      {formatNumber(totalFans)}/{formatNumber(careerStages[level + 1].threshold)}
                    </div>
                  )}
                </div>

                {/* Rockstar Image */}
                <div
                  className={`relative flex items-center justify-center w-48 h-48 mb-3 transition-all ${rockstarRotate ? "scale-110" : "scale-100"}`}
                >
                  <div className="text-9xl">🎸</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full animate-pulse-slow"></div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-xl font-bold text-purple-200">+{formatNumber(clickValue)} fans per click</div>
                </div>
              </CardContent>
            </Card>

            {/* Reset button */}
            <div className="text-center">
              <Button
                variant="outline"
                className="text-red-400 border-red-900/50 hover:bg-red-950/50 hover:text-red-300"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </div>

          {/* Upgrades */}
          <div className="space-y-4">
            <Card className="shadow-xl bg-gradient-to-b from-purple-900/70 to-fuchsia-900/70 backdrop-blur-md border border-purple-500/50">
              <CardHeader className="bg-gradient-to-r from-purple-800 to-fuchsia-800 rounded-t-xl border-b border-purple-700/50 pb-3">
                <CardTitle className="text-xl font-bold text-white">Upgrades</CardTitle>
                <CardDescription className="text-purple-200/80">Enhance your music career</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 bg-gradient-to-b from-purple-950/90 to-fuchsia-950/90">
                {upgrades.map((upgrade) => {
                  const cost = getUpgradeCost(upgrade)
                  const canAfford = fans >= cost

                  return (
                    <div
                      key={upgrade.id}
                      className={`flex justify-between items-center p-2 rounded-lg border transition-all cursor-pointer ${
                        canAfford
                          ? `${upgrade.color.replace("from", "from-opacity-20").replace("to", "to-opacity-10")} border-${upgrade.color.split("-")[1]}-500/30 hover:border-${upgrade.color.split("-")[1]}-400/50`
                          : "bg-gray-900/30 border-gray-800/30"
                      }`}
                      onClick={() => canAfford && handleBuyUpgrade(upgrade.id)}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${upgrade.color} mr-3 shadow-sm`}>{upgrade.icon}</div>
                        <div>
                          <div className="font-medium text-white flex items-center">
                            {upgrade.name}
                            {upgrade.count > 0 && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-white/10 rounded-full">{upgrade.count}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-300/80">{upgrade.description}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canAfford) handleBuyUpgrade(upgrade.id)
                        }}
                        className={`whitespace-nowrap ${
                          canAfford ? `${upgrade.color} hover:opacity-90 text-white` : "bg-gray-800 text-gray-400"
                        }`}
                        disabled={!canAfford}
                      >
                        {formatNumber(cost)}
                      </Button>
                    </div>
                  )
                })}

                {upgrades.every((upgrade) => upgrade.count > 0) && (
                  <div className="text-center mt-4 p-2 bg-purple-800/20 rounded-lg border border-purple-500/20">
                    <span className="text-purple-300 text-sm">All upgrades purchased! Keep rocking!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stage front */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-0"></div>
    </div>
  )
}
