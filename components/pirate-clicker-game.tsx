"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ClickEffectManager } from "@/utils/click-effect-manager"

// Helper function to format large numbers (integers only)
const formatNumber = (num: number): string => {
  // Round to integer first
  num = Math.floor(num)

  if (num >= 1000000) {
    return Math.floor(num / 1000000) + "M"
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "K"
  } else {
    return num.toString()
  }
}

// Define the upgrade types
interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  baseValue: number
  count: number
  icon: string
}

// Define the game state
interface GameState {
  doubloons: number
  clickValue: number
  totalDoubloons: number
  upgrades: Upgrade[]
  rank: string
  nextRankCost: number
}

// Initial game state
const initialGameState: GameState = {
  doubloons: 0,
  clickValue: 1,
  totalDoubloons: 0,
  upgrades: [
    {
      id: "crew",
      name: "Loyal Crew",
      description: "Hire sailors to help you plunder",
      baseCost: 10,
      baseValue: 1,
      count: 0,
      icon: "👨‍✈️",
    },
    {
      id: "cannon",
      name: "Ship Cannons",
      description: "Add cannons to your ship for more firepower",
      baseCost: 50,
      baseValue: 5,
      count: 0,
      icon: "💣",
    },
    {
      id: "map",
      name: "Treasure Maps",
      description: "Find hidden treasures with ancient maps",
      baseCost: 200,
      baseValue: 20,
      count: 0,
      icon: "🗺️",
    },
    {
      id: "ship",
      name: "Better Ship",
      description: "Upgrade your vessel for faster plundering",
      baseCost: 1000,
      baseValue: 100,
      count: 0,
      icon: "⛵",
    },
    {
      id: "parrot",
      name: "Talking Parrot",
      description: "A loyal companion that brings you treasures",
      baseCost: 5000,
      baseValue: 500,
      count: 0,
      icon: "🦜",
    },
    {
      id: "blackbeard",
      name: "Blackbeard's Legacy",
      description: "Inherit the legendary pirate's fortune",
      baseCost: 20000,
      baseValue: 2000,
      count: 0,
      icon: "☠️",
    },
  ],
  rank: "Cabin Boy",
  nextRankCost: 100,
}

// Pirate ranks in order of progression
const pirateRanks = [
  { name: "Cabin Boy", cost: 100 },
  { name: "Deckhand", cost: 500 },
  { name: "Boatswain", cost: 2000 },
  { name: "Quartermaster", cost: 10000 },
  { name: "First Mate", cost: 50000 },
  { name: "Captain", cost: 200000 },
  { name: "Pirate Lord", cost: 1000000 },
  { name: "Legendary Pirate", cost: Number.POSITIVE_INFINITY },
]

