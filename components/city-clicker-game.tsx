"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/utils/click-effect-manager"
import { Building, Home, ShoppingBag, Factory, Bus, Landmark, Building2 } from "lucide-react"
import type React from "react"

// Define the interface for upgrade data (for storage)
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

// Define the interface for upgrades (for UI)
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

// Function to get icon element based on type
function getIconElement(iconType: string): JSX.Element {
  switch (iconType) {
    case "residential":
      return <Home className="h-5 w-5 text-amber-500" />
    case "commercial":
      return <ShoppingBag className="h-5 w-5 text-yellow-500" />
    case "industrial":
      return <Factory className="h-5 w-5 text-orange-500" />
    case "transportation":
      return <Bus className="h-5 w-5 text-red-500" />
    case "cityhall":
      return <Landmark className="h-5 w-5 text-amber-600" />
    case "skyscraper":
      return <Building2 className="h-5 w-5 text-yellow-600" />
    default:
      return <Building className="h-5 w-5 text-orange-400" />
  }
}

// Convert upgrade data to upgrade
function upgradeDataToUpgrade(data: UpgradeData): Upgrade {
  return {
    ...data,
    icon: getIconElement(data.iconType),
  }
}

// Initial upgrades data
const initialUpgrades: UpgradeData[] = [
  {
    id: "residential",
    name: "Residential Buildings",
    description: "Build houses for your citizens",
    cost: 10,
    value: 1,
    count: 0,
    iconType: "residential",
    automatic: false,
  },
  {
    id: "commercial",
    name: "Commercial Districts",
    description: "Create shopping areas for your city",
    cost: 100,
    value: 5,
    count: 0,
    iconType: "commercial",
    automatic: false,
  },
  {
    id: "industrial",
    name: "Industrial Zones",
    description: "Establish factories that generate income",
    cost: 1000,
    value: 10,
    count: 0,
    iconType: "industrial",
    automatic: true,
  },
  {
    id: "transportation",
    name: "Public Transportation",
    description: "Build a transit system for your city",
    cost: 10000,
    value: 100,
    count: 0,
    iconType: "transportation",
    automatic: true,
  },
  {
    id: "cityhall",
    name: "City Hall",
    description: "Establish a government center",
    cost: 100000,
    value: 1000,
    count: 0,
    iconType: "cityhall",
    automatic: true,
  },
  {
    id: "skyscraper",
    name: "Skyscrapers",
    description: "Build impressive high-rise buildings",
    cost: 1000000,
    value: 10000,
    count: 0,
    iconType: "skyscraper",
    automatic: true,
  },
]

// Click effect emojis
const CLICK_EMOJIS = ["🏙️", "🏢", "🏬", "🏣", "🏪", "🏫", "🏨", "🚌", "🚗", "👷", "🏗️"]

