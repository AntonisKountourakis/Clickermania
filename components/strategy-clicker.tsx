"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Crown, Sword, Shield, Castle, Flag, Coins, Building, Users, Scroll } from "lucide-react"
import { formatNumber } from "@/utils/format-number"

// Kingdom-themed messages for click effects
const KINGDOM_MESSAGES = [
  "GLORY!",
  "VICTORY!",
  "CONQUEST!",
  "POWER!",
  "WEALTH!",
  "HONOR!",
  "KINGDOM!",
  "ROYAL!",
  "EMPIRE!",
  "THRONE!",
]

// Kingdom ranks
const KINGDOM_RANKS = [
  { name: "Peasant", threshold: 0 },
  { name: "Squire", threshold: 100 },
  { name: "Knight", threshold: 500 },
  { name: "Baron", threshold: 1000 },
  { name: "Count", threshold: 5000 },
  { name: "Duke", threshold: 10000 },
  { name: "Prince", threshold: 25000 },
  { name: "King", threshold: 50000 },
  { name: "Emperor", threshold: 100000 },
  { name: "Legendary Ruler", threshold: 250000 },
]

const UPGRADES = [
  {
    id: "click_power",
    name: "Royal Guards",
    description: "Train elite guards to collect more gold",
    basePrice: 10,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Sword className="h-4 w-4 mr-1" />,
  },
  {
    id: "auto_clicker",
    name: "Tax Collectors",
    description: "Hire collectors to gather gold automatically",
    basePrice: 25,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Coins className="h-4 w-4 mr-1" />,
  },
  {
    id: "kingdom_size",
    name: "Territory",
    description: "Expand your kingdom's borders",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <Flag className="h-4 w-4 mr-1" />,
  },
  {
    id: "royal_treasury",
    name: "Royal Treasury",
    description: "Build a treasury to store more gold",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Building className="h-4 w-4 mr-1" />,
  },
]

// Advanced upgrades
const ADVANCED_UPGRADES = [
  {
    id: "castle",
    name: "Grand Castle",
    description: "Build an impressive castle to boost your kingdom's power",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% increase in click power
    maxLevel: 10,
    icon: <Castle className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "kingdom_size", level: 5 } as const,
  },
  {
    id: "army",
    name: "Royal Army",
    description: "Raise a powerful army to conquer new lands",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% increase in auto clicks
    maxLevel: 5,
    icon: <Shield className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "royal_treasury", level: 5 } as const,
  },
  {
    id: "alliance",
    name: "Royal Alliance",
    description: "Form alliances with neighboring kingdoms",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% increase in total score
    maxLevel: 3,
    icon: <Users className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "click_power", level: 15 } as const,
  },
  {
    id: "royal_decree",
    name: "Royal Decree",
    description: "Issue powerful decrees to boost your kingdom's economy",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% increase in everything
    maxLevel: 5,
    icon: <Scroll className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "royal_treasury", level: 10 } as const,
  },
  {
    id: "divine_right",
    name: "Divine Right",
    description: "Claim divine right to rule and double all your powers",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Double all yields
    maxLevel: 1,
    icon: <Crown className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "auto_clicker", level: 20 } as const,
  },
]

const MAX_CLICK_EFFECTS = 5

