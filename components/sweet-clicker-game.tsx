"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Cake, Cookie, IceCream, Candy, CakeSlice, ChefHat, Store, Award, Utensils, ShoppingBag } from "lucide-react"

const UPGRADES = [
  {
    id: "click_power",
    name: "Better Oven",
    description: "Bake more sweets per click",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Cake className="h-4 w-4 mr-1" />,
  },
  {
    id: "auto_baker",
    name: "Auto Baker",
    description: "Automatically bake sweets over time",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Cookie className="h-4 w-4 mr-1" />,
  },
  {
    id: "sweet_quality",
    name: "Sweet Quality",
    description: "Improve the quality of your sweets",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <IceCream className="h-4 w-4 mr-1" />,
  },
  {
    id: "sweet_variety",
    name: "Sweet Variety",
    description: "Add more types of sweets to your bakery",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Candy className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "master_chef",
    name: "Master Chef",
    description: "Hire a professional pastry chef to improve your recipes",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο click power
    maxLevel: 10,
    icon: <ChefHat className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "sweet_quality", level: 5 } as const,
  },
  {
    id: "bakery_chain",
    name: "Bakery Chain",
    description: "Open multiple bakery locations across the city",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% αύξηση στα auto bakers
    maxLevel: 5,
    icon: <Store className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "auto_baker", level: 10 } as const,
  },
  {
    id: "premium_ingredients",
    name: "Premium Ingredients",
    description: "Use only the finest ingredients for your sweets",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στην ποιότητα
    maxLevel: 3,
    icon: <ShoppingBag className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "sweet_quality", level: 15 } as const,
  },
  {
    id: "baking_competition",
    name: "Baking Competition",
    description: "Win prestigious baking competitions for fame and recognition",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% αύξηση σε όλα
    maxLevel: 5,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "sweet_variety", level: 10 } as const,
  },
  {
    id: "dessert_empire",
    name: "Dessert Empire",
    description: "Create a global dessert empire with your brand",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Utensils className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "click_power", level: 25 } as const,
  },
]