export default function CityClicker() {
  const [points, setPoints] = useState(0)
  const [clickValue, setClickValue] = useState(1)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])
  const [cityAnimation, setCityAnimation] = useState("")
  const [cityLevel, setCityLevel] = useState(1)
  const [nextLevelPoints, setNextLevelPoints] = useState(100)
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number; size: number }[]>([])
  const [levelUpEffect, setLevelUpEffect] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load game state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("city-clicker-progress")
      if (savedState) {
        const { points: savedPoints, upgrades: savedUpgrades, cityLevel: savedCityLevel } = JSON.parse(savedState)
        setPoints(savedPoints)
        setUpgrades(savedUpgrades.map(upgradeDataToUpgrade))
        setCityLevel(savedCityLevel)

        // Calculate click value based on upgrades
        let newClickValue = 1
        savedUpgrades.forEach((upgrade: UpgradeData) => {
          if (!upgrade.automatic) {
            newClickValue += upgrade.value * upgrade.count
          }
        })
        setClickValue(newClickValue)
      } else {
        // Initialize with default values
        setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
      }
    } catch (error) {
      console.error("Error loading game state:", error)
      // Initialize with default values if there's an error
      setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    }
    setIsLoading(false)
  }, [])

  // Save game state to localStorage
  useEffect(() => {
    if (isLoading) return

    try {
      // Convert upgrades to a serializable format
      const upgradesData = upgrades.map((upgrade) => ({
        id: upgrade.id,
        name: upgrade.name,
        description: upgrade.description,
        cost: upgrade.cost,
        value: upgrade.value,
        count: upgrade.count,
        iconType: upgrade.id, // Use id as iconType
        automatic: upgrade.automatic,
      }))

      localStorage.setItem(
        "city-clicker-progress",
        JSON.stringify({
          points,
          upgrades: upgradesData,
          cityLevel,
        }),
      )
    } catch (error) {
      console.error("Error saving game state:", error)
    }
  }, [points, upgrades, cityLevel, isLoading])

  // Calculate next level points
  useEffect(() => {
    setNextLevelPoints(Math.pow(10, cityLevel + 1) * 10)
  }, [cityLevel])

  // Check for level up
  useEffect(() => {
    if (points >= nextLevelPoints) {
      setCityLevel((prev) => prev + 1)
      setCityAnimation("city-level-up")
      setLevelUpEffect(true)

      // Create level up celebration particles
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Create multiple particles for celebration
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * 100
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance

          const newParticle = {
            id: particleIdRef.current++,
            emoji: CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)],
            x,
            y,
            size: Math.random() * 30 + 20,
          }

          setParticles((prev) => [...prev, newParticle])

          // Remove particle after animation
          setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
          }, 2000)
        }
      }

      setTimeout(() => {
        setCityAnimation("")
        setLevelUpEffect(false)
      }, 2000)
    }
  }, [points, nextLevelPoints])

  // Automatic points from upgrades
  useEffect(() => {
    const interval = setInterval(() => {
      let automaticPoints = 0
      upgrades.forEach((upgrade) => {
        if (upgrade.automatic) {
          automaticPoints += upgrade.value * upgrade.count
        }
      })

      if (automaticPoints > 0) {
        setPoints((prev) => prev + automaticPoints)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [upgrades])

  // Handle click on the city
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Add points
    setPoints((prev) => prev + clickValue)

    // Create particle effect
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Create a new particle
      const newParticle = {
        id: particleIdRef.current++,
        emoji: CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)],
        x,
        y,
        size: Math.random() * 20 + 20,
      }

      setParticles((prev) => [...prev, newParticle])

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 1000)
    }

    // Animate the city
    setCityAnimation("city-click")
    setTimeout(() => setCityAnimation(""), 300)
  }

  // Handle buying an upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)
    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]
    if (points < upgrade.cost) return

    // Update points
    setPoints((prev) => prev - upgrade.cost)

    // Update upgrades
    const newUpgrades = [...upgrades]
    newUpgrades[upgradeIndex] = {
      ...upgrade,
      count: upgrade.count + 1,
      cost: Math.floor(upgrade.cost * 1.15), // Increase cost for next purchase
    }
    setUpgrades(newUpgrades)

    // Update click value if it's a click upgrade
    if (!upgrade.automatic) {
      setClickValue((prev) => prev + upgrade.value)
    }
  }

  // Handle reset
  const handleReset = () => {
    setPoints(0)
    setClickValue(1)
    setCityLevel(1)
    setUpgrades(initialUpgrades.map(upgradeDataToUpgrade))
    localStorage.removeItem("city-clicker-progress")
  }

  // Card styles - warm sunset theme
  const cardStyles = {
    cardBg: "bg-amber-900/20 backdrop-blur-md",
    cardBorder: "border-amber-500/30",
    headerBg: "bg-gradient-to-r from-amber-700 to-orange-600",
    titleColor: "text-amber-50",
    descColor: "text-amber-100",
  }

  return (
    <div className="min-h-screen city-bg relative overflow-hidden">
      <div className="floating-clouds"></div>
      <div className="city-skyline"></div>

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10 p-4">
        <Card
          className={`shadow-xl ${cardStyles.cardBg} ${cardStyles.cardBorder} hover:shadow-2xl transition-all duration-300 cursor-pointer animate-fadeIn`}
          onClick={handleClick}
        >
          <CardHeader className={`${cardStyles.headerBg} rounded-t-lg`}>
            <CardTitle className={`text-2xl font-bold text-center ${cardStyles.titleColor}`}>City Builder</CardTitle>
            <CardDescription className={`text-center ${cardStyles.descColor}`}>
              Build your dream metropolis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-b from-amber-900/70 to-orange-800/70 backdrop-blur-md rounded-b-lg">
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold ${cardStyles.titleColor} mb-2 text-glow`}>
                {formatNumber(points)} Points
              </div>
              <div className={`text-sm ${cardStyles.descColor}`}>+{formatNumber(clickValue)} per click</div>
            </div>

            <div className="mb-4">
              <div className={`flex justify-between text-sm ${cardStyles.descColor} mb-1`}>
                <span>City Level: {cityLevel}</span>
                <span>
                  {formatNumber(points)} / {formatNumber(nextLevelPoints)}
                </span>
              </div>
              <Progress
                value={(points / nextLevelPoints) * 100}
                className="h-2.5 rounded-full"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                }}
              />
            </div>

            <div
              ref={containerRef}
              className={`city-container ${cityAnimation} relative h-48 rounded-lg flex items-center justify-center overflow-hidden ${
                levelUpEffect ? "level-up-glow" : ""
              }`}
            >
              <div className="city-buildings"></div>
              <div className={`city-icon text-7xl ${cityAnimation} z-10`}>
                {cityLevel <= 2 ? "🏡" : cityLevel <= 4 ? "🏘️" : cityLevel <= 6 ? "🏢" : cityLevel <= 8 ? "🏙️" : "🌆"}
              </div>

              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute pointer-events-none particle-animation"
                  style={{
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                    fontSize: `${particle.size}px`,
                  }}
                >
                  {particle.emoji}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-xl ${cardStyles.cardBg} ${cardStyles.cardBorder} animate-fadeIn-delay`}>
          <CardHeader className={`${cardStyles.headerBg} rounded-t-lg`}>
            <CardTitle className={`text-xl font-bold text-center ${cardStyles.titleColor}`}>
              City Developments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-gradient-to-b from-amber-900/70 to-orange-800/70 backdrop-blur-md rounded-b-lg">
            <div className="space-y-3">
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    points >= upgrade.cost
                      ? "bg-amber-800/50 backdrop-blur-sm border border-amber-500/30 cursor-pointer hover:bg-amber-700/60 hover:scale-102 transform"
                      : "bg-gray-900/40 backdrop-blur-sm border border-gray-800/30"
                  }`}
                  onClick={() => points >= upgrade.cost && handleBuyUpgrade(upgrade.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-amber-900/70 backdrop-blur-md">{upgrade.icon}</div>
                    <div>
                      <div className={`font-medium ${cardStyles.titleColor}`}>
                        {upgrade.name}{" "}
                        {upgrade.count > 0 && <span className={cardStyles.descColor}>x{upgrade.count}</span>}
                      </div>
                      <div className={`text-xs ${cardStyles.descColor}`}>{upgrade.description}</div>
                      <div className={`text-xs ${cardStyles.descColor} opacity-80`}>
                        {upgrade.automatic
                          ? `+${formatNumber(upgrade.value)} points/sec`
                          : `+${formatNumber(upgrade.value)} per click`}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyUpgrade(upgrade.id)
                    }}
                    disabled={points < upgrade.cost}
                    className="bg-amber-600 hover:bg-amber-500 text-white transition-all duration-300"
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
