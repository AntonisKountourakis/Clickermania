"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Gamepad2, Trophy, Zap, Cpu, Joystick, Laptop, Globe, Tv, Award } from "lucide-react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

const UPGRADES = [
  {
    id: "click_power",
    name: "Gaming Skills",
    description: "Improve your gaming abilities",
    basePrice: 10,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Gamepad2 className="h-4 w-4 mr-1" />,
  },
  {
    id: "auto_clicker",
    name: "Gaming Bot",
    description: "Automate your gaming progress",
    basePrice: 25,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Cpu className="h-4 w-4 mr-1" />,
  },
  {
    id: "gaming_gear",
    name: "Gaming Gear",
    description: "Upgrade your gaming equipment",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <Joystick className="h-4 w-4 mr-1" />,
  },
  {
    id: "streaming",
    name: "Streaming Setup",
    description: "Start streaming your gameplay",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Zap className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "gaming_pc",
    name: "Pro Gaming PC",
    description: "High-end gaming computer for maximum performance",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο click power
    maxLevel: 10,
    icon: <Laptop className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "gaming_gear", level: 5 } as const,
  },
  {
    id: "esports_team",
    name: "eSports Team",
    description: "Form your own professional gaming team",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% αύξηση στα auto clicks
    maxLevel: 5,
    icon: <Globe className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "streaming", level: 5 } as const,
  },
  {
    id: "gaming_tournament",
    name: "Gaming Tournament",
    description: "Host your own gaming tournaments",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο συνολικό score
    maxLevel: 3,
    icon: <Trophy className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "click_power", level: 15 } as const,
  },
  {
    id: "gaming_sponsorship",
    name: "Gaming Sponsorship",
    description: "Get sponsored by major gaming brands",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% αύξηση σε όλα
    maxLevel: 5,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "streaming", level: 10 } as const,
  },
  {
    id: "gaming_network",
    name: "Gaming Network",
    description: "Create your own gaming content network",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Tv className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "auto_clicker", level: 20 } as const,
  },
]

// Gaming-related messages for click effects
const GAMING_MESSAGES = [
  "LEVEL UP!",
  "CRITICAL HIT!",
  "COMBO!",
  "HEADSHOT!",
  "ACHIEVEMENT!",
  "BONUS!",
  "PERFECT!",
  "ULTRA KILL!",
  "LEGENDARY!",
  "HIGH SCORE!",
]

