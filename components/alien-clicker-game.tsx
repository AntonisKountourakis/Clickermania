"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SpaceIcon as Alien, Satellite, Zap, Radio, Microscope, Rocket, Atom, Globe, RotateCcw } from "lucide-react"
import { ClickEffectManager } from "@/utils/click-effect-manager"
import type React from "react"

// Define interfaces for our game data
interface UpgradeData {
  id: string
  name: string
  description: string
  cost: number
  value: number
  count: number
  iconType: string
  automatic: boolean
}

interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  value: number
  count: number
  icon: JSX.Element
  automatic: boolean
}

interface GameState {
  points: number
  clickValue: number
  autoClickValue: number
  upgrades: UpgradeData[]
}

// Initial upgrades data without JSX elements (for storage)
const initialUpgrades: UpgradeData[] = [
  {
    id: "probe",
    name: "Probe",
    description: "Send probes to gather more resources",
    cost: 15,
    value: 1,
    count: 0,
    iconType: "satellite",
    automatic: false,
  },
  {
    id: "raygun",
    name: "Ray Gun",
    description: "Zap resources with advanced alien technology",
    cost: 100,
    value: 5,
    count: 0,
    iconType: "zap",
    automatic: false,
  },
  {
    id: "communicator",
    name: "Communicator",
    description: "Contact the mothership for assistance",
    cost: 500,
    value: 10,
    count: 0,
    iconType: "radio",
    automatic: false,
  },
  {
    id: "analyzer",
    name: "DNA Analyzer",
    description: "Study Earth specimens for valuable data",
    cost: 3000,
    value: 25,
    count: 0,
    iconType: "microscope",
    automatic: false,
  },
  {
    id: "scout",
    name: "Scout Ship",
    description: "Automatically collects resources from nearby planets",
    cost: 10000,
    value: 50,
    count: 0,
    iconType: "rocket",
    automatic: true,
  },
  {
    id: "mothership",
    name: "Mothership",
    description: "A massive ship that generates substantial resources",
    cost: 50000,
    value: 200,
    count: 0,
    iconType: "atom",
    automatic: true,
  },
  {
    id: "terraformer",
    name: "Terraformer",
    description: "Transform planets to extract maximum resources",
    cost: 200000,
    value: 1000,
    count: 0,
    iconType: "globe",
    automatic: true,
  },
]

// Helper function to get the icon element based on the icon type
function getIconElement(iconType: string): JSX.Element {
  switch (iconType) {
    case "satellite":
      return <Satellite className="h-5 w-5" />
    case "zap":
      return <Zap className="h-5 w-5" />
    case "radio":
      return <Radio className="h-5 w-5" />
    case "microscope":
      return <Microscope className="h-5 w-5" />
    case "rocket":
      return <Rocket className="h-5 w-5" />
    case "atom":
      return <Atom className="h-5 w-5" />
    case "globe":
      return <Globe className="h-5 w-5" />
    default:
      return <Alien className="h-5 w-5" />
  }
}

// Convert UpgradeData to Upgrade (add JSX elements)
function upgradeDataToUpgrade(data: UpgradeData): Upgrade {
  return {
    ...data,
    icon: getIconElement(data.iconType),
  }
}

