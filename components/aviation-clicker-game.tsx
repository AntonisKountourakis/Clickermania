"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plane, Gauge, Building2, Users, Globe, Wrench, Zap, Award, RotateCw } from "lucide-react"
import { formatNumber } from "@/utils/format-number"

// Define the upgrade types
type Upgrade = {
  id: string
  name: string
  description: string
  baseCost: number
  baseValue: number
  count: number
  icon: JSX.Element
}

// Define the game state
type GameState = {
  miles: number
  milesPerClick: number
  milesPerSecond: number
  totalMiles: number
  level: number
  upgrades: Upgrade[]
  lastUpdated: number
  combo: number
  maxCombo: number
}

// Define the levels
const LEVELS = [
  { name: "Novice Pilot", threshold: 0 },
  { name: "Private Pilot", threshold: 1000 },
  { name: "Commercial Pilot", threshold: 10000 },
  { name: "Airline Pilot", threshold: 100000 },
  { name: "Senior Captain", threshold: 1000000 },
  { name: "Fleet Commander", threshold: 10000000 },
  { name: "Aviation Legend", threshold: 100000000 },
  { name: "Aerospace Pioneer", threshold: 1000000000 },
  { name: "Galactic Aviator", threshold: 10000000000 },
]

// Initial game state
const initialGameState: GameState = {
  miles: 0,
  milesPerClick: 1,
  milesPerSecond: 0,
  totalMiles: 0,
  level: 0,
  upgrades: [
    {
      id: "cessna",
      name: "Cessna 172",
      description: "The most popular training aircraft",
      baseCost: 10,
      baseValue: 0.1,
      count: 0,
      icon: <Plane size={16} />,
    },
    {
      id: "jet",
      name: "Private Jet",
      description: "Luxury travel for the elite",
      baseCost: 100,
      baseValue: 1,
      count: 0,
      icon: <Plane size={16} />,
    },
    {
      id: "hangar",
      name: "Hangar",
      description: "Store and maintain your aircraft",
      baseCost: 500,
      baseValue: 5,
      count: 0,
      icon: <Building2 size={16} />,
    },
    {
      id: "crew",
      name: "Flight Crew",
      description: "Professional pilots and attendants",
      baseCost: 3000,
      baseValue: 10,
      count: 0,
      icon: <Users size={16} />,
    },
    {
      id: "routes",
      name: "Flight Routes",
      description: "Establish new destinations",
      baseCost: 10000,
      baseValue: 25,
      count: 0,
      icon: <Globe size={16} />,
    },
    {
      id: "maintenance",
      name: "Maintenance Facility",
      description: "Keep your fleet in top condition",
      baseCost: 50000,
      baseValue: 100,
      count: 0,
      icon: <Wrench size={16} />,
    },
    {
      id: "airline",
      name: "Airline Company",
      description: "Start your own commercial airline",
      baseCost: 200000,
      baseValue: 500,
      count: 0,
      icon: <Building2 size={16} />,
    },
    {
      id: "supersonic",
      name: "Supersonic Jets",
      description: "Break the sound barrier",
      baseCost: 1000000,
      baseValue: 2000,
      count: 0,
      icon: <Zap size={16} />,
    },
    {
      id: "spaceplane",
      name: "Space Plane",
      description: "Reach the edge of space",
      baseCost: 50000000,
      baseValue: 10000,
      count: 0,
      icon: <Gauge size={16} />,
    },
    {
      id: "orbital",
      name: "Orbital Fleet",
      description: "Establish regular flights to orbit",
      baseCost: 1000000000,
      baseValue: 50000,
      count: 0,
      icon: <Award size={16} />,
    },
  ],
  lastUpdated: Date.now(),
  combo: 0,
  maxCombo: 0,
}

// Calculate the cost of an upgrade
const calculateUpgradeCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count))
}

// Calculate the value of an upgrade
const calculateUpgradeValue = (baseValue: number, count: number): number => {
  return baseValue * count
}

// Save game state to localStorage
const saveGameState = (state: GameState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("aviation-clicker-progress", JSON.stringify(state))
  }
}

// Load game state from localStorage
const loadGameState = (): GameState => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("aviation-clicker-progress")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as GameState
        // Update the lastUpdated field to calculate offline progress
        parsedState.lastUpdated = Date.now()
        return parsedState
      } catch (error) {
        console.error("Error parsing saved game state:", error)
      }
    }
  }
  return { ...initialGameState, lastUpdated: Date.now() }
}

// Calculate offline progress
const calculateOfflineProgress = (state: GameState): GameState => {
  const now = Date.now()
  const timeDiff = (now - state.lastUpdated) / 1000 // in seconds

  if (timeDiff > 0 && state.milesPerSecond > 0) {
    const offlineMiles = state.milesPerSecond * Math.min(timeDiff, 60 * 60 * 8) // Cap at 8 hours
    return {
      ...state,
      miles: state.miles + offlineMiles,
      totalMiles: state.totalMiles + offlineMiles,
      lastUpdated: now,
    }
  }

  return {
    ...state,
    lastUpdated: now,
  }
}

