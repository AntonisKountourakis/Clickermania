"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sword, Shield, Users, DogIcon as Horse, Crown, Scroll } from "lucide-react"
import { formatNumber } from "@/utils/click-effect-manager"
import type { JSX } from "react/jsx-runtime"
import { useCustomBack } from "@/hooks/use-custom-back"

// Define types for our game
interface UpgradeData {
  id: string
  name: string
  description: string
  cost: number
  value: number
  count: number
  iconType: string
}

interface Upgrade extends UpgradeData {
  icon: JSX.Element
}

// Game constants
const STORAGE_KEY = "troy-clicker-progress"
const CLICK_BASE_VALUE = 1
const AUTO_CLICK_INTERVAL = 1000 // 1 second

// Initial upgrades data without JSX elements
const initialUpgrades: UpgradeData[] = [
  {
    id: "soldiers",
    name: "Greek Soldiers",
    description: "Recruit basic infantry for your army",
    cost: 10,
    value: 1,
    count: 0,
    iconType: "users",
  },
  {
    id: "archers",
    name: "Archers",
    description: "Add ranged fighters to your forces",
    cost: 50,
    value: 5,
    count: 0,
    iconType: "bow",
  },
  {
    id: "chariots",
    name: "War Chariots",
    description: "Swift vehicles to dominate the battlefield",
    cost: 200,
    value: 15,
    count: 0,
    iconType: "chariot",
  },
  {
    id: "heroes",
    name: "Greek Heroes",
    description: "Legendary warriors like Achilles and Ajax",
    cost: 1000,
    value: 50,
    count: 0,
    iconType: "sword",
  },
  {
    id: "trojanHorse",
    name: "Trojan Horse",
    description: "The ultimate deception to breach Troy's walls",
    cost: 5000,
    value: 200,
    count: 0,
    iconType: "horse",
  },
  {
    id: "gods",
    name: "Divine Favor",
    description: "Gain the blessing of Olympian gods",
    cost: 20000,
    value: 1000,
    count: 0,
    iconType: "crown",
  },
]

// Helper function to get icon element based on type
function getIconElement(iconType: string): JSX.Element {
  switch (iconType) {
    case "users":
      return <Users className="h-5 w-5 text-amber-300" />
    case "bow":
      return <Scroll className="h-5 w-5 text-amber-300" />
    case "chariot":
      return <Shield className="h-5 w-5 text-amber-300" />
    case "sword":
      return <Sword className="h-5 w-5 text-amber-300" />
    case "horse":
      return <Horse className="h-5 w-5 text-amber-300" />
    case "crown":
      return <Crown className="h-5 w-5 text-amber-300" />
    default:
      return <Sword className="h-5 w-5 text-amber-300" />
  }
}

// Convert storage data to UI data with JSX elements
function upgradeDataToUpgrade(data: UpgradeData): Upgrade {
  return {
    ...data,
    icon: getIconElement(data.iconType),
  }
}