const StrategyClicker = () => {
  const [gold, setGold] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [kingdomSize, setKingdomSize] = useState(1)
  const [royalTreasury, setRoyalTreasury] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; message: string; isCritical: boolean }>
  >([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 for Basic, 2 for Advanced
  const gamePrefix = "strategy-clicker"

  // Load progress from localStorage and calculate offline progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("strategy-clicker-progress")
    if (savedProgress) {
      try {
        const {
          gold: savedGold,
          clickPower: savedClickPower,
          autoClickers: savedAutoClickers,
          kingdomSize: savedKingdomSize,
          royalTreasury: savedRoyalTreasury,
          upgrades: savedUpgrades,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoClickers(savedAutoClickers || 0)
        setKingdomSize(savedKingdomSize || 1)
        setRoyalTreasury(savedRoyalTreasury || 1)
        setUpgrades(savedUpgrades || {})
        setAchievements(savedAchievements || [])

        // Calculate offline progress
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && autoClickers > 0) {
          // Calculate points earned offline (in seconds)
          const offlinePoints = (timeDiff / 1000) * (autoClickers * 0.5 * kingdomSize * royalTreasury)
          setGold((savedGold || 0) + offlinePoints)

          // Show message for offline earnings
          if (offlinePoints > 0) {
            setOfflineMessage({
              message: `Welcome back, Your Majesty! Your kingdom earned`,
              amount: offlinePoints,
            })
          }
        } else {
          setGold(savedGold || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Save progress to localStorage when relevant states change
  useEffect(() => {
    const progress = {
      gold,
      clickPower,
      autoClickers,
      kingdomSize,
      royalTreasury,
      upgrades,
      achievements,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("strategy-clicker-progress", JSON.stringify(progress))
  }, [gold, clickPower, autoClickers, kingdomSize, royalTreasury, upgrades, achievements])

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = []

      if (gold >= 100 && !achievements.includes("Reach 100 gold")) {
        newAchievements.push("Reach 100 gold")
      }
      if (gold >= 1000 && !achievements.includes("Reach 1,000 gold")) {
        newAchievements.push("Reach 1,000 gold")
      }
      if (gold >= 10000 && !achievements.includes("Reach 10,000 gold")) {
        newAchievements.push("Reach 10,000 gold")
      }
      if (clickPower >= 10 && !achievements.includes("Royal Guards Level 10")) {
        newAchievements.push("Royal Guards Level 10")
      }
      if (autoClickers >= 10 && !achievements.includes("10 Tax Collectors")) {
        newAchievements.push("10 Tax Collectors")
      }
      if (combo >= 5 && !achievements.includes("5x Combo")) {
        newAchievements.push("5x Combo")
      }

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
        // Show the latest achievement
        alert(`Achievement Unlocked: ${newAchievements[newAchievements.length - 1]}`)
      }
    }

    checkAchievements()
  }, [gold, clickPower, autoClickers, combo, achievements])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Update the score
    setGold((prevGold) => {
      const newGold = prevGold + clickPower * kingdomSize * royalTreasury
      localStorage.setItem(`${gamePrefix}_gold`, newGold.toString())
      return newGold
    })

    // Handle combo and other game mechanics
    const now = Date.now()
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Select random message
    let message = KINGDOM_MESSAGES[Math.floor(Math.random() * KINGDOM_MESSAGES.length)]
    const isCritical = Math.random() < 0.05

    if (isCritical) {
      message = "CRITICAL HIT!"
    } else if (combo > 1) {
      message = `${combo}x COMBO!`
    }

    // Add click effect for messages only (not numbers)
    const id = Date.now()
    const x = Math.random() * 80 + 10
    const y = Math.random() * 80 + 10

    setClickEffects((prev) => {
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, message, isCritical }]
      }
      return [...prev, { id, x, y, message, isCritical }]
    })

    // Remove effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }

  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Check if the upgrade is unlocked (only for advanced)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as (typeof ADVANCED_UPGRADES)[0]
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Not unlocked yet
          }
        }
      }

      if (gold >= cost) {
        setGold((prevGold) => prevGold - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Apply effects of basic upgrades
        if (!isAdvanced) {
          if (upgradeId === "click_power") {
            setClickPower((prevPower) => prevPower + upgrade.effect)
          } else if (upgradeId === "auto_clicker") {
            setAutoClickers((prevCount) => prevCount + 1)
          } else if (upgradeId === "kingdom_size") {
            setKingdomSize((prev) => prev + upgrade.effect)
          } else if (upgradeId === "royal_treasury") {
            setRoyalTreasury((prev) => prev + upgrade.effect)
          }
        }
        // Apply effects of advanced upgrades
        else {
          if (upgradeId === "castle") {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "army") {
            setAutoClickers((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "alliance") {
            // Increase all parameters
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.5))
            setKingdomSize((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "royal_decree") {
            // Increase all parameters
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.25))
            setKingdomSize((prev) => prev * (1 + upgrade.effect * 0.25))
            setRoyalTreasury((prev) => prev * (1 + upgrade.effect * 0.25))
            setAutoClickers((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "divine_right") {
            // Double everything
            setClickPower((prev) => prev * 2)
            setKingdomSize((prev) => prev * 2)
            setRoyalTreasury((prev) => prev * 2)
            setAutoClickers((prev) => prev * 2)
          }
        }
      }
    },
    [gold, upgrades],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickers > 0) {
        setGold((prevGold) => prevGold + autoClickers * 0.5 * kingdomSize * royalTreasury)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickers, kingdomSize, royalTreasury])

  // Calculate current rank based on gold
  const getCurrentRank = () => {
    for (let i = KINGDOM_RANKS.length - 1; i >= 0; i--) {
      if (gold >= KINGDOM_RANKS[i].threshold) {
        return KINGDOM_RANKS[i].name
      }
    }
    return KINGDOM_RANKS[0].name
  }

  // Calculate progress to next rank
  const getNextRankProgress = () => {
    const currentRank = getCurrentRank()
    const currentRankIndex = KINGDOM_RANKS.findIndex((rank) => rank.name === currentRank)

    if (currentRankIndex === KINGDOM_RANKS.length - 1) {
      return 100 // Already at max rank
    }

    const currentThreshold = KINGDOM_RANKS[currentRankIndex].threshold
    const nextThreshold = KINGDOM_RANKS[currentRankIndex + 1].threshold
    const progress = ((gold - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center strategy-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={(e) => handleClick(e)}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-900/50 pixel-border cursor-pointer hover:shadow-xl transition-all game-container"
        >
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white glow-text">Kingdom Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Click to earn gold and expand your kingdom!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                  color: effect.isCritical ? "#ff5e5e" : "#ffc107",
                  fontSize: effect.isCritical ? "1.5rem" : "1.2rem",
                  textShadow: effect.isCritical ? "0 0 10px rgba(255, 94, 94, 0.7)" : "0 0 5px rgba(255, 193, 7, 0.7)",
                }}
              >
                {effect.message}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                <p className="text-lg font-bold text-white glow-text">Gold: {formatNumber(gold)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-amber-300">Rank: {getCurrentRank()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            <div className="game-progress-bar">
              <div className="game-progress-fill" style={{ width: `${getNextRankProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Royal Guards</p>
                <p className="text-sm font-medium text-amber-300">{clickPower.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Tax Collectors</p>
                <p className="text-sm font-medium text-amber-300">{autoClickers}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Territory Size</p>
                <p className="text-sm font-medium text-amber-300">x{kingdomSize.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Royal Treasury</p>
                <p className="text-sm font-medium text-amber-300">x{royalTreasury.toFixed(1)}</p>
              </div>
            </div>

            {/* Combo indicator - maintains constant height */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-800">
                  <p className="text-sm font-bold text-white">
                    {combo}x COMBO! <span className="text-xs">+{combo * 10}% bonus</span>
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={(e) => handleClick(e)}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-2xl py-7 px-8 rounded-lg shadow-xl border-3 border-amber-800/30 my-4"
            >
              <Crown className="h-8 w-8 mr-4" /> CLAIM GOLD
            </Button>

            {/* Achievements section */}
            {achievements.length > 0 && (
              <div className="mt-4 p-2 rounded-lg bg-gray-800/50">
                <p className="text-sm font-medium text-white mb-1">Recent Achievements:</p>
                <div className="text-xs text-gray-300 max-h-20 overflow-y-auto">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center py-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-amber-900/50 pixel-border">
          <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white glow-text text-lg sm:text-xl">Kingdom Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-amber-600 font-bold" : "bg-amber-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-amber-600 font-bold" : "bg-amber-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Expand your kingdom's power" : "Royal upgrades for massive boosts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Page 1: Basic upgrades
              <>
                {UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => gold >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-amber-900/30 transition-all ${
                        gold >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-amber-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          gold >= cost && !isMaxLevel ? "bg-gradient-to-r from-amber-600 to-amber-800" : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Page 2: Advanced upgrades
              <>
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-amber-300">
                    Advanced upgrades unlock powerful multipliers. Each requires certain basic upgrades.
                  </p>
                </div>

                {ADVANCED_UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  // Check if the upgrade is unlocked
                  const reqId = upgrade.unlockRequirement.id
                  const reqLevel = upgrade.unlockRequirement.level
                  const currentReqLevel = upgrades[reqId] || 0
                  const isUnlocked = currentReqLevel >= reqLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => isUnlocked && gold >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-amber-900/30 transition-all ${
                        isUnlocked
                          ? gold >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-amber-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">
                          {isUnlocked
                            ? `Level: ${currentLevel}`
                            : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                        </p>
                      </div>
                      <div
                        className={`${
                          isUnlocked && gold >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-amber-600 to-amber-800"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>

        {/* Offline Progress Message */}
        {offlineMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
            <div className="relative bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300">
                  Kingdom Progress!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300">
                  {formatNumber(offlineMessage.amount)} gold
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all"
                  >
                    Collect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StrategyClicker