const SWEET_EMOJIS = ["🍰", "🧁", "🍪", "🍩", "🍫", "🍬", "🍭", "🍮", "🎂", "🍦", "🍨"]

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const SweetClicker = () => {
  const [sweets, setSweets] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoBakers, setAutoBakers] = useState(0)
  const [sweetQuality, setSweetQuality] = useState(1)
  const [sweetVariety, setSweetVariety] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("sweet-clicker-progress")
    if (savedProgress) {
      try {
        const {
          sweets: savedSweets,
          clickPower: savedClickPower,
          autoBakers: savedAutoBakers,
          sweetQuality: savedSweetQuality,
          sweetVariety: savedSweetVariety,
          upgrades: savedUpgrades,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setClickPower(savedClickPower || 1)
        setAutoBakers(savedAutoBakers || 0)
        setSweetQuality(savedSweetQuality || 1)
        setSweetVariety(savedSweetVariety || 1)
        setUpgrades(savedUpgrades || {})

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedAutoBakers > 0) {
          // Υπολογισμός γλυκών που παρήχθησαν offline (σε δευτερόλεπτα)
          const offlineSweets = (timeDiff / 1000) * (savedAutoBakers * 0.5 * savedSweetQuality)
          setSweets((savedSweets || 0) + offlineSweets)

          // Εμφάνιση μηνύματος για τα γλυκά που παρήχθησαν offline
          if (offlineSweets > 0) {
            setOfflineMessage({
              message: `Welcome back to your bakery! Your bakers made`,
              amount: offlineSweets,
            })
          }
        } else {
          setSweets(savedSweets || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      sweets,
      clickPower,
      autoBakers,
      sweetQuality,
      sweetVariety,
      upgrades,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("sweet-clicker-progress", JSON.stringify(progress))
  }, [sweets, clickPower, autoBakers, sweetQuality, sweetVariety, upgrades])

  const handleClick = useCallback(() => {
    const sweetValue = clickPower * sweetQuality
    setSweets((prevSweets) => prevSweets + sweetValue)

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10
    const emoji = SWEET_EMOJIS[Math.floor(Math.random() * sweetVariety) % SWEET_EMOJIS.length]

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [...prev, { id, x, y, emoji }].slice(-5)
    })

    // Remove effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [clickPower, sweetQuality, sweetVariety])

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

      if (sweets >= cost) {
        setSweets((prevSweets) => prevSweets - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "click_power") {
            setClickPower((prevPower) => prevPower + upgrade.effect)
          } else if (upgradeId === "auto_baker") {
            setAutoBakers((prevCount) => prevCount + 1)
          } else if (upgradeId === "sweet_quality") {
            setSweetQuality((prevQuality) => prevQuality + upgrade.effect)
          } else if (upgradeId === "sweet_variety") {
            setSweetVariety((prevVariety) => prevVariety + 1)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "master_chef") {
            setClickPower((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "bakery_chain") {
            setAutoBakers((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "premium_ingredients") {
            setSweetQuality((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "baking_competition") {
            // Αύξηση όλων των παραμέτρων
            setClickPower((prev) => prev * (1 + upgrade.effect * 0.25))
            setAutoBakers((prev) => prev * (1 + upgrade.effect * 0.25))
            setSweetQuality((prev) => prev * (1 + upgrade.effect * 0.25))
            setSweetVariety((prev) => prev + 1)
          } else if (upgradeId === "dessert_empire") {
            // Διπλασιασμός όλων
            setClickPower((prev) => prev * 2)
            setAutoBakers((prev) => prev * 2)
            setSweetQuality((prev) => prev * 2)
            setSweetVariety((prev) => Math.min(prev * 2, SWEET_EMOJIS.length))
          }
        }
      }
    },
    [sweets, upgrades],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoBakers > 0) {
        const autoValue = autoBakers * 0.5 * sweetQuality
        setSweets((prevSweets) => prevSweets + autoValue)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoBakers, sweetQuality])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-pink-200 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Sweet Bakery Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Bake delicious sweets and expand your bakery!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-2xl animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                }}
              >
                {effect.emoji}
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <CakeSlice className="h-5 w-5 mr-2 text-pink-500" />
                <p className="text-lg font-bold text-pink-600">Sweets: {formatMoney(sweets)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600">Power: {clickPower.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Auto: +{formatMoney(autoBakers * 0.5 * sweetQuality)}/s</p>
              </div>
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-2xl py-7 px-8 rounded-full transition-all shadow-xl border-3 border-pink-300/30 my-4"
            >
              <span className="text-3xl mr-2">🧁</span> Bake Sweets! <span className="text-3xl ml-2">🍰</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Bakery Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-pink-500 font-bold" : "bg-pink-400 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-pink-500 font-bold" : "bg-pink-400 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your sweet bakery" : "Premium upgrades for your bakery empire"}
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
                      onClick={() => sweets >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-pink-100 transition-all ${
                        sweets >= cost && !isMaxLevel
                          ? "bg-pink-50 hover:bg-pink-100 cursor-pointer"
                          : "bg-pink-50/70 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-pink-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          sweets >= cost && !isMaxLevel ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-300"
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
                <div className="bg-pink-50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-pink-800">
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
                      onClick={() => isUnlocked && sweets >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-pink-100 transition-all ${
                        isUnlocked
                          ? sweets >= cost && !isMaxLevel
                            ? "bg-pink-50 hover:bg-pink-100 cursor-pointer"
                            : "bg-pink-50/70 opacity-70"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-pink-800 flex items-center text-sm">
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
                          isUnlocked && sweets >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-pink-500 to-purple-500"
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
            <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                  Sweet Surprise!
                </h3>
                <p className="text-center mb-4">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                  {formatMoney(offlineMessage.amount)} sweets
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
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

export default SweetClicker
