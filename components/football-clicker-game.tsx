"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trophy, Users, TrendingUp, Dumbbell, Target, StickerIcon as Stadium, Star, Globe } from "lucide-react"

const UPGRADES = [
  {
    id: "shooting_power",
    name: "Shooting Power",
    description: "Improve your shooting accuracy and power",
    basePrice: 10,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Target className="h-4 w-4 mr-1" />,
  },
  {
    id: "training_staff",
    name: "Training Staff",
    description: "Hire coaches to train your team automatically",
    basePrice: 25,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Dumbbell className="h-4 w-4 mr-1" />,
  },
  {
    id: "better_players",
    name: "Better Players",
    description: "Sign better players for your team",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "team_chemistry",
    name: "Team Chemistry",
    description: "Improve how well your players work together",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <TrendingUp className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "star_striker",
    name: "Star Striker",
    description: "Sign a world-class striker for your team",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο shooting power
    maxLevel: 10,
    icon: <Star className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "shooting_power", level: 10 } as const,
  },
  {
    id: "elite_academy",
    name: "Elite Academy",
    description: "Develop your own talent through a world-class academy",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% αύξηση στο training staff
    maxLevel: 5,
    icon: <Dumbbell className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "training_staff", level: 15 } as const,
  },
  {
    id: "new_stadium",
    name: "New Stadium",
    description: "Build a modern stadium to increase fan support",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο team chemistry
    maxLevel: 3,
    icon: <Stadium className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "team_chemistry", level: 10 } as const,
  },
  {
    id: "championship",
    name: "Championship Win",
    description: "Win major trophies to boost team morale and reputation",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% αύξηση σε όλα
    maxLevel: 5,
    icon: <Trophy className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "better_players", level: 15 } as const,
  },
  {
    id: "global_brand",
    name: "Global Football Brand",
    description: "Transform your club into a worldwide football powerhouse",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Globe className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "team_chemistry", level: 15 } as const,
  },
]

// Διαφορετικοί τύποι γκολ και εορτασμών
const GOAL_TYPES = [
  "⚽ Goal!",
  "⚽ Amazing shot!",
  "⚽ What a finish!",
  "⚽ Fantastic goal!",
  "⚽ Top corner!",
  "⚽ Perfect strike!",
  "⚽ Unstoppable!",
  "⚽ World class!",
]

