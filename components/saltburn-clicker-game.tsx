"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatNumber } from "@/utils/format-number"

interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  baseMultiplier: number
  level: number
}

// Define format description functions outside the component to avoid serialization issues
const getUpgradeDescription = (upgrade: Upgrade): string => {
  switch (upgrade.id) {
    case "pool-party":
    case "mansion-wings":
    case "art-collection":
      return `Generates ${formatNumber(Math.floor(upgrade.baseMultiplier * upgrade.level))} wealth per second`
    case "social-connections":
      return `Increases click value by ${formatNumber(Math.floor(upgrade.baseMultiplier * upgrade.level))}`
    case "family-influence":
      return `Multiplies all income by ${formatNumber(Math.floor(1 + upgrade.baseMultiplier * upgrade.level * 0.01))}x`
    default:
      return ""
  }
}

export default function SaltburnClicker() {
  // Initial upgrades configuration
  const initialUpgrades: Upgrade[] = [
    {
      id: "pool-party",
      name: "Pool Party",
      description: "Host extravagant pool parties",
      baseCost: 10,
      baseMultiplier: 1,
      level: 0,
    },
    {
      id: "mansion-wings",
      name: "Mansion Wing",
      description: "Expand the estate with new wings",
      baseCost: 50,
      baseMultiplier: 5,
      level: 0,
    },
    {
      id: "art-collection",
      name: "Art Collection",
      description: "Invest in prestigious art pieces",
      baseCost: 200,
      baseMultiplier: 10,
      level: 0,
    },
    {
      id: "social-connections",
      name: "Social Connections",
      description: "Expand your elite social network",
      baseCost: 1000,
      baseMultiplier: 20,
      level: 0,
    },
    {
      id: "family-influence",
      name: "Family Influence",
      description: "Leverage family connections",
      baseCost: 10000,
      baseMultiplier: 100,
      level: 0,
    },
  ]

  // Game state
  const [currency, setCurrency] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saltburn-currency")
      return saved ? Math.floor(Number.parseFloat(saved)) : 0
    }
    return 0
  })

  const [prestige, setPrestige] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saltburn-prestige")
      return saved ? Number.parseInt(saved) : 0
    }
    return 0
  })

  const [clickValue, setClickValue] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saltburn-click-value")
      return saved ? Math.floor(Number.parseFloat(saved)) : 1
    }
    return 1
  })

  const [autoIncome, setAutoIncome] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saltburn-auto-income")
      return saved ? Math.floor(Number.parseFloat(saved)) : 0
    }
    return 0
  })

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saltburn-upgrades")
      return saved ? JSON.parse(saved) : initialUpgrades
    }
    return initialUpgrades
  })

  const [messages, setMessages] = useState<{ text: string; amount: number; id: number }[]>([])
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const nextMessageId = useRef(0)

  // Calculate upgrade cost based on level
  const calculateUpgradeCost = (upgrade: Upgrade): number => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level))
  }

  // Calculate multiplier for an upgrade
  const calculateUpgradeMultiplier = (upgrade: Upgrade): number => {
    // Special multiplier for the family influence upgrade
    if (upgrade.id === "family-influence") {
      return Math.floor(1 + upgrade.level * upgrade.baseMultiplier * 0.01)
    }
    return Math.floor(upgrade.level * upgrade.baseMultiplier)
  }

  // Calculate total auto income
  const calculateTotalAutoIncome = (): number => {
    let totalIncome = 0
    let familyMultiplier = 1

    // Find family influence multiplier
    const familyUpgrade = upgrades.find((u) => u.id === "family-influence")
    if (familyUpgrade) {
      familyMultiplier = Math.floor(1 + familyUpgrade.level * familyUpgrade.baseMultiplier * 0.01)
    }

    // Add income from pool party, mansion wings, and art collection
    const incomeUpgrades = ["pool-party", "mansion-wings", "art-collection"]
    incomeUpgrades.forEach((id) => {
      const upgrade = upgrades.find((u) => u.id === id)
      if (upgrade) {
        totalIncome += Math.floor(upgrade.level * upgrade.baseMultiplier)
      }
    })

    // Apply prestige multiplier
    const prestigeMultiplier = 1 + prestige * 0.1

    return Math.floor(totalIncome * familyMultiplier * prestigeMultiplier)
  }

  // Calculate click value
  const calculateClickValue = (): number => {
    const baseClickValue = 1
    let socialMultiplier = 0
    let familyMultiplier = 1

    // Find social connections bonus
    const socialUpgrade = upgrades.find((u) => u.id === "social-connections")
    if (socialUpgrade) {
      socialMultiplier = Math.floor(socialUpgrade.level * socialUpgrade.baseMultiplier)
    }

    // Find family influence multiplier
    const familyUpgrade = upgrades.find((u) => u.id === "family-influence")
    if (familyUpgrade) {
      familyMultiplier = Math.floor(1 + familyUpgrade.level * familyUpgrade.baseMultiplier * 0.01)
    }

    // Apply prestige multiplier
    const prestigeMultiplier = 1 + prestige * 0.2

    return Math.floor((baseClickValue + socialMultiplier) * familyMultiplier * prestigeMultiplier)
  }

  // Handle main click action
  const handleClick = () => {
    const newClickValue = calculateClickValue()
    setCurrency((prev) => Math.floor(prev + newClickValue))

    // Add click message with unique ID
    const id = nextMessageId.current++
    setMessages((prev) => [...prev, { text: "💰", amount: newClickValue, id }])

    // Remove message after animation completes
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }, 1500)
  }

  // Handle buying an upgrade
  const buyUpgrade = (upgradeId: string) => {
    setUpgrades((prevUpgrades) => {
      const newUpgrades = [...prevUpgrades]
      const upgradeIndex = newUpgrades.findIndex((u) => u.id === upgradeId)

      if (upgradeIndex !== -1) {
        const upgrade = newUpgrades[upgradeIndex]
        const cost = calculateUpgradeCost(upgrade)

        if (currency >= cost) {
          // Deduct cost
          setCurrency((prev) => Math.floor(prev - cost))

          // Increment level
          newUpgrades[upgradeIndex] = {
            ...upgrade,
            level: upgrade.level + 1,
          }

          // Update auto income and click value
          setAutoIncome(calculateTotalAutoIncome())
          setClickValue(calculateClickValue())

          // Add upgrade message
          const id = nextMessageId.current++
          setMessages((prev) => [...prev, { text: "⬆️", amount: cost, id }])

          // Remove message after animation
          setTimeout(() => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id))
          }, 1500)
        }
      }

      return newUpgrades
    })
  }

  // Handle prestige reset
  const resetForPrestige = () => {
    // Check if player has enough currency to prestige
    if (currency < 1000000) {
      return
    }

    // Calculate prestige gain based on current wealth
    const prestigeGain = Math.floor(Math.log10(currency / 1000000) + 1)

    // Reset game but keep prestige level
    setCurrency(0)
    setAutoIncome(0)
    setClickValue(1)
    setUpgrades(initialUpgrades)
    setPrestige((prev) => prev + prestigeGain)
    setShowPrestigeConfirm(false)

    // Add prestige message
    const id = nextMessageId.current++
    setMessages((prev) => [...prev, { text: "⚜️", amount: prestigeGain, id }])

    // Remove message after animation
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }, 2000)
  }

  // Auto income effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (autoIncome > 0) {
        setCurrency((prev) => Math.floor(prev + autoIncome / 10)) // Divide by 10 for smoother increments (10 updates per second)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [autoIncome])

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("saltburn-currency", Math.floor(currency).toString())
      localStorage.setItem("saltburn-prestige", prestige.toString())
      localStorage.setItem("saltburn-click-value", Math.floor(clickValue).toString())
      localStorage.setItem("saltburn-auto-income", Math.floor(autoIncome).toString())
      localStorage.setItem("saltburn-upgrades", JSON.stringify(upgrades))
    }
  }, [currency, prestige, clickValue, autoIncome, upgrades])

  // Update auto income and click value when upgrades change
  useEffect(() => {
    setAutoIncome(calculateTotalAutoIncome())
    setClickValue(calculateClickValue())
  }, [upgrades, prestige])

  // Calculate progress towards next prestige
  const prestigeProgress = Math.min(100, (currency / 1000000) * 100)

  return (
    <div className="p-4 sm:p-6 fixed-container overflow-auto bg-saltburn-bg min-h-screen">
      <div className="text-center mb-4 pt-14">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-600">
          Saltburn Estate
        </h1>
        <p className="text-amber-200">Wealth: {formatNumber(Math.floor(currency))}</p>
        {prestige > 0 && <p className="text-xs text-amber-100">Prestige Level: {prestige}</p>}
      </div>

      <div className="fixed-height-container relative z-10 max-w-lg mx-auto" onClick={handleClick}>
        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-900/50 hover:shadow-xl transition-all main-card mb-4 relative">
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              Wealth Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 cursor-pointer hover:scale-105 transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#765c1e" />
                <circle cx="50" cy="50" r="35" fill="#c4a24c" />
                <path d="M50 15 L55 35 L75 35 L60 45 L65 65 L50 55 L35 65 L40 45 L25 35 L45 35 Z" fill="#f0c94d" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {formatNumber(Math.floor(clickValue))}
              </div>
            </div>

            <Button className="w-full bg-amber-800 hover:bg-amber-700 text-white border-amber-600">
              Generate Wealth
            </Button>

            <div className="mt-4 text-amber-100">
              <p>Passive Income: {formatNumber(Math.floor(autoIncome))} per second</p>
              <p>Click Value: {formatNumber(Math.floor(clickValue))}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-900/50 upgrades-card"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Estate Upgrades</CardTitle>
              {currency >= 1000000 && (
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm border-amber-400 text-amber-200 hover:bg-amber-900 hover:text-amber-100"
                  onClick={() => setShowPrestigeConfirm(true)}
                >
                  Prestige ({Math.floor(Math.log10(currency / 1000000) + 1)})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 space-y-3 upgrades-container">
            {showPrestigeConfirm ? (
              <div className="bg-gray-800 p-3 rounded-lg border border-amber-600 text-center">
                <p className="text-amber-200 mb-2">
                  Reset all progress for {Math.floor(Math.log10(currency / 1000000) + 1)} prestige points?
                </p>
                <p className="text-xs text-amber-300 mb-3">
                  Each point gives +10% passive income and +20% click value.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="destructive" size="sm" onClick={resetForPrestige}>
                    Confirm
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPrestigeConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {upgrades.map((upgrade) => {
                  const cost = calculateUpgradeCost(upgrade)
                  const canAfford = currency >= cost
                  const multiplier = calculateUpgradeMultiplier(upgrade)

                  return (
                    <div
                      key={upgrade.id}
                      className={`bg-gray-800 p-3 rounded-lg ${canAfford ? "border border-amber-600 hover:bg-gray-700 cursor-pointer" : "border border-gray-700 opacity-80"}`}
                      onClick={() => canAfford && buyUpgrade(upgrade.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-amber-300">
                            {upgrade.name} <span className="text-xs text-amber-500">Lvl {upgrade.level}</span>
                          </h3>
                          <p className="text-xs text-gray-300">{upgrade.description}</p>
                          <p className="text-xs text-amber-200">{getUpgradeDescription(upgrade)}</p>
                        </div>
                        <div className={`text-right ${canAfford ? "text-amber-400" : "text-gray-400"}`}>
                          {formatNumber(Math.floor(cost))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {!showPrestigeConfirm && (
              <div className="mt-2">
                <p className="text-xs text-amber-200 mb-1">Prestige Progress: {Math.floor(prestigeProgress)}%</p>
                <Progress value={prestigeProgress} className="h-2 bg-gray-700" indicatorClassName="bg-amber-500" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Click/Message Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="absolute text-white font-bold animate-float-up"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${50 + Math.random() * 20}%`,
              opacity: 1,
              transform: "scale(1)",
              animation: "float-up 1.5s forwards, fade-out 1.5s forwards",
            }}
          >
            <span className="mr-1">{msg.text}</span>
            <span className="text-amber-300">+{formatNumber(Math.floor(msg.amount))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
