"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Crown, Sword, Shield, Coins, Users, Building, Flag, Gem, TrendingUp } from "lucide-react"
import { formatNumber } from "@/utils/format-number"
import "../app/games/kingdom-clicker/kingdom-clicker.css"

// Τύποι αναβαθμίσεων
interface UpgradeType {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  icon: React.ReactNode
}

interface AdvancedUpgradeType extends UpgradeType {
  unlockRequirement: {
    id: string
    level: number
  }
}

interface ClickEffectType {
  id: number
  x: number
  y: number
  text: string
  isCritical: boolean
}

const UPGRADES: UpgradeType[] = [
  {
    id: "knights",
    name: "Royal Knights",
    description: "Train knights to increase your kingdom's power",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Sword className="h-4 w-4 mr-1" />,
  },
  {
    id: "peasants",
    name: "Loyal Peasants",
    description: "Recruit peasants to work for your kingdom automatically",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "armory",
    name: "Royal Armory",
    description: "Improve your knights' equipment",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Shield className="h-4 w-4 mr-1" />,
  },
  {
    id: "treasury",
    name: "Kingdom Treasury",
    description: "Establish a treasury to boost your kingdom's wealth",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Coins className="h-4 w-4 mr-1" />,
  },
]

const ADVANCED_UPGRADES: AdvancedUpgradeType[] = [
  {
    id: "royal_guard",
    name: "Royal Guard",
    description: "Elite soldiers to protect your kingdom",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2,
    maxLevel: 10,
    icon: <Shield className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "knights", level: 10 },
  },
  {
    id: "villages",
    name: "Village Network",
    description: "Establish villages across your lands",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3,
    maxLevel: 5,
    icon: <Building className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "peasants", level: 15 },
  },
  {
    id: "royal_decree",
    name: "Royal Decree",
    description: "Issue powerful decrees to strengthen your rule",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4,
    maxLevel: 3,
    icon: <Flag className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "armory", level: 15 },
  },
  {
    id: "trade_routes",
    name: "Trade Routes",
    description: "Establish trade routes with neighboring kingdoms",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5,
    maxLevel: 3,
    icon: <Gem className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "treasury", level: 10 },
  },
  {
    id: "royal_alliance",
    name: "Royal Alliance",
    description: "Form a powerful alliance with other kingdoms",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0,
    maxLevel: 1,
    icon: <Crown className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "treasury", level: 15 },
  },
]

const KINGDOM_MESSAGES = [
  "👑 For the crown!",
  "⚔️ Victory!",
  "🛡️ Defended!",
  "💰 Treasure!",
  "🏰 Expanded!",
  "🧙‍♂️ Magic!",
  "🐎 Cavalry!",
  "🏹 Archers!",
]

const KINGDOM_RANKS = [
  { name: "Squire", threshold: 0, icon: "🛡️" },
  { name: "Knight", threshold: 100, icon: "⚔️" },
  { name: "Baron", threshold: 500, icon: "🏰" },
  { name: "Count", threshold: 2000, icon: "👑" },
  { name: "Duke", threshold: 10000, icon: "🧙‍♂️" },
  { name: "Prince", threshold: 50000, icon: "🐎" },
  { name: "King", threshold: 200000, icon: "👑" },
  { name: "Emperor", threshold: 1000000, icon: "🌟" },
]