export default function PirateClicker() {
  // State for the game
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const clickEffectManager = useRef<ClickEffectManager | null>(null)

  // Initialize click effect manager
  useEffect(() => {
    if (containerRef.current && !clickEffectManager.current) {
      clickEffectManager.current = new ClickEffectManager(containerRef.current, {
        particleCount: 5,
        colors: ["#FFD700", "#C0C0C0", "#B87333"], // Gold, Silver, Copper colors
        shapes: ["⚓", "💰", "🏴‍☠️", "💎"],
        gravity: 0.2,
        spread: 50,
        size: { min: 20, max: 30 },
      })
    }
  }, [])

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("pirate-clicker-progress")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setGameState(parsedState)
      } catch (error) {
        console.error("Failed to parse saved state:", error)
      }
    }
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem("pirate-clicker-progress", JSON.stringify(gameState))
  }, [gameState])

  // Auto-generate doubloons based on upgrades
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prevState) => {
        const autoDoubloonsPerSecond = prevState.upgrades.reduce(
          (total, upgrade) => total + upgrade.baseValue * upgrade.count,
          0,
        )

        if (autoDoubloonsPerSecond > 0) {
          const newDoubloons = Math.floor(prevState.doubloons + autoDoubloonsPerSecond)
          const newTotalDoubloons = Math.floor(prevState.totalDoubloons + autoDoubloonsPerSecond)

          return {
            ...prevState,
            doubloons: newDoubloons,
            totalDoubloons: newTotalDoubloons,
          }
        }

        return prevState
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle clicking the ship to earn doubloons
  const handleClick = () => {
    if (clickEffectManager.current) {
      clickEffectManager.current.createParticles()
    }

    setGameState((prevState) => {
      const newDoubloons = Math.floor(prevState.doubloons + prevState.clickValue)
      const newTotalDoubloons = Math.floor(prevState.totalDoubloons + prevState.clickValue)

      // Check if player can rank up
      let newRank = prevState.rank
      let newNextRankCost = prevState.nextRankCost

      const currentRankIndex = pirateRanks.findIndex((rank) => rank.name === prevState.rank)
      if (currentRankIndex < pirateRanks.length - 1 && newTotalDoubloons >= prevState.nextRankCost) {
        newRank = pirateRanks[currentRankIndex + 1].name
        newNextRankCost = pirateRanks[currentRankIndex + 1].cost
      }

      return {
        ...prevState,
        doubloons: newDoubloons,
        totalDoubloons: newTotalDoubloons,
        rank: newRank,
        nextRankCost: newNextRankCost,
      }
    })
  }

  // Calculate the cost of an upgrade
  const getUpgradeCost = (upgrade: Upgrade): number => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count))
  }

  // Purchase an upgrade
  const purchaseUpgrade = (upgradeId: string) => {
    setGameState((prevState) => {
      const upgradeIndex = prevState.upgrades.findIndex((u) => u.id === upgradeId)

      if (upgradeIndex === -1) return prevState

      const upgrade = prevState.upgrades[upgradeIndex]
      const cost = getUpgradeCost(upgrade)

      if (prevState.doubloons < cost) return prevState

      const newUpgrades = [...prevState.upgrades]
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
      }

      // Calculate new click value
      const newClickValue = Math.floor(
        1 + newUpgrades.reduce((total, u) => (u.id === "crew" ? total + u.baseValue * u.count : total), 0),
      )

      return {
        ...prevState,
        doubloons: prevState.doubloons - cost,
        clickValue: newClickValue,
        upgrades: newUpgrades,
      }
    })
  }

  // Reset the game
  const resetGame = () => {
    setGameState(initialGameState)
    setShowResetConfirm(false)
  }

  // Calculate progress to next rank
  const calculateRankProgress = (): number => {
    const currentRankIndex = pirateRanks.findIndex((rank) => rank.name === gameState.rank)

    if (currentRankIndex >= pirateRanks.length - 1) {
      return 100 // Max rank reached
    }

    const currentRankCost = currentRankIndex > 0 ? pirateRanks[currentRankIndex].cost : 0
    const nextRankCost = pirateRanks[currentRankIndex + 1].cost

    const progress = ((gameState.totalDoubloons - currentRankCost) / (nextRankCost - currentRankCost)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  // Calculate doubloons per second
  const calculateDoubloonsPerSecond = (): number => {
    return Math.floor(gameState.upgrades.reduce((total, upgrade) => total + upgrade.baseValue * upgrade.count, 0))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4" ref={containerRef}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="icon" onClick={() => setShowResetConfirm(true)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle>Pirate Adventure</CardTitle>
          <CardDescription>Sail the high seas, plunder treasures, and become a legendary pirate</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-amber-600 mb-2">{formatNumber(gameState.doubloons)} Doubloons</div>
            <div className="text-sm text-amber-500">{formatNumber(calculateDoubloonsPerSecond())} per second</div>
          </div>

          <div
            className="ship-container relative w-full aspect-video bg-gradient-to-b from-blue-500 to-blue-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
            onClick={handleClick}
          >
            <div className="text-8xl absolute z-10">⛵</div>
            <div className="absolute bottom-2 left-0 right-0 text-center text-blue-900 font-bold">
              Click to plunder treasures!
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Rank: {gameState.rank}</span>
              <span className="text-sm font-medium">
                {gameState.rank !== "Legendary Pirate"
                  ? `Next: ${pirateRanks[pirateRanks.findIndex((rank) => rank.name === gameState.rank) + 1]?.name}`
                  : "Max Rank"}
              </span>
            </div>
            <Progress value={calculateRankProgress()} className="h-2" />
          </div>

          <div className="space-y-3">
            {gameState.upgrades.map((upgrade) => {
              const cost = getUpgradeCost(upgrade)
              const canAfford = gameState.doubloons >= cost

              return (
                <div
                  key={upgrade.id}
                  className={`p-3 border rounded-lg flex justify-between items-center ${
                    canAfford ? "border-amber-500 hover:bg-amber-50 cursor-pointer" : "border-gray-300 opacity-70"
                  }`}
                  onClick={() => canAfford && purchaseUpgrade(upgrade.id)}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{upgrade.icon}</div>
                    <div>
                      <div className="font-medium">
                        {upgrade.name} <span className="text-sm font-normal">({upgrade.count})</span>
                      </div>
                      <div className="text-xs text-gray-500">{upgrade.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${canAfford ? "text-amber-600" : "text-gray-500"}`}>
                      {formatNumber(cost)} 💰
                    </div>
                    <div className="text-xs text-gray-500">+{upgrade.baseValue} per sec</div>
                  </div>
                </div>
              )
            })}
          </div>

          {showResetConfirm && (
            <div className="mt-6 p-4 border border-red-300 rounded-lg bg-red-50">
              <p className="text-center mb-3">Are you sure you want to reset all progress?</p>
              <div className="flex justify-center gap-3">
                <Button variant="destructive" onClick={resetGame}>
                  Yes, Reset
                </Button>
                <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
