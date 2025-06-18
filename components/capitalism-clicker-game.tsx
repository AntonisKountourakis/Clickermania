"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DollarSign,
  TrendingUp,
  Building2,
  Briefcase,
  Users,
  LineChart,
  Globe,
  Award,
  Landmark,
  BarChart4,
  Rocket,
} from "lucide-react"

const UPGRADES = [
  {
    id: "investment_skill",
    name: "Investment Skill",
    description: "Improve your ability to make profitable investments",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <LineChart className="h-4 w-4 mr-1" />,
  },
  {
    id: "passive_income",
    name: "Passive Income",
    description: "Generate money automatically through dividends",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <TrendingUp className="h-4 w-4 mr-1" />,
  },
  {
    id: "business_expansion",
    name: "Business Expansion",
    description: "Expand your business empire to new markets",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Building2 className="h-4 w-4 mr-1" />,
  },
  {
    id: "workforce",
    name: "Workforce",
    description: "Hire employees to increase productivity",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "market_manipulation",
    name: "Market Influence",
    description: "Gain influence over market trends",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 10,
    maxLevel: 10,
    icon: <Briefcase className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "hedge_fund",
    name: "Hedge Fund",
    description: "Start your own hedge fund for massive investment leverage",
    basePrice: 5000,
    priceMultiplier: 2.2,
    effect: 0.3, // 30% αύξηση στο investment skill
    maxLevel: 5,
    icon: <BarChart4 className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "investment_skill", level: 20 } as const,
  },
  {
    id: "stock_exchange",
    name: "Stock Exchange Listing",
    description: "List your company on the stock exchange for massive capital",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο passive income
    maxLevel: 3,
    icon: <Landmark className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "passive_income", level: 25 } as const,
  },
  {
    id: "multinational",
    name: "Multinational Corporation",
    description: "Expand your business globally with offices in major financial centers",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο business expansion
    maxLevel: 3,
    icon: <Globe className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "business_expansion", level: 15 } as const,
  },
  {
    id: "conglomerate",
    name: "Corporate Conglomerate",
    description: "Form a massive conglomerate of diverse businesses",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 0.6, // 60% αύξηση σε όλα
    maxLevel: 2,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "workforce", level: 15 } as const,
  },
  {
    id: "tech_giant",
    name: "Tech Industry Giant",
    description: "Become a dominant force in the technology sector",
    basePrice: 100000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Rocket className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "market_manipulation", level: 8 } as const,
  },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const MONEY_MESSAGES = [
  "💰 Profit!",
  "💵 Cash flow!",
  "💸 Income!",
  "📈 Gains!",
  "🤑 Money!",
  "💎 Assets!",
  "📊 Stonks!",
  "🏦 Dividends!",
  "💼 ROI!",
  "🏢 Acquisition!",
]

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`
  return `$${Math.floor(amount)}`
}

const CapitalismClicker = () => {
  const [money, setMoney] = useState(0)
  const [investmentSkill, setInvestmentSkill] = useState(1)
  const [passiveIncome, setPassiveIncome] = useState(0)
  const [businessExpansion, setBusinessExpansion] = useState(1)
  const [workforce, setWorkforce] = useState(1)
  const [marketInfluence, setMarketInfluence] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; amount: number }>
  >([])
  const [multiplier, setMultiplier] = useState(1)
  const [marketTrend, setMarketTrend] = useState(0) // -10 to 10, affects income
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("capitalism-clicker-progress")
    if (savedProgress) {
      try {
        const {
          money: savedMoney,
          investmentSkill: savedInvestmentSkill,
          passiveIncome: savedPassiveIncome,
          businessExpansion: savedBusinessExpansion,
          workforce: savedWorkforce,
          marketInfluence: savedMarketInfluence,
          upgrades: savedUpgrades,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setInvestmentSkill(savedInvestmentSkill || 1)
        setPassiveIncome(savedPassiveIncome || 0)
        setBusinessExpansion(savedBusinessExpansion || 1)
        setWorkforce(savedWorkforce || 1)
        setMarketInfluence(savedMarketInfluence || 1)
        setUpgrades(savedUpgrades || {})

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedPassiveIncome > 0) {
          // Υπολογισμός χρημάτων που κερδήθηκαν offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlineMoney = (timeDiff / 1000) * (savedPassiveIncome * savedBusinessExpansion * savedWorkforce * 1.0)
          setMoney((savedMoney || 0) + offlineMoney)

          // Εμφάνιση μηνύματος για τα χρήματα που κερδήθηκαν offline
          if (offlineMoney > 0) {
            setOfflineMessage({
              message: `Welcome back, Investor! Your businesses generated`,
              amount: offlineMoney,
            })
          }
        } else {
          setMoney(savedMoney || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      money,
      investmentSkill,
      passiveIncome,
      businessExpansion,
      workforce,
      marketInfluence,
      upgrades,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("capitalism-clicker-progress", JSON.stringify(progress))
  }, [money, investmentSkill, passiveIncome, businessExpansion, workforce, marketInfluence, upgrades])

  // Υπολογισμός του τρέχοντος πολλαπλασιαστή με βάση την τάση της αγοράς
  useEffect(() => {
    const interval = setInterval(() => {
      // Αλλαγή της τάσης της αγοράς κάθε 10 δευτερόλεπτα
      const trendChange = Math.random() * 4 - 2 // -2 έως 2
      setMarketTrend((prev) => {
        const newTrend = Math.max(-10, Math.min(10, prev + trendChange))
        // Ο πολλαπλασιαστής κυμαίνεται από 0.5 έως 1.5 με βάση την τάση
        const newMultiplier = 1 + newTrend / 20
        setMultiplier(newMultiplier)
        return newTrend
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    // Υπολογισμός κέρδους με βάση τις αναβαθμίσεις και τον πολλαπλασιαστή της αγοράς
    const baseValue = investmentSkill * businessExpansion * workforce
    const marketBonus = baseValue * (marketInfluence * 0.05) // 5% επιπλέον ανά επίπεδο market influence
    const totalValue = (baseValue + marketBonus) * multiplier

    setMoney((prevMoney) => prevMoney + totalValue)

    // Προσθήκη εφέ κλικ
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random message
    const messageIndex = Math.floor(Math.random() * MONEY_MESSAGES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: MONEY_MESSAGES[messageIndex],
          amount: totalValue,
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [investmentSkill, businessExpansion, workforce, marketInfluence, multiplier])

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

      if (money >= cost) {
        setMoney((prevMoney) => prevMoney - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "investment_skill") {
            setInvestmentSkill((prev) => prev + upgrade.effect)
          } else if (upgradeId === "passive_income") {
            setPassiveIncome((prev) => prev + upgrade.effect)
          } else if (upgradeId === "business_expansion") {
            setBusinessExpansion((prev) => prev + upgrade.effect)
          } else if (upgradeId === "workforce") {
            setWorkforce((prev) => prev + upgrade.effect)
          } else if (upgradeId === "market_manipulation") {
            setMarketInfluence((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "hedge_fund") {
            setInvestmentSkill((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "stock_exchange") {
            setPassiveIncome((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "multinational") {
            setBusinessExpansion((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "conglomerate") {
            // Αύξηση όλων των παραμέτρων
            setInvestmentSkill((prev) => prev * (1 + upgrade.effect * 0.25))
            setPassiveIncome((prev) => prev * (1 + upgrade.effect * 0.25))
            setBusinessExpansion((prev) => prev * (1 + upgrade.effect * 0.25))
            setWorkforce((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "tech_giant") {
            // Διπλασιασμός όλων
            setInvestmentSkill((prev) => prev * 2)
            setPassiveIncome((prev) => prev * 2)
            setBusinessExpansion((prev) => prev * 2)
            setWorkforce((prev) => prev * 2)
            setMarketInfluence((prev) => prev * 2)
          }
        }
      }
    },
    [money, upgrades],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveIncome > 0) {
        const passiveValue = passiveIncome * businessExpansion * workforce * multiplier
        setMoney((prevMoney) => prevMoney + passiveValue)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [passiveIncome, businessExpansion, workforce, multiplier])

  // Υπολογισμός του χρώματος της τάσης της αγοράς
  const getTrendColor = () => {
    if (marketTrend > 2) return "text-green-500"
    if (marketTrend < -2) return "text-red-500"
    return "text-yellow-500"
  }

  // Υπολογισμός του εικονιδίου της τάσης της αγοράς
  const getTrendIcon = () => {
    if (marketTrend > 2) return "↗️"
    if (marketTrend < -2) return "↘️"
    return "➡️"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      <div className="w-full max-w-md mx-auto space-y-8">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Capitalism Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Invest, expand, and dominate the market!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-lg font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                  color: effect.amount > investmentSkill * 2 ? "#22c55e" : "#3b82f6",
                }}
              >
                {effect.text} {formatMoney(effect.amount)}
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                <p className="text-lg font-bold text-blue-800">{formatMoney(money)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-gray-600">
                  Market:{" "}
                  <span className={getTrendColor()}>
                    {getTrendIcon()} {(multiplier * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="market-graph mb-4">
              <div className="market-indicator" style={{ left: `${((marketTrend + 10) / 20) * 100}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Investment Skill</p>
                <p className="text-sm font-medium">{investmentSkill.toFixed(1)}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Passive Income</p>
                <p className="text-sm font-medium">
                  {formatMoney(passiveIncome * businessExpansion * workforce * multiplier)}/s
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Business Size</p>
                <p className="text-sm font-medium">x{businessExpansion.toFixed(1)}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Workforce</p>
                <p className="text-sm font-medium">x{workforce.toFixed(1)}</p>
              </div>
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              Invest!
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Business Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-blue-600 font-bold" : "bg-blue-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-blue-600 font-bold" : "bg-blue-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Expand your financial empire" : "Elite upgrades for market dominance"}
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
                      onClick={() => money >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-blue-100 transition-all ${
                        money >= cost && !isMaxLevel
                          ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          : "bg-blue-50/70 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-blue-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          money >= cost && !isMaxLevel ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"
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
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-blue-800">
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
                      onClick={() => isUnlocked && money >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-blue-100 transition-all ${
                        isUnlocked
                          ? money >= cost && !isMaxLevel
                            ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                            : "bg-blue-50/70 opacity-70"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-blue-800 flex items-center text-sm">
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
                          isUnlocked && money >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                            : "bg-gray-300"
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
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500">
                  Investment Returns!
                </h3>
                <p className="text-center mb-4 text-gray-700 dark:text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500">
                  {formatMoney(offlineMessage.amount)}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
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

export default CapitalismClicker