export default function TroyClicker() {
  // Add this line
  useCustomBack()

  // Game state
  const [points, setPoints] = useState(0)
  const [clickValue, setClickValue] = useState(CLICK_BASE_VALUE)
  const [autoClickValue, setAutoClickValue] = useState(0)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])
  const [shieldAnimation, setShieldAnimation] = useState("")
  const [nextGoal, setNextGoal] = useState(100)
  const [progress, setProgress] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load game state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const { points, upgrades } = JSON.parse(savedState)
        setPoints(points || 0)

        // Convert saved upgrade data to UI upgrades with icons
        const loadedUpgrades = upgrades.map(upgradeDataToUpgrade)
        setUpgrades(loadedUpgrades)

        // Calculate click value and auto click value
        calculateValues(loadedUpgrades)
      } else {
        // Initialize with default upgrades
        setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
      }
    } catch (error) {
      console.error("Error loading game state:", error)
      // Initialize with default upgrades on error
      setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    }

    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current)
      }
    }
  }, [])

  // Set up auto-clicking
  useEffect(() => {
    if (autoClickValue > 0) {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current)
      }

      autoClickIntervalRef.current = setInterval(() => {
        setPoints((prev) => prev + autoClickValue)
      }, AUTO_CLICK_INTERVAL)
    }

    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current)
      }
    }
  }, [autoClickValue])

  // Save game state to localStorage
  useEffect(() => {
    if (upgrades.length > 0) {
      try {
        // Convert upgrades to storage format (without JSX elements)
        const upgradesData: UpgradeData[] = upgrades.map(({ icon, ...rest }) => rest)

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            points,
            upgrades: upgradesData,
          }),
        )
      } catch (error) {
        console.error("Error saving game state:", error)
      }
    }
  }, [points, upgrades])

  // Update progress bar
  useEffect(() => {
    if (points >= nextGoal) {
      setNextGoal(nextGoal * 10)
    }
    setProgress((points / nextGoal) * 100)
  }, [points, nextGoal])

  // Calculate click value and auto click value based on upgrades
  const calculateValues = (currentUpgrades: Upgrade[]) => {
    let newClickValue = CLICK_BASE_VALUE
    let newAutoClickValue = 0

    currentUpgrades.forEach((upgrade) => {
      newAutoClickValue += upgrade.value * upgrade.count
    })

    // Boost click value based on total upgrades
    const totalUpgrades = currentUpgrades.reduce((sum, upgrade) => sum + upgrade.count, 0)
    newClickValue += Math.floor(totalUpgrades / 10)

    setClickValue(newClickValue)
    setAutoClickValue(newAutoClickValue)
  }

  // Handle clicking the shield
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Add points
    setPoints((prev) => prev + clickValue)

    // Animate the shield
    setShieldAnimation("shield-click")
    setTimeout(() => setShieldAnimation(""), 300)

    // Create particles at click position
    if (containerRef.current && particlesRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - containerRect.left
      const y = e.clientY - containerRect.top

      // Create particles
      const particles = ["⚔️", "🛡️", "🏛️", "🔱", "🏺", "🏇"]

      for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div")
        particle.className = "troy-particle"
        particle.textContent = particles[Math.floor(Math.random() * particles.length)]

        // Position at click coordinates
        particle.style.left = `${x}px`
        particle.style.top = `${y}px`

        // Random direction
        const angle = Math.random() * Math.PI * 2
        const distance = 50 + Math.random() * 100
        const duration = 500 + Math.random() * 1000

        particle.style.setProperty("--angle", `${angle}rad`)
        particle.style.setProperty("--distance", `${distance}px`)
        particle.style.setProperty("--duration", `${duration}ms`)

        particlesRef.current.appendChild(particle)

        // Remove after animation
        setTimeout(() => {
          if (particlesRef.current && particlesRef.current.contains(particle)) {
            particlesRef.current.removeChild(particle)
          }
        }, duration)
      }
    }
  }

  // Handle buying an upgrade
  const handleBuyUpgrade = (id: string) => {
    setUpgrades((prevUpgrades) => {
      const newUpgrades = prevUpgrades.map((upgrade) => {
        if (upgrade.id === id && points >= upgrade.cost) {
          const newCount = upgrade.count + 1
          const newCost = Math.floor(upgrade.cost * 1.15)

          // Deduct points
          setPoints((prev) => prev - upgrade.cost)

          return {
            ...upgrade,
            count: newCount,
            cost: newCost,
          }
        }
        return upgrade
      })

      // Recalculate values
      calculateValues(newUpgrades)

      return newUpgrades
    })
  }

  // Handle resetting the game
  const handleReset = () => {
    setPoints(0)
    setClickValue(CLICK_BASE_VALUE)
    setAutoClickValue(0)
    setNextGoal(100)
    setProgress(0)
    setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen troy-bg relative w-full overflow-hidden flex flex-col items-center justify-center py-8 px-4"
    >
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none"></div>

      <div className="columns-container"></div>
      <div className="troy-overlay"></div>

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-700/50 hover:shadow-xl transition-all cursor-pointer"
          onClick={handleClick}
        >
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-amber-100">Troy: Battle for Glory</CardTitle>
            <CardDescription className="text-center text-amber-200/80">
              Conquer the ancient city of Troy
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 flex flex-col items-center">
            <div className="shield-container mb-4">
              <div className={`shield ${shieldAnimation}`}></div>
            </div>

            <div className="stats space-y-2 w-full">
              <div className="flex justify-between items-center">
                <span className="text-amber-200 font-semibold">Glory Points:</span>
                <span className="text-amber-100 font-bold text-xl">{formatNumber(points)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-200 font-semibold">Per Click:</span>
                <span className="text-amber-100">{formatNumber(clickValue)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-200 font-semibold">Per Second:</span>
                <span className="text-amber-100">{formatNumber(autoClickValue)}</span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-200">Progress to next goal</span>
                  <span className="text-amber-100">
                    {formatNumber(points)} / {formatNumber(nextGoal)}
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-amber-950" indicatorClassName="bg-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-700/50">
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-center text-amber-100">Upgrades</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-amber-800/30 ${
                    points >= upgrade.cost
                      ? "cursor-pointer hover:bg-gray-700/50 hover:border-amber-600/50"
                      : "opacity-70"
                  }`}
                  onClick={() => points >= upgrade.cost && handleBuyUpgrade(upgrade.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-amber-900/50 rounded-full">{upgrade.icon}</div>
                    <div>
                      <div className="font-semibold text-amber-100">
                        {upgrade.name} {upgrade.count > 0 && <span className="text-amber-400">x{upgrade.count}</span>}
                      </div>
                      <div className="text-xs text-amber-300/70">{upgrade.description}</div>
                      <div className="text-xs text-amber-400/90">+{upgrade.value} glory/sec</div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyUpgrade(upgrade.id)
                    }}
                    disabled={points < upgrade.cost}
                    className="bg-amber-700 hover:bg-amber-600 text-white"
                    size="sm"
                  >
                    {formatNumber(upgrade.cost)}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