export default function KingdomClickerGame() {
  // Κατάσταση παιχνιδιού
  const [mainStat, setMainStat] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoGeneration, setAutoGeneration] = useState(0)
  const [totalMainStat, setTotalMainStat] = useState(0)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<ClickEffectType[]>([])
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 for Basic, 2 for Advanced
  const [clickAnimation, setClickAnimation] = useState(false)
  const MAX_CLICK_EFFECTS = 10

  // Φόρτωση κατάστασης παιχνιδιού από localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("kingdom-clicker-progress")
    if (savedProgress) {
      try {
        const {
          mainStat: savedMainStat,
          clickPower: savedClickPower,
          autoGeneration: savedAutoGeneration,
          totalMainStat: savedTotalMainStat,
          upgrades: savedUpgrades,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoGeneration(savedAutoGeneration || 0)
        setTotalMainStat(savedTotalMainStat || 0)
        setUpgrades(savedUpgrades || {})
        setAchievements(savedAchievements || [])

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)

        if (timeDiff > 0 && savedAutoGeneration > 0) {
          // Υπολογισμός πόρων που κερδήθηκαν ενώ ο χρήστης ήταν εκτός (σε δευτερόλεπτα)
          const offlineResources = (timeDiff / 1000) * savedAutoGeneration

          // Ενημέρωση του main stat με τα offline κέρδη
          const newMainStat = (savedMainStat || 0) + offlineResources
          setMainStat(newMainStat)

          // Ενημέρωση του total main stat επίσης
          const newTotalMainStat = (savedTotalMainStat || 0) + offlineResources
          setTotalMainStat(newTotalMainStat)

          // Εμφάνιση μηνύματος καλωσορίσματος με τα offline κέρδη
          if (offlineResources > 0) {
            setOfflineMessage({
              message: `While you were away, your kingdom earned`,
              amount: offlineResources,
            })

            // Ενημερώστε το localStorage αμέσως με τις νέες τιμές
            const immediateProgress = {
              mainStat: newMainStat,
              clickPower: savedClickPower || 1,
              autoGeneration: savedAutoGeneration || 0,
              totalMainStat: newTotalMainStat,
              upgrades: savedUpgrades || {},
              achievements: savedAchievements || [],
              lastUpdate: Date.now(),
            }
            localStorage.setItem("kingdom-clicker-progress", JSON.stringify(immediateProgress))
          }
        } else {
          setMainStat(savedMainStat || 0)
        }
      } catch (error) {
        console.error(`Error loading saved progress for kingdom-clicker:`, error)
        // Αν υπάρχει σφάλμα, θέστε προεπιλεγμένες τιμές
        setMainStat(0)
        setClickPower(1)
        setAutoGeneration(0)
        setTotalMainStat(0)
        setUpgrades({})
        setAchievements([])
      }
    }
  }, [])

  // Αποθήκευση κατάστασης παιχνιδιού στο localStorage
  useEffect(() => {
    const progress = {
      mainStat,
      clickPower,
      autoGeneration,
      totalMainStat,
      upgrades,
      achievements,
      lastUpdate: Date.now(),
    }

    localStorage.setItem("kingdom-clicker-progress", JSON.stringify(progress))

    // Προσθήκη event για να ενημερώσει την κεντρική σελίδα
    const updateEvent = new Event("gameProgressUpdated")
    window.dispatchEvent(updateEvent)
  }, [mainStat, clickPower, autoGeneration, totalMainStat, upgrades, achievements])

  // Αυτόματη παραγωγή πόρων
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoGeneration > 0) {
        setMainStat((prev) => prev + autoGeneration)
        setTotalMainStat((prev) => prev + autoGeneration)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoGeneration])

  // Χειρισμός κλικ
  const handleClick = useCallback(() => {
    // Αναπαραγωγή ήχου κλικ
    try {
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement
      if (clickSound) {
        clickSound.currentTime = 0
        clickSound.play().catch((err) => console.debug("Click sound play failed:", err))
      }
    } catch (err) {
      console.error("Error playing click sound:", err)
    }

    const now = Date.now()

    // Έλεγχος για streak (κλικ εντός 1 δευτερολέπτου)
    if (now - lastClickTime < 1000) {
      setCombo((prev) => Math.min(prev + 1, 10))
    } else {
      setCombo(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόρων βάσει αναβαθμίσεων και streak
    const streakMultiplier = 1 + combo * 0.1 // 10% μπόνους ανά επίπεδο streak
    const totalValue = clickPower * streakMultiplier

    // 5% πιθανότητα για κρίσιμο χτύπημα (τριπλή αξία)
    const isCritical = Math.random() < 0.05
    const finalValue = isCritical ? totalValue * 3 : totalValue

    setMainStat((prev) => prev + finalValue)
    setTotalMainStat((prev) => prev + finalValue)

    // Κινούμενο εφέ κουμπιού κλικ
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 300)

    // Επιλογή τυχαίου μηνύματος
    const message = isCritical
      ? "CRITICAL HIT!"
      : combo > 1
        ? `${combo}x COMBO!`
        : KINGDOM_MESSAGES[Math.floor(Math.random() * KINGDOM_MESSAGES.length)]

    // Προσθήκη εφέ κλικ
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Τυχαία θέση μεταξύ 10% και 90%
    const y = Math.random() * 80 + 10

    setClickEffects((prev) => {
      // Αν έχουμε ήδη πολλά εφέ, αφαιρούμε το παλαιότερο
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, text: message, isCritical }]
      }
      return [...prev, { id, x, y, text: message, isCritical }]
    })

    // Αφαίρεση εφέ μετά την ολοκλήρωση του animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [clickPower, combo, lastClickTime])

  // Αγορά αναβάθμισης
  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Έλεγχος αν η αναβάθμιση είναι ξεκλειδωμένη (μόνο για προηγμένες)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as AdvancedUpgradeType
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Δεν έχει ξεκλειδωθεί ακόμα
          }
        }
      }

      if (mainStat >= cost) {
        setMainStat((prev) => prev - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή εφέ με βάση τον τύπο αναβάθμισης
        if (!isAdvanced) {
          // Βασικές αναβαθμίσεις
          if (upgradeId.includes("knight") || upgradeId.includes("armor")) {
            setClickPower((prev) => prev + upgrade.effect)
          } else if (upgradeId.includes("peasant") || upgradeId.includes("treasury")) {
            setAutoGeneration((prev) => prev + upgrade.effect)
          }
        } else {
          // Προηγμένες αναβαθμίσεις - συνήθως εφαρμόζουν πολλαπλασιαστικά εφέ
          if (upgradeId.includes("royal_guard") || upgradeId.includes("decree")) {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId.includes("village") || upgradeId.includes("trade")) {
            setAutoGeneration((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId.includes("alliance")) {
            // Απόλυτη αναβάθμιση που ενισχύει τα πάντα
            setClickPower((prev) => prev * 2)
            setAutoGeneration((prev) => prev * 2)
          }
        }
      }
    },
    [mainStat, upgrades],
  )

  // Υπολογισμός τρέχοντος ορόσημου με βάση τους συνολικούς πόρους
  const getCurrentMilestone = () => {
    for (let i = KINGDOM_RANKS.length - 1; i >= 0; i--) {
      if (totalMainStat >= KINGDOM_RANKS[i].threshold) {
        return KINGDOM_RANKS[i]
      }
    }
    return KINGDOM_RANKS[0]
  }

  // Υπολογισμός προόδου προς το επόμενο ορόσημο
  const getNextMilestoneProgress = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = KINGDOM_RANKS.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === KINGDOM_RANKS.length - 1) {
      return 100 // Ήδη στο μέγιστο ορόσημο
    }

    const currentThreshold = KINGDOM_RANKS[currentIndex].threshold
    const nextThreshold = KINGDOM_RANKS[currentIndex + 1].threshold
    const progress = ((totalMainStat - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Λήψη του επόμενου ορόσημου
  const getNextMilestone = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = KINGDOM_RANKS.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === KINGDOM_RANKS.length - 1) {
      return null // Ήδη στο μέγιστο ορόσημο
    }

    return KINGDOM_RANKS[currentIndex + 1]
  }

  const currentMilestone = getCurrentMilestone()
  const nextMilestone = getNextMilestone()

  return (
    <div className="min-h-screen flex items-center justify-center kingdom-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 cursor-pointer hover:shadow-xl transition-all mx-auto"
        >
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Kingdom Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Build and expand your medieval kingdom!
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
                  color: effect.isCritical ? "#ff5e5e" : "#7b61ff",
                  fontSize: effect.isCritical ? "1.5rem" : "1.2rem",
                  textShadow: effect.isCritical ? "0 0 5px rgba(255, 94, 94, 0.7)" : "0 0 3px rgba(123, 97, 255, 0.7)",
                }}
              >
                {effect.text}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Coins className="h-5 w-5 mr-1 text-green-300" />
                <p className="text-lg font-bold text-green-300">Gold: {formatNumber(mainStat)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-green-300">Rank: {currentMilestone.name}</p>
              </div>
            </div>

            {/* Milestone progress bar */}
            <div className="video-progress">
              <div className="video-progress-fill" style={{ width: `${getNextMilestoneProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Gold per click</p>
                <p className="text-sm font-medium text-green-500">{formatNumber(clickPower)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Gold per second</p>
                <p className="text-sm font-medium text-green-500">{formatNumber(autoGeneration)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Total Gold</p>
                <p className="text-sm font-medium text-green-500">{formatNumber(totalMainStat)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Milestone</p>
                <p className="text-sm font-medium text-green-500">{currentMilestone.icon}</p>
              </div>
            </div>

            {/* Kingdom collection grid */}
            <div className="kingdom-grid mb-4 grid grid-cols-4 gap-2">
              {["🏰", "⚔️", "🛡️", "👑", "🧙‍♂️", "🐎", "🏹", "💰"].map((item, i) => (
                <div key={i} className="kingdom-item bg-gray-800/30 rounded-md p-2 text-center">
                  <div className="kingdom-emoji text-2xl">{item}</div>
                  <div className="kingdom-count text-xs text-gray-300">{i + 1}</div>
                </div>
              ))}
            </div>

            {/* Combo indicator */}
            <div className="h-8 mb-4 flex items-center justify-center">
              {combo > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-green-800">
                  <p className="text-sm font-bold text-white flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {combo}x Combo! +{combo * 10}%
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleClick}
              className={`w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 ${clickAnimation ? "click-animation" : ""}`}
            >
              <Crown className="h-6 w-6 mr-2" /> RULE KINGDOM
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

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-gray-700/50">
          <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-green-800 font-bold" : "bg-green-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-green-800 font-bold" : "bg-green-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your basic abilities" : "Advanced upgrades for massive boosts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Basic upgrades
              <>
                {UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => mainStat >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-700/30 transition-all ${
                        mainStat >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-green-500 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          mainStat >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-green-700 to-green-600"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Advanced upgrades
              <>
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-green-500">
                    Advanced upgrades unlock powerful multipliers. Each requires certain basic upgrades.
                  </p>
                </div>

                {ADVANCED_UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  // Check if upgrade is unlocked
                  const reqId = upgrade.unlockRequirement.id
                  const reqLevel = upgrade.unlockRequirement.level
                  const currentReqLevel = upgrades[reqId] || 0
                  const isUnlocked = currentReqLevel >= reqLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => isUnlocked && mainStat >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-700/30 transition-all ${
                        isUnlocked
                          ? mainStat >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-green-500 flex items-center text-sm">
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
                          isUnlocked && mainStat >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-green-700 to-green-600"
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
            <div className="relative bg-gradient-to-r from-green-700 to-green-600 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-400">
                  Welcome Back!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-400">
                  {formatNumber(offlineMessage.amount)} Gold
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg hover:opacity-90 transition-all"
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