export default function AlienClicker() {
  // Game state
  const [points, setPoints] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [autoClickValue, setAutoClickValue] = useState(0)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])
  const [nextMilestone, setNextMilestone] = useState(100)
  const [progress, setProgress] = useState(0)
  const [alienAnimation, setAlienAnimation] = useState("")
  const [showReset, setShowReset] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const clickEffectManager = useRef<ClickEffectManager | null>(null)
  const autoClickInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize click effect manager
  useEffect(() => {
    if (containerRef.current) {
      clickEffectManager.current = new ClickEffectManager(containerRef.current, {
        particleCount: 10,
        particleImages: ["👽", "🛸", "✨", "💫", "🌌"],
        gravity: 0.1,
        particleLifetime: 2000,
        spread: 80,
        initialVelocity: { min: 5, max: 15 },
      })
    }

    return () => {
      if (clickEffectManager.current) {
        clickEffectManager.current.cleanup()
      }
      if (autoClickInterval.current) {
        clearInterval(autoClickInterval.current)
      }
    }
  }, [])

  // Load game state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("alien-clicker-progress")
      if (savedState) {
        const parsedState: GameState = JSON.parse(savedState)
        setPoints(parsedState.points)
        setClickValue(parsedState.clickValue)
        setAutoClickValue(parsedState.autoClickValue)
        setUpgrades(parsedState.upgrades.map(upgradeDataToUpgrade))
      } else {
        // Initialize with default upgrades
        setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
      }
    } catch (error) {
      console.error("Error loading game state:", error)
      // Initialize with default upgrades if there's an error
      setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    }
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    if (upgrades.length > 0) {
      try {
        // Convert upgrades to storage format (without JSX elements)
        const upgradesData: UpgradeData[] = upgrades.map((upgrade) => ({
          id: upgrade.id,
          name: upgrade.name,
          description: upgrade.description,
          cost: upgrade.cost,
          value: upgrade.value,
          count: upgrade.count,
          iconType: upgrade.id === "probe" ? "satellite" : upgrade.id,
          automatic: upgrade.automatic,
        }))

        const gameState: GameState = {
          points,
          clickValue,
          autoClickValue,
          upgrades: upgradesData,
        }

        localStorage.setItem("alien-clicker-progress", JSON.stringify(gameState))
      } catch (error) {
        console.error("Error saving game state:", error)
      }
    }
  }, [points, clickValue, autoClickValue, upgrades])

  // Auto-click functionality
  useEffect(() => {
    if (autoClickValue > 0) {
      autoClickInterval.current = setInterval(() => {
        setPoints((prevPoints) => prevPoints + autoClickValue)
      }, 1000)
    }

    return () => {
      if (autoClickInterval.current) {
        clearInterval(autoClickInterval.current)
      }
    }
  }, [autoClickValue])

  // Update progress bar
  useEffect(() => {
    if (points >= nextMilestone) {
      setNextMilestone(nextMilestone * 10)
    }
    setProgress((points / nextMilestone) * 100)
  }, [points, nextMilestone])

  // Handle click on the alien
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setPoints(points + clickValue)
    setAlienAnimation("alien-pulse")
    setTimeout(() => setAlienAnimation(""), 300)

    if (clickEffectManager.current) {
      // Use the actual click coordinates instead of the center
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        clickEffectManager.current.createParticles(x, y)
      }
    }
  }

  // Handle buying an upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const updatedUpgrades = upgrades.map((upgrade) => {
      if (upgrade.id === upgradeId) {
        const newCount = upgrade.count + 1
        const newCost = Math.floor(upgrade.cost * Math.pow(1.15, newCount))

        // Update click value or auto-click value based on upgrade type
        if (upgrade.automatic) {
          setAutoClickValue((prev) => prev + upgrade.value)
        } else {
          setClickValue((prev) => prev + upgrade.value)
        }

        return {
          ...upgrade,
          count: newCount,
          cost: newCost,
        }
      }
      return upgrade
    })

    setPoints(points - upgrades.find((u) => u.id === upgradeId)!.cost)
    setUpgrades(updatedUpgrades)
  }

  // Reset game
  const handleReset = () => {
    setPoints(0)
    setClickValue(1)
    setAutoClickValue(0)
    setNextMilestone(100)
    setProgress(0)
    setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    localStorage.removeItem("alien-clicker-progress")
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toString()
    }
  }

  return (
    <div className="min-h-screen alien-bg p-4 relative" ref={containerRef}>
      <div className="stars"></div>
      <div className="ufo-container"></div>

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-green-500/50 hover:shadow-xl transition-all cursor-pointer"
          onClick={handleClick}
        >
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-green-100">Alien Invasion</CardTitle>
            <CardDescription className="text-center text-green-200/80">
              Take over the Earth, one click at a time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{formatNumber(points)} Resources</div>
              <div className="text-sm text-green-300/80">
                +{formatNumber(clickValue)} per click | +{formatNumber(autoClickValue)} per second
              </div>
            </div>

            <div className="relative">
              <Progress value={progress} className="h-2 bg-gray-700" />
              <div className="text-xs text-green-400 mt-1">Next milestone: {formatNumber(nextMilestone)}</div>
            </div>

            <div className={`alien-container ${alienAnimation}`}>
              <div className="ufo">
                <div className="ufo-top"></div>
                <div className="ufo-bottom">
                  <div className="ufo-light"></div>
                </div>
                <div className="alien">👽</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-green-500/50">
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-green-100">Alien Technology</CardTitle>
            <CardDescription className="text-green-200/80">Upgrade your invasion capabilities</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-green-800/30 ${
                    points >= upgrade.cost ? "cursor-pointer hover:bg-gray-700/50" : "opacity-70"
                  }`}
                  onClick={() => {
                    if (points >= upgrade.cost) {
                      handleBuyUpgrade(upgrade.id)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-green-400">
                      {upgrade.icon}
                    </div>
                    <div>
                      <div className="font-medium text-green-300">
                        {upgrade.name} <span className="text-xs text-green-500">x{upgrade.count}</span>
                      </div>
                      <div className="text-xs text-green-400/70">{upgrade.description}</div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation() // Prevent triggering the parent div's onClick
                      handleBuyUpgrade(upgrade.id)
                    }}
                    disabled={points < upgrade.cost}
                    className="bg-green-700 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    {formatNumber(upgrade.cost)}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-green-400 border-green-700 hover:bg-green-900/50"
              onClick={() => setShowReset(!showReset)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Game
            </Button>
            {showReset && (
              <Button variant="destructive" size="sm" onClick={handleReset}>
                Confirm Reset
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