// Reset game state
const resetGameState = (): GameState => {
  return { ...initialGameState, lastUpdated: Date.now() }
}

// Click effect type
type ClickEffect = {
  id: number
  x: number
  y: number
  value: number
  opacity: number
}

export default function AviationClicker() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [nextClickEffectId, setNextClickEffectId] = useState(0)
  const [showOfflineEarnings, setShowOfflineEarnings] = useState(false)
  const [offlineEarnings, setOfflineEarnings] = useState(0)
  const [comboTimeout, setComboTimeout] = useState<NodeJS.Timeout | null>(null)

  // Refs
  const clickAreaRef = useRef<HTMLDivElement>(null)

  // Initialize game state
  useEffect(() => {
    const loadedState = loadGameState()
    const stateWithOfflineProgress = calculateOfflineProgress(loadedState)

    // Calculate offline earnings
    const offlineEarned = stateWithOfflineProgress.miles - loadedState.miles
    if (offlineEarned > 0) {
      setOfflineEarnings(offlineEarned)
      setShowOfflineEarnings(true)
    }

    setGameState(stateWithOfflineProgress)

    // Save game state every 10 seconds
    const saveInterval = setInterval(() => {
      setGameState((prevState) => {
        saveGameState({ ...prevState, lastUpdated: Date.now() })
        return prevState
      })
    }, 10000)

    return () => {
      clearInterval(saveInterval)
      if (comboTimeout) clearTimeout(comboTimeout)
    }
  }, [])

  // Update miles per second based on upgrades
  useEffect(() => {
    let mps = 0
    gameState.upgrades.forEach((upgrade) => {
      mps += calculateUpgradeValue(upgrade.baseValue, upgrade.count)
    })

    if (mps !== gameState.milesPerSecond) {
      setGameState((prevState) => ({
        ...prevState,
        milesPerSecond: mps,
      }))
    }
  }, [gameState.upgrades])

  // Update miles per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.milesPerSecond > 0) {
        setGameState((prevState) => ({
          ...prevState,
          miles: prevState.miles + prevState.milesPerSecond / 10,
          totalMiles: prevState.totalMiles + prevState.milesPerSecond / 10,
        }))
      }
    }, 100)

    return () => clearInterval(interval)
  }, [gameState.milesPerSecond])

  // Update level based on total miles
  useEffect(() => {
    const newLevel = LEVELS.findIndex(
      (level, index) =>
        gameState.totalMiles >= level.threshold &&
        (index === LEVELS.length - 1 || gameState.totalMiles < LEVELS[index + 1].threshold),
    )

    if (newLevel !== -1 && newLevel !== gameState.level) {
      setGameState((prevState) => ({
        ...prevState,
        level: newLevel,
        milesPerClick: 1 + Math.floor(newLevel / 2),
      }))
    }
  }, [gameState.totalMiles])

  // Handle click on the click area
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickAreaRef.current) return

    // Get click position relative to the click area
    const rect = clickAreaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update combo
    if (comboTimeout) clearTimeout(comboTimeout)
    const newCombo = gameState.combo + 1
    const newMaxCombo = Math.max(gameState.maxCombo, newCombo)

    // Calculate miles earned with combo bonus
    const comboBonus = Math.min(newCombo * 0.1, 2) // Max 2x bonus
    const milesEarned = gameState.milesPerClick * (1 + comboBonus)

    // Add click effect
    setClickEffects((prevEffects) => [
      ...prevEffects,
      {
        id: nextClickEffectId,
        x,
        y,
        value: milesEarned,
        opacity: 1,
      },
    ])
    setNextClickEffectId((prevId) => prevId + 1)

    // Update game state
    setGameState((prevState) => ({
      ...prevState,
      miles: prevState.miles + milesEarned,
      totalMiles: prevState.totalMiles + milesEarned,
      combo: newCombo,
      maxCombo: newMaxCombo,
    }))

    // Reset combo after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setGameState((prevState) => ({
        ...prevState,
        combo: 0,
      }))
    }, 2000)
    setComboTimeout(timeout)
  }

  // Remove click effects after animation
  useEffect(() => {
    if (clickEffects.length > 0) {
      const timeout = setTimeout(() => {
        setClickEffects((prevEffects) => prevEffects.slice(1))
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [clickEffects])

  // Buy upgrade
  const buyUpgrade = (upgradeId: string) => {
    setGameState((prevState) => {
      const upgradeIndex = prevState.upgrades.findIndex((u) => u.id === upgradeId)
      if (upgradeIndex === -1) return prevState

      const upgrade = prevState.upgrades[upgradeIndex]
      const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.count)

      if (prevState.miles < cost) return prevState

      const newUpgrades = [...prevState.upgrades]
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
      }

      return {
        ...prevState,
        miles: prevState.miles - cost,
        upgrades: newUpgrades,
      }
    })
  }

  // Reset game
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      const newState = resetGameState()
      setGameState(newState)
      saveGameState(newState)
    }
  }

  // Calculate progress to next level
  const calculateLevelProgress = (): number => {
    if (gameState.level >= LEVELS.length - 1) return 100

    const currentThreshold = LEVELS[gameState.level].threshold
    const nextThreshold = LEVELS[gameState.level + 1].threshold
    const progress = ((gameState.totalMiles - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="aviation-clicker p-4 min-h-screen bg-gradient-to-b from-sky-900 to-blue-900">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column - Click area and stats */}
          <div className="md:col-span-2 space-y-4">
            {/* Level and progress */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>{LEVELS[gameState.level].name}</span>
                  <span className="text-sm opacity-70">Level {gameState.level + 1}</span>
                </CardTitle>
                <Progress value={calculateLevelProgress()} className="h-2 mt-1" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-300">Miles per click</p>
                    <p className="font-bold">{formatNumber(gameState.milesPerClick)}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Miles per second</p>
                    <p className="font-bold">{formatNumber(gameState.milesPerSecond)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Click area */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-sky-600 pb-2">
                <CardTitle className="text-xl">Aviation Empire</CardTitle>
                <CardDescription className="text-blue-100">
                  Click to earn flight miles and expand your aviation empire!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={clickAreaRef}
                  className="relative h-64 bg-gradient-to-b from-sky-700/50 to-blue-900/50 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={handleClick}
                >
                  <div className="absolute inset-0 bg-[url('/airplane-blue-sky.png')] bg-cover bg-center opacity-20"></div>

                  {/* Click effects */}
                  {clickEffects.map((effect) => (
                    <div
                      key={effect.id}
                      className="absolute pointer-events-none text-white font-bold animate-float-up"
                      style={{
                        left: `${effect.x}px`,
                        top: `${effect.y}px`,
                        opacity: effect.opacity,
                      }}
                    >
                      +{formatNumber(effect.value)}
                    </div>
                  ))}

                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-bold mb-2 text-white drop-shadow-glow">
                      {formatNumber(Math.floor(gameState.miles))}
                    </div>
                    <div className="text-xl text-blue-200">Miles</div>

                    {/* Combo indicator */}
                    {gameState.combo > 1 && (
                      <div className="mt-2 text-yellow-300 font-bold animate-pulse">{gameState.combo}x Combo!</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-blue-900/50 to-sky-800/50 py-2 px-4 flex justify-between items-center">
                <div className="text-sm text-blue-200">
                  Total Miles: {formatNumber(Math.floor(gameState.totalMiles))}
                </div>
                <div className="text-sm text-blue-200">Max Combo: {gameState.maxCombo}x</div>
              </CardFooter>
            </Card>

            {/* Offline earnings notification */}
            {showOfflineEarnings && (
              <Card className="bg-green-800/80 backdrop-blur-md border-green-600/30 text-white shadow-xl">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold">Welcome Back!</h3>
                    <p>You earned {formatNumber(Math.floor(offlineEarnings))} miles while away.</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-green-400 text-white hover:bg-green-700"
                    onClick={() => setShowOfflineEarnings(false)}
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Upgrades */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-sky-600 pb-2">
                <CardTitle className="text-xl">Upgrades</CardTitle>
                <CardDescription className="text-blue-100">Improve your aviation empire</CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-h-[500px] overflow-y-auto">
                <div className="space-y-2">
                  {gameState.upgrades.map((upgrade) => {
                    const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.count)
                    const canAfford = gameState.miles >= cost

                    return (
                      <div
                        key={upgrade.id}
                        className={`p-2 rounded-md transition-colors ${
                          canAfford
                            ? "bg-blue-800/50 hover:bg-blue-700/50 cursor-pointer"
                            : "bg-gray-800/50 cursor-not-allowed opacity-70"
                        }`}
                        onClick={() => canAfford && buyUpgrade(upgrade.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-600 rounded-md">{upgrade.icon}</div>
                            <div>
                              <div className="font-medium">{upgrade.name}</div>
                              <div className="text-xs text-gray-300">{upgrade.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs">Cost: {formatNumber(cost)}</div>
                            <div className="text-xs">Owned: {upgrade.count}</div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs flex justify-between">
                          <span>+{formatNumber(upgrade.baseValue)} miles/sec</span>
                          <span>
                            Total: +{formatNumber(calculateUpgradeValue(upgrade.baseValue, upgrade.count))} miles/sec
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="p-2 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-400 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                  onClick={handleReset}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Reset Game
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