// Προσθήκη της συνάρτησης formatMoney μετά τα GOAL_TYPES

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const FootballClicker = () => {
  const [goals, setGoals] = useState(0)
  const [shootingPower, setShootingPower] = useState(1)
  const [trainingStaff, setTrainingStaff] = useState(0)
  const [playerQuality, setPlayerQuality] = useState(1)
  const [teamChemistry, setTeamChemistry] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number; text: string }>>([])
  const [streak, setStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("football-clicker-progress")
    if (savedProgress) {
      try {
        const {
          goals: savedGoals,
          shootingPower: savedShootingPower,
          trainingStaff: savedTrainingStaff,
          playerQuality: savedPlayerQuality,
          teamChemistry: savedTeamChemistry,
          upgrades: savedUpgrades,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setShootingPower(savedShootingPower || 1)
        setTrainingStaff(savedTrainingStaff || 0)
        setPlayerQuality(savedPlayerQuality || 1)
        setTeamChemistry(savedTeamChemistry || 1)
        setUpgrades(savedUpgrades || {})

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedTrainingStaff > 0) {
          // Υπολογισμός γκολ που σημειώθηκαν offline (σε δευτερόλεπτα)
          const offlineGoals = (timeDiff / 1000) * (savedTrainingStaff * 0.5 * savedPlayerQuality * savedTeamChemistry)
          setGoals((savedGoals || 0) + offlineGoals)

          // Εμφάνιση μηνύματος για τα γκολ που σημειώθηκαν offline
          if (offlineGoals > 0) {
            setOfflineMessage({
              message: `Welcome back, Coach! Your team scored`,
              amount: offlineGoals,
            })
          }
        } else {
          setGoals(savedGoals || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      goals,
      shootingPower,
      trainingStaff,
      playerQuality,
      teamChemistry,
      upgrades,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("football-clicker-progress", JSON.stringify(progress))
  }, [goals, shootingPower, trainingStaff, playerQuality, teamChemistry, upgrades])

  const handleClick = useCallback(() => {
    const now = Date.now()
    // Αν ο χρήστης κάνει κλικ μέσα σε 1 δευτερόλεπτο, αυξάνεται το streak
    if (now - lastClickTime < 1000) {
      setStreak((prev) => Math.min(prev + 1, 5))
    } else {
      setStreak(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και το streak
    const streakBonus = streak * 0.2 // 20% επιπλέον ανά streak
    const goalValue = shootingPower * playerQuality * (1 + streakBonus)
    setGoals((prevGoals) => prevGoals + goalValue)

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random goal type based on player quality
    const availableGoalTypes = Math.min(Math.floor(playerQuality + teamChemistry), GOAL_TYPES.length)
    const goalText = GOAL_TYPES[Math.floor(Math.random() * availableGoalTypes)]

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [...prev, { id, x, y, text: goalText }].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [shootingPower, playerQuality, teamChemistry, streak, lastClickTime])

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

      if (goals >= cost) {
        setGoals((prevGoals) => prevGoals - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "shooting_power") {
            setShootingPower((prev) => prev + upgrade.effect)
          } else if (upgradeId === "training_staff") {
            setTrainingStaff((prev) => prev + 1)
          } else if (upgradeId === "better_players") {
            setPlayerQuality((prev) => prev + upgrade.effect)
          } else if (upgradeId === "team_chemistry") {
            setTeamChemistry((prev) => prev + 1)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "star_striker") {
            setShootingPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "elite_academy") {
            setTrainingStaff((prev) => prev * (1 + upgrade.effect))
            setPlayerQuality((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "new_stadium") {
            setTeamChemistry((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "championship") {
            // Αύξηση όλων των παραμέτρων
            setShootingPower((prev) => prev * (1 + upgrade.effect * 0.25))
            setPlayerQuality((prev) => prev * (1 + upgrade.effect * 0.25))
            setTeamChemistry((prev) => prev * (1 + upgrade.effect * 0.25))
            setTrainingStaff((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "global_brand") {
            // Διπλασιασμός όλων
            setShootingPower((prev) => prev * 2)
            setPlayerQuality((prev) => prev * 2)
            setTeamChemistry((prev) => prev * 2)
            setTrainingStaff((prev) => prev * 2)
          }
        }
      }
    },
    [goals, upgrades],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (trainingStaff > 0) {
        const autoValue = trainingStaff * 0.5 * playerQuality * teamChemistry
        setGoals((prevGoals) => prevGoals + autoValue)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [trainingStaff, playerQuality, teamChemistry])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-900 py-12 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-green-500 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Football Manager Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Score goals and build your football empire!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-lg font-bold text-green-600 animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                }}
              >
                {effect.text}
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <p className="text-lg font-bold text-green-700">Goals: {formatMoney(goals)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600">Power: {shootingPower.toFixed(1)}</p>
                <p className="text-sm text-gray-600">
                  Auto: +{formatMoney(trainingStaff * 0.5 * playerQuality * teamChemistry)}/s
                </p>
              </div>
            </div>

            {/* Streak indicator */}
            <div className="mb-4 flex justify-center">
              <div className="bg-gray-200 rounded-full h-2 w-full">
                <div
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(streak / 5) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-600">x{streak}</span>
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Shoot!
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-green-500">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Team Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-green-600 font-bold" : "bg-green-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-green-600 font-bold" : "bg-green-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your football team" : "Elite upgrades for championship teams"}
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
                      onClick={() => goals >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-100 transition-all ${
                        goals >= cost && !isMaxLevel
                          ? "bg-green-50 hover:bg-green-100 cursor-pointer"
                          : "bg-green-50/70 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-green-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          goals >= cost && !isMaxLevel ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-300"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm ml-2 whitespace-nowrap`}
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
                <div className="bg-green-50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-green-800">
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
                      onClick={() => isUnlocked && goals >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-100 transition-all ${
                        isUnlocked
                          ? goals >= cost && !isMaxLevel
                            ? "bg-green-50 hover:bg-green-100 cursor-pointer"
                            : "bg-green-50/70 opacity-70"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-green-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">
                          {isUnlocked
                            ? `Level: ${currentLevel}`
                            : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                        </p>
                      </div>
                      <div
                        className={`${
                          isUnlocked && goals >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gray-300"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm ml-2 whitespace-nowrap`}
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
            <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-500 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-600">
                  Training Results!
                </h3>
                <p className="text-center mb-4">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-600">
                  {formatMoney(offlineMessage.amount)} goals
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
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

export default FootballClicker