// Gaming-related ranks
const GAMING_RANKS = [
  { name: "Newbie", threshold: 0 },
  { name: "Casual", threshold: 100 },
  { name: "Regular", threshold: 500 },
  { name: "Skilled", threshold: 1000 },
  { name: "Expert", threshold: 5000 },
  { name: "Master", threshold: 10000 },
  { name: "Grandmaster", threshold: 25000 },
  { name: "Legend", threshold: 50000 },
  { name: "Pro Gamer", threshold: 100000 },
  { name: "E-Sports Champion", threshold: 250000 },
]

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const ClickerGame = () => {
  const { isMobile, reducedAnimations } = useMobileOptimization()

  // Limit effects on mobile
  const MAX_CLICK_EFFECTS = isMobile ? 3 : 5
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [gamingGear, setGamingGear] = useState(1)
  const [streaming, setStreaming] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; message: string; isCritical: boolean }>
  >([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced
  const gamePrefix = "clicker-game"

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("clicker-game-progress")
    if (savedProgress) {
      try {
        const {
          score: savedScore,
          clickPower: savedClickPower,
          autoClickers: savedAutoClickers,
          gamingGear: savedGamingGear,
          streaming: savedStreaming,
          upgrades: savedUpgrades,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoClickers(savedAutoClickers || 0)
        setGamingGear(savedGamingGear || 1)
        setStreaming(savedStreaming || 1)
        setUpgrades(savedUpgrades || {})
        setAchievements(savedAchievements || [])

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)

        // Debug offline progress calculation
        console.log(`Offline progress calculation for Gaming Clicker:`)
        console.log(`- Last update: ${new Date(lastUpdate).toLocaleString()}`)
        console.log(`- Current time: ${new Date(now).toLocaleString()}`)
        console.log(`- Time difference: ${timeDiff / 1000} seconds`)
        console.log(`- Auto clickers: ${savedAutoClickers}`)
        console.log(`- Gaming gear: ${savedGamingGear}`)
        console.log(`- Streaming: ${savedStreaming}`)

        if (timeDiff > 0 && savedAutoClickers > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          const offlinePoints = (timeDiff / 1000) * (savedAutoClickers * 0.5 * savedGamingGear * savedStreaming)
          console.log(`- Offline points earned: ${offlinePoints}`)

          // Update score with offline earnings
          const newScore = (savedScore || 0) + offlinePoints
          setScore(newScore)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlinePoints > 0) {
            setOfflineMessage({
              message: `Welcome back, Gamer! Your bots earned`,
              amount: offlinePoints,
            })

            // Ενημερώστε το localStorage αμέσως με τις νέες τιμές για να ενημερωθεί η κεντρική σελίδα
            const immediateProgress = {
              score: newScore,
              clickPower: savedClickPower || 1,
              autoClickers: savedAutoClickers || 0,
              gamingGear: savedGamingGear || 1,
              streaming: savedStreaming || 1,
              upgrades: savedUpgrades || {},
              achievements: savedAchievements || [],
              lastUpdate: Date.now(),
            }
            localStorage.setItem("clicker-game-progress", JSON.stringify(immediateProgress))
          }
        } else {
          console.log(`- No offline points earned: autoClickers=${savedAutoClickers}, timeDiff=${timeDiff}`)
          setScore(savedScore || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      score,
      clickPower,
      autoClickers,
      gamingGear,
      streaming,
      upgrades,
      achievements,
      lastUpdate: Date.now(), // Ενημερώνεται με κάθε αποθήκευση
    }

    console.log(`Saving progress for Gaming Clicker:`, progress)
    localStorage.setItem("clicker-game-progress", JSON.stringify(progress))

    // Προσθήκη event για να ενημερώσει την κεντρική σελίδα
    const updateEvent = new Event("gameProgressUpdated")
    window.dispatchEvent(updateEvent)
  }, [score, clickPower, autoClickers, gamingGear, streaming, upgrades, achievements])

  // Έλεγχος για νέα επιτεύγματα
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = []

      if (score >= 100 && !achievements.includes("Reach 100 points")) {
        newAchievements.push("Reach 100 points")
      }
      if (score >= 1000 && !achievements.includes("Reach 1,000 points")) {
        newAchievements.push("Reach 1,000 points")
      }
      if (score >= 10000 && !achievements.includes("Reach 10,000 points")) {
        newAchievements.push("Reach 10,000 points")
      }
      if (clickPower >= 10 && !achievements.includes("Gaming Skills Level 10")) {
        newAchievements.push("Gaming Skills Level 10")
      }
      if (autoClickers >= 10 && !achievements.includes("10 Gaming Bots")) {
        newAchievements.push("10 Gaming Bots")
      }
      if (combo >= 5 && !achievements.includes("5x Combo")) {
        newAchievements.push("5x Combo")
      }

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
        // Εμφάνιση του τελευταίου επιτεύγματος
        alert(`Achievement Unlocked: ${newAchievements[newAchievements.length - 1]}`)
      }
    }

    checkAchievements()
  }, [score, clickPower, autoClickers, combo, achievements])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Play click sound
    try {
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement
      if (clickSound) {
        clickSound.currentTime = 0
        clickSound.play().catch((err) => console.debug("Click sound play failed:", err))
      }
    } catch (err) {
      console.error("Error playing click sound:", err)
    }

    // Update the score
    setScore((prevScore) => {
      const newScore = prevScore + clickPower * gamingGear * streaming
      localStorage.setItem(`${gamePrefix}_score`, newScore.toString())
      return newScore
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
    let message = GAMING_MESSAGES[Math.floor(Math.random() * GAMING_MESSAGES.length)]
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

      // Έλεγχος αν το upgrade είναι ξεκλειδωμένο (μόνο για προχωρημένα)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as (typeof ADVANCED_UPGRADES)[0]
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Δεν έχει ξεκλειδωθεί ακόμα
          }
        }
      }

      if (score >= cost) {
        setScore((prevScore) => prevScore - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "click_power") {
            setClickPower((prevPower) => prevPower + upgrade.effect)
          } else if (upgradeId === "auto_clicker") {
            setAutoClickers((prevCount) => prevCount + 1)
          } else if (upgradeId === "gaming_gear") {
            setGamingGear((prev) => prev + upgrade.effect)
          } else if (upgradeId === "streaming") {
            setStreaming((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "gaming_pc") {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "esports_team") {
            setAutoClickers((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "gaming_tournament") {
            // Αύξηση όλων των παραμέτρων
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.5))
            setGamingGear((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "gaming_sponsorship") {
            // Αύξηση όλων των παραμέτρων
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.25))
            setGamingGear((prev) => prev * (1 + upgrade.effect * 0.25))
            setStreaming((prev) => prev * (1 + upgrade.effect * 0.25))
            setAutoClickers((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "gaming_network") {
            // Διπλασιασμός όλων
            setClickPower((prev) => prev * 2)
            setGamingGear((prev) => prev * 2)
            setStreaming((prev) => prev * 2)
            setAutoClickers((prev) => prev * 2)
          }
        }
      }
    },
    [score, upgrades],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickers > 0) {
        setScore((prevScore) => prevScore + autoClickers * 0.5 * gamingGear * streaming)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickers, gamingGear, streaming])

  // Υπολογισμός τρέχοντος rank με βάση το score
  const getCurrentRank = () => {
    for (let i = GAMING_RANKS.length - 1; i >= 0; i--) {
      if (score >= GAMING_RANKS[i].threshold) {
        return GAMING_RANKS[i].name
      }
    }
    return GAMING_RANKS[0].name
  }

  // Υπολογισμός προόδου προς το επόμενο rank
  const getNextRankProgress = () => {
    const currentRank = getCurrentRank()
    const currentRankIndex = GAMING_RANKS.findIndex((rank) => rank.name === currentRank)

    if (currentRankIndex === GAMING_RANKS.length - 1) {
      return 100 // Ήδη στο μέγιστο rank
    }

    const currentThreshold = GAMING_RANKS[currentRankIndex].threshold
    const nextThreshold = GAMING_RANKS[currentRankIndex + 1].threshold
    const progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center clicker-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden ${reducedAnimations ? "reduced-animation" : ""}`}
    >
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={(e) => handleClick(e)}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-purple-900/50 pixel-border cursor-pointer hover:shadow-xl transition-all game-container"
        >
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white glow-text">Gaming Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Click to earn gaming points and level up!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className={`absolute pointer-events-none font-bold ${reducedAnimations ? "animate-fadeOut-simple" : "animate-fadeOut"}`}
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  color: effect.isCritical ? "#ff5e5e" : "#7b61ff",
                  fontSize: effect.isCritical ? (isMobile ? "1.2rem" : "1.5rem") : isMobile ? "1rem" : "1.2rem",
                  textShadow: effect.isCritical ? "0 0 5px rgba(255, 94, 94, 0.7)" : "0 0 3px rgba(123, 97, 255, 0.7)",
                }}
              >
                {effect.message}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <p className="text-lg font-bold text-white glow-text">Score: {formatMoney(score)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-purple-300">Rank: {getCurrentRank()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            <div className="game-progress-bar">
              <div className="game-progress-fill" style={{ width: `${getNextRankProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Gaming Skills</p>
                <p className="text-sm font-medium text-purple-300">{clickPower.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Gaming Bots</p>
                <p className="text-sm font-medium text-purple-300">{autoClickers}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Gaming Gear</p>
                <p className="text-sm font-medium text-purple-300">x{gamingGear.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Streaming</p>
                <p className="text-sm font-medium text-purple-300">x{streaming.toFixed(1)}</p>
              </div>
            </div>

            {/* Combo indicator - διατηρεί σταθερό ύψος */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <p className="text-sm font-bold text-white">
                    {combo}x COMBO! <span className="text-xs">+{combo * 10}% bonus</span>
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={(e) => handleClick(e)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-2xl py-7 px-8 rounded-lg shadow-xl border-3 border-indigo-800/30 my-4"
            >
              <Gamepad2 className="h-8 w-8 mr-4" /> PLAY GAME
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

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-purple-900/50 pixel-border">
          <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white glow-text text-lg sm:text-xl">Gaming Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-indigo-600 font-bold" : "bg-indigo-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-indigo-600 font-bold" : "bg-indigo-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Level up your gaming experience" : "Pro gamer upgrades for massive boosts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Σελίδα 1: Τα βασικά upgrades
              <>
                {UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => score >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all ${
                        score >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          score >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-indigo-600 to-purple-700"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatMoney(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Σελίδα 2: Προχωρημένα upgrades
              <>
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-purple-300">
                    Advanced upgrades unlock powerful multipliers. Each requires certain basic upgrades.
                  </p>
                </div>

                {ADVANCED_UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  // Έλεγχος αν το upgrade είναι ξεκλειδωμένο
                  const reqId = upgrade.unlockRequirement.id
                  const reqLevel = upgrade.unlockRequirement.level
                  const currentReqLevel = upgrades[reqId] || 0
                  const isUnlocked = currentReqLevel >= reqLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => isUnlocked && score >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all ${
                        isUnlocked
                          ? score >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-300 flex items-center text-sm">
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
                          isUnlocked && score >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-indigo-600 to-purple-700"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatMoney(cost)})`}
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
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
                  Gaming Progress!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
                  {formatMoney(offlineMessage.amount)} points
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all"
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

export default ClickerGame
