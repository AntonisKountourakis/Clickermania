"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Gauge, Trophy, Zap, Fuel, Settings, Award, Truck, Car, MapPin } from "lucide-react"
import "../app/games/vehicle-clicker/vehicle-clicker.css"

// Racing-related messages for click effects
const RACING_MESSAGES = [
  "SPEED BOOST!",
  "TURBO!",
  "OVERTAKE!",
  "PERFECT DRIFT!",
  "NITRO!",
  "SMOOTH CORNER!",
  "NEW LAP RECORD!",
  "SLIPSTREAM!",
  "PERFECT SHIFT!",
  "TOP SPEED!",
]

// Racing-related ranks
const RACING_RANKS = [
  { name: "Novice Driver", threshold: 0 },
  { name: "Amateur Racer", threshold: 100 },
  { name: "Club Racer", threshold: 500 },
  { name: "Professional Racer", threshold: 1000 },
  { name: "Racing Expert", threshold: 5000 },
  { name: "National Champion", threshold: 10000 },
  { name: "International Star", threshold: 25000 },
  { name: "World Champion", threshold: 50000 },
  { name: "Racing Legend", threshold: 100000 },
  { name: "Speedway Immortal", threshold: 250000 },
]

const UPGRADES = [
  {
    id: "engine_power",
    name: "Engine Power",
    description: "Improve your vehicle's acceleration",
    basePrice: 10,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Zap className="h-4 w-4 mr-1" />,
  },
  {
    id: "fuel_efficiency",
    name: "Fuel Efficiency",
    description: "Optimize fuel consumption for better mileage",
    basePrice: 25,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Fuel className="h-4 w-4 mr-1" />,
  },
  {
    id: "tire_quality",
    name: "Tire Quality",
    description: "Upgrade your tires for better traction",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <Truck className="h-4 w-4 mr-1" />,
  },
  {
    id: "aerodynamics",
    name: "Aerodynamics",
    description: "Improve your vehicle's wind resistance",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Gauge className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "racing_chassis",
    name: "Racing Chassis",
    description: "Professional grade chassis for maximum performance",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο click power
    maxLevel: 10,
    icon: <Car className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "tire_quality", level: 5 } as const,
  },
  {
    id: "turbocharger",
    name: "Turbocharger",
    description: "Add a turbocharger to your engine",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% αύξηση στα auto clicks
    maxLevel: 5,
    icon: <Zap className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "aerodynamics", level: 5 } as const,
  },
  {
    id: "racing_circuit",
    name: "Racing Circuit",
    description: "Access to a professional racing track",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο συνολικό score
    maxLevel: 3,
    icon: <MapPin className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "engine_power", level: 15 } as const,
  },
  {
    id: "car_sponsorship",
    name: "Racing Sponsorship",
    description: "Get sponsored by major automotive brands",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% αύξηση σε όλα
    maxLevel: 5,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "aerodynamics", level: 10 } as const,
  },
  {
    id: "racing_team",
    name: "Racing Team",
    description: "Form your own professional racing team",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Settings className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "fuel_efficiency", level: 20 } as const,
  },
]

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

export default function VehicleClicker() {
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [tireQuality, setTireQuality] = useState(1)
  const [aerodynamics, setAerodynamics] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; message: string; isCritical: boolean }>
  >([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced
  const MAX_CLICK_EFFECTS = 10

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("vehicle-clicker-progress")
    if (savedProgress) {
      try {
        const {
          score: savedScore,
          clickPower: savedClickPower,
          autoClickers: savedAutoClickers,
          tireQuality: savedTireQuality,
          aerodynamics: savedAerodynamics,
          upgrades: savedUpgrades,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoClickers(savedAutoClickers || 0)
        setTireQuality(savedTireQuality || 1)
        setAerodynamics(savedAerodynamics || 1)
        setUpgrades(savedUpgrades || {})
        setAchievements(savedAchievements || [])

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && autoClickers > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          const offlineMiles = (timeDiff / 1000) * (autoClickers * 0.5 * tireQuality * aerodynamics)
          setScore((savedScore || 0) + offlineMiles)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlineMiles > 0) {
            setOfflineMessage({
              message: `Welcome back, Racer! Your team earned`,
              amount: offlineMiles,
            })
          }
        } else {
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
      tireQuality,
      aerodynamics,
      upgrades,
      achievements,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("vehicle-clicker-progress", JSON.stringify(progress))
  }, [score, clickPower, autoClickers, tireQuality, aerodynamics, upgrades, achievements])

  // Έλεγχος για νέα επιτεύγματα
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = []

      if (score >= 100 && !achievements.includes("Reach 100 miles")) {
        newAchievements.push("Reach 100 miles")
      }
      if (score >= 1000 && !achievements.includes("Reach 1,000 miles")) {
        newAchievements.push("Reach 1,000 miles")
      }
      if (score >= 10000 && !achievements.includes("Reach 10,000 miles")) {
        newAchievements.push("Reach 10,000 miles")
      }
      if (clickPower >= 10 && !achievements.includes("Engine Power Level 10")) {
        newAchievements.push("Engine Power Level 10")
      }
      if (autoClickers >= 10 && !achievements.includes("10 Fuel Efficiency")) {
        newAchievements.push("10 Fuel Efficiency")
      }
      if (combo >= 5 && !achievements.includes("5x Racing Combo")) {
        newAchievements.push("5x Racing Combo")
      }

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
        // Εμφάνιση του τελευταίου επιτεύγματος
        alert(`Achievement Unlocked: ${newAchievements[newAchievements.length - 1]}`)
      }
    }

    checkAchievements()
  }, [score, clickPower, autoClickers, combo, achievements])

  const handleClick = useCallback(() => {
    const now = Date.now()

    // Έλεγχος για combo (κλικ μέσα σε 1 δευτερόλεπτο)
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και το combo
    const comboMultiplier = 1 + combo * 0.1 // 10% επιπλέον ανά combo
    const baseValue = clickPower * tireQuality * aerodynamics
    const totalValue = baseValue * comboMultiplier

    // 5% πιθανότητα για critical hit (διπλάσιοι πόντοι)
    const isCritical = Math.random() < 0.05
    const finalValue = isCritical ? totalValue * 2 : totalValue

    setScore((prevScore) => prevScore + finalValue)

    // Επιλογή τυχαίου μηνύματος
    let message = RACING_MESSAGES[Math.floor(Math.random() * RACING_MESSAGES.length)]
    if (isCritical) {
      message = "NITRO BOOST!"
    } else if (combo > 1) {
      message = `${combo}x COMBO!`
    }

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    setClickEffects((prev) => {
      // Αν έχουμε ήδη πολλά εφέ, μην προσθέσουμε άλλο
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, message, isCritical }]
      }

      return [...prev, { id, x, y, message, isCritical }]
    })

    // Remove effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [clickPower, tireQuality, aerodynamics, combo, lastClickTime])

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
          if (upgradeId === "engine_power") {
            setClickPower((prevPower) => prevPower + upgrade.effect)
          } else if (upgradeId === "fuel_efficiency") {
            setAutoClickers((prevCount) => prevCount + 1)
          } else if (upgradeId === "tire_quality") {
            setTireQuality((prev) => prev + upgrade.effect)
          } else if (upgradeId === "aerodynamics") {
            setAerodynamics((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "racing_chassis") {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "turbocharger") {
            setAutoClickers((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "racing_circuit") {
            // Αύξηση όλων των παραμέτρων
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.5))
            setTireQuality((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "car_sponsorship") {
            // Αύξηση όλων των παραμέτρων
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.25))
            setTireQuality((prev) => prev * (1 + upgrade.effect * 0.25))
            setAerodynamics((prev) => prev * (1 + upgrade.effect * 0.25))
            setAutoClickers((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "racing_team") {
            // Διπλασιασμός όλων
            setClickPower((prev) => prev * 2)
            setTireQuality((prev) => prev * 2)
            setAerodynamics((prev) => prev * 2)
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
        setScore((prevScore) => prevScore + autoClickers * 0.5 * tireQuality * aerodynamics)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickers, tireQuality, aerodynamics])

  // Υπολογισμός τρέχοντος rank με βάση το score
  const getCurrentRank = () => {
    for (let i = RACING_RANKS.length - 1; i >= 0; i--) {
      if (score >= RACING_RANKS[i].threshold) {
        return RACING_RANKS[i].name
      }
    }
    return RACING_RANKS[0].name
  }

  // Υπολογισμός προόδου προς το επόμενο rank
  const getNextRankProgress = () => {
    const currentRank = getCurrentRank()
    const currentRankIndex = RACING_RANKS.findIndex((rank) => rank.name === currentRank)

    if (currentRankIndex === RACING_RANKS.length - 1) {
      return 100 // Ήδη στο μέγιστο rank
    }

    const currentThreshold = RACING_RANKS[currentRankIndex].threshold
    const nextThreshold = RACING_RANKS[currentRankIndex + 1].threshold
    const progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center game-bg vehicle-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-orange-900/50 pixel-border cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-orange-900 to-red-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white glow-text">Speed Racer</CardTitle>
            <CardDescription className="text-center text-white/80">
              Click to drive faster and earn more miles!
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
                  color: effect.isCritical ? "#ff5e5e" : "#ff6600",
                  fontSize: effect.isCritical ? "1.5rem" : "1.2rem",
                  textShadow: effect.isCritical ? "0 0 10px rgba(255, 94, 94, 0.7)" : "0 0 5px rgba(255, 102, 0, 0.7)",
                }}
              >
                {effect.message}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <p className="text-lg font-bold text-white glow-text">Miles: {formatMoney(score)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-orange-300">Rank: {getCurrentRank()}</p>
              </div>
            </div>

            {/* Rank progress bar */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getNextRankProgress()}%` }}></div>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <p className="stat-label">Engine Power</p>
                <p className="stat-value">{clickPower.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Fuel Efficiency</p>
                <p className="stat-value">{autoClickers}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Tire Quality</p>
                <p className="stat-value">x{tireQuality.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Aerodynamics</p>
                <p className="stat-value">x{aerodynamics.toFixed(1)}</p>
              </div>
            </div>

            {/* Combo indicator - διατηρεί σταθερό ύψος */}
            <div className="h-12 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600">
                  <p className="text-sm font-bold text-white">
                    {combo}x COMBO! <span className="text-xs">+{combo * 10}% bonus</span>
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleClick}
              className="click-button vehicle-button w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white font-bold text-2xl py-7 px-8 rounded-lg shadow-xl border-3 border-orange-800/30 my-4"
            >
              <Car className="h-8 w-8 mr-4" /> DRIVE FASTER
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

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-orange-900/50 pixel-border">
          <CardHeader className="bg-gradient-to-r from-orange-900 to-red-900 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white glow-text text-lg sm:text-xl">Racing Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-orange-600 font-bold" : "bg-orange-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-orange-600 font-bold" : "bg-orange-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Level up your racing experience" : "Pro racer upgrades for massive boosts"}
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
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-orange-900/30 transition-all ${
                        score >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-orange-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          score >= cost && !isMaxLevel ? "bg-gradient-to-r from-orange-600 to-red-700" : "bg-gray-700"
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
                  <p className="text-xs sm:text-sm text-orange-300">
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
                      className={`upgrade-button flex items-center justify-between p-2 sm:p-3 rounded-lg border border-orange-900/30 transition-all ${
                        isUnlocked
                          ? score >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-orange-300 flex items-center text-sm">
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
                            ? "bg-gradient-to-r from-orange-600 to-red-700"
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
            <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="game-subheading text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-orange-300">
                  Racing Progress!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-orange-300">
                  {formatMoney(offlineMessage.amount)} miles
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg hover:from-orange-700 hover:to-red-800 transition-all"
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
