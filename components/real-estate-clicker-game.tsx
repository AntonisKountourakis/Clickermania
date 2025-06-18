"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building, Home, Map, DollarSign, PenToolIcon as Tool, Users } from "lucide-react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

const UPGRADES = [
  {
    id: "property_management",
    name: "Property Management",
    description: "Improve your property management skills",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Home className="h-4 w-4 mr-1" />,
  },
  {
    id: "passive_income",
    name: "Rental Income",
    description: "Generate passive income through rentals",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <DollarSign className="h-4 w-4 mr-1" />,
  },
  {
    id: "renovation",
    name: "Renovation",
    description: "Renovate properties to increase their value",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Tool className="h-4 w-4 mr-1" />,
  },
  {
    id: "location",
    name: "Prime Locations",
    description: "Expand to better locations with higher returns",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Map className="h-4 w-4 mr-1" />,
  },
  {
    id: "real_estate_team",
    name: "Real Estate Team",
    description: "Hire professionals to help grow your business",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 10,
    maxLevel: 10,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "marketing",
    name: "Marketing Campaign",
    description: "Attract more buyers and tenants with targeted marketing",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.1, // 10% αύξηση στις πωλήσεις
    maxLevel: 20,
    icon: <Building className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "property_management", level: 5 } as const,
  },
  {
    id: "technology",
    name: "Property Tech",
    description: "Implement smart home technology in your properties",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.15, // 15% αύξηση στην αξία
    maxLevel: 15,
    icon: <DollarSign className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "renovation", level: 5 } as const,
  },
  {
    id: "international",
    name: "International Expansion",
    description: "Expand your real estate business to international markets",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.2, // 20% αύξηση στα έσοδα
    maxLevel: 10,
    icon: <Map className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "location", level: 8 } as const,
  },
  {
    id: "luxury",
    name: "Luxury Properties",
    description: "Develop and acquire high-end luxury properties",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.25, // 25% αύξηση στην αξία
    maxLevel: 8,
    icon: <Home className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "renovation", level: 10 } as const,
  },
  {
    id: "commercial_development",
    name: "Commercial Development",
    description: "Develop commercial properties for higher returns",
    basePrice: 50000,
    priceMultiplier: 3.2,
    effect: 0.3, // 30% αύξηση στα έσοδα
    maxLevel: 5,
    icon: <Building className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "real_estate_team", level: 5 } as const,
  },
]

// Διαφορετικοί τύποι ακινήτων
const PROPERTY_TYPES = [
  { emoji: "🏠", name: "House", value: 1 },
  { emoji: "🏢", name: "Apartment", value: 2 },
  { emoji: "🏪", name: "Commercial", value: 5 },
  { emoji: "🏨", name: "Hotel", value: 10 },
  { emoji: "🏭", name: "Industrial", value: 15 },
  { emoji: "🏘️", name: "Residential Complex", value: 25 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const REAL_ESTATE_MESSAGES = [
  "💰 Profit!",
  "🏠 Property Sold!",
  "📈 Value Increased!",
  "🔑 New Tenant!",
  "💼 Deal Closed!",
  "🏆 Great Investment!",
  "💎 Prime Location!",
  "🔨 Renovation Complete!",
]

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`
  return `$${Math.floor(amount)}`
}

const RealEstateClicker = () => {
  const [money, setMoney] = useState(0)
  const [propertyManagement, setPropertyManagement] = useState(1)
  const [rentalIncome, setRentalIncome] = useState(0)
  const [renovation, setRenovation] = useState(1)
  const [location, setLocation] = useState(1)
  const [realEstateTeam, setRealEstateTeam] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; amount: number }>
  >([])
  const [propertyPortfolio, setPropertyPortfolio] = useState<Record<string, number>>({})
  const [availableProperties, setAvailableProperties] = useState(2) // Αρχικά διαθέσιμοι τύποι ακ��νήτων
  const [marketTrend, setMarketTrend] = useState(0) // -10 to 10, επηρεάζει τα έσοδα
  const [marketMultiplier, setMarketMultiplier] = useState(1)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1)

  const { isMobile, reducedAnimations, gridCols } = useMobileOptimization()

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("real-estate-clicker-progress")
    if (savedProgress) {
      try {
        const {
          money: savedMoney,
          propertyManagement: savedPropertyManagement,
          rentalIncome: savedRentalIncome,
          renovation: savedRenovation,
          location: savedLocation,
          realEstateTeam: savedRealEstateTeam,
          upgrades: savedUpgrades,
          propertyPortfolio: savedPropertyPortfolio,
          availableProperties: savedAvailableProperties,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setPropertyManagement(savedPropertyManagement || 1)
        setRentalIncome(savedRentalIncome || 0)
        setRenovation(savedRenovation || 1)
        setLocation(savedLocation || 1)
        setRealEstateTeam(savedRealEstateTeam || 1)
        setUpgrades(savedUpgrades || {})
        setPropertyPortfolio(savedPropertyPortfolio || {})
        setAvailableProperties(savedAvailableProperties || 2)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedRentalIncome > 0) {
          // Υπολογισμός χρημάτων που κερδήθηκαν offline (σ�� δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlineMoney = (timeDiff / 1000) * (savedRentalIncome * savedRenovation * savedLocation * 1.0)
          setMoney((savedMoney || 0) + offlineMoney)

          // Εμφάνιση μηνύματος για τα χρήματα που κερδήθηκαν offline
          if (offlineMoney > 0) {
            setOfflineMessage({
              message: `Welcome back, Real Estate Mogul! Your properties generated`,
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
      propertyManagement,
      rentalIncome,
      renovation,
      location,
      realEstateTeam,
      upgrades,
      propertyPortfolio,
      availableProperties,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("real-estate-clicker-progress", JSON.stringify(progress))
  }, [
    money,
    propertyManagement,
    rentalIncome,
    renovation,
    location,
    realEstateTeam,
    upgrades,
    propertyPortfolio,
    availableProperties,
  ])

  // Υπολογισμός του τρέχοντος πολλαπλασιαστή με βάση την τάση της αγοράς
  useEffect(() => {
    const interval = setInterval(() => {
      // Αλλαγή της τάσης της αγοράς κάθε 15 δευτερόλεπτα
      const trendChange = Math.random() * 4 - 2 // -2 έως 2
      setMarketTrend((prev) => {
        const newTrend = Math.max(-10, Math.min(10, prev + trendChange))
        // Ο πολλαπλασιαστής κυμαίνεται από 0.5 έως 1.5 με βάση την τάση
        const newMultiplier = 1 + newTrend / 20
        setMarketMultiplier(newMultiplier)
        return newTrend
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    // Υπολογισμός κέρδους με βάση τις αναβαθμίσεις και τον πολλαπλασιαστή της αγοράς
    const baseValue = propertyManagement * renovation * location
    const teamBonus = baseValue * (realEstateTeam * 0.05) // 5% επιπλέον ανά επίπεδο real estate team
    const totalValue = (baseValue + teamBonus) * marketMultiplier

    setMoney((prevMoney) => prevMoney + totalValue)

    // Προσθήκη τυχαίου ακινήτου στο χαρτοφυλάκιο
    const availablePropertyTypes = Math.min(availableProperties, PROPERTY_TYPES.length)
    const randomProperty = PROPERTY_TYPES[Math.floor(Math.random() * availablePropertyTypes)]

    setPropertyPortfolio((prev) => ({
      ...prev,
      [randomProperty.name]: (prev[randomProperty.name] || 0) + 0.1, // Προσθέτουμε μέρος ενός ακινήτου με κάθε κλικ
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random message
    const messageIndex = Math.floor(Math.random() * REAL_ESTATE_MESSAGES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 3 on mobile, 5 on desktop
      const limit = isMobile ? 3 : 5
      if (prev.length >= limit) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: REAL_ESTATE_MESSAGES[messageIndex],
          amount: totalValue,
        },
      ].slice(-limit)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(
      () => {
        setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
      },
      reducedAnimations ? 0 : 1000,
    )
  }, [
    propertyManagement,
    renovation,
    location,
    realEstateTeam,
    marketMultiplier,
    availableProperties,
    isMobile,
    reducedAnimations,
  ])

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
          if (upgradeId === "property_management") {
            setPropertyManagement((prev) => prev + upgrade.effect)
          } else if (upgradeId === "passive_income") {
            setRentalIncome((prev) => prev + upgrade.effect)
          } else if (upgradeId === "renovation") {
            setRenovation((prev) => prev + upgrade.effect)
          } else if (upgradeId === "location") {
            setLocation((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων τύπων ακινήτων με κάθε αναβάθμιση τοποθεσίας
            setAvailableProperties((prev) => Math.min(prev + 1, PROPERTY_TYPES.length))
          } else if (upgradeId === "real_estate_team") {
            setRealEstateTeam((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "marketing") {
            setPropertyManagement((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "technology") {
            setRenovation((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "international") {
            setLocation((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "luxury") {
            setRenovation((prev) => prev * (1 + upgrade.effect))
            setLocation((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "commercial_development") {
            setRentalIncome((prev) => prev * (1 + upgrade.effect))
            setRealEstateTeam((prev) => prev * (1 + upgrade.effect * 0.5))
          }
        }
      }
    },
    [money, upgrades],
  )

  // Αυτόματη παραγωγή εισοδήματος από ενοίκια
  useEffect(() => {
    const interval = setInterval(() => {
      if (rentalIncome > 0) {
        const passiveValue = rentalIncome * renovation * location * marketMultiplier
        setMoney((prevMoney) => prevMoney + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέο ακίνητο από τα ενοίκια
        if (Math.random() < 0.1) {
          const availablePropertyTypes = Math.min(availableProperties, PROPERTY_TYPES.length)
          const randomProperty = PROPERTY_TYPES[Math.floor(Math.random() * availablePropertyTypes)]

          setPropertyPortfolio((prev) => ({
            ...prev,
            [randomProperty.name]: (prev[randomProperty.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [rentalIncome, renovation, location, marketMultiplier, availableProperties])

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

  // Υπολογισμός της συνολικής αξίας του χαρτοφυλακίου
  const calculatePortfolioValue = () => {
    let total = 0
    Object.entries(propertyPortfolio).forEach(([name, count]) => {
      const property = PROPERTY_TYPES.find((p) => p.name === name)
      if (property) {
        total += Math.floor(count) * property.value * 1000 * location // Η αξία επηρεάζεται από την τοποθεσία
      }
    })
    return total
  }

  // Υπολογισμός του συνολικού αριθμού ακινήτων
  const calculateTotalProperties = () => {
    return Object.values(propertyPortfolio).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center realestate-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="city-skyline"></div>
      <div
        className={`w-full max-w-md mx-auto space-y-4 relative z-10 ${reducedAnimations ? "reduced-animation" : ""}`}
      >
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Real Estate Tycoon</CardTitle>
            <CardDescription className="text-center text-white/80">
              Buy, renovate, and rent properties to build your empire!
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
                  color: effect.amount > propertyManagement * 2 ? "#22c55e" : "#3b82f6",
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
                    {getTrendIcon()} {(marketMultiplier * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="market-graph mb-4">
              <div className="market-indicator" style={{ left: `${((marketTrend + 10) / 20) * 100}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Portfolio Value</p>
                <p className="text-sm font-medium">{formatMoney(calculatePortfolioValue())}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Rental Income</p>
                <p className="text-sm font-medium">
                  {formatMoney(rentalIncome * renovation * location * marketMultiplier)}/s
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Properties</p>
                <p className="text-sm font-medium">{calculateTotalProperties()}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Management</p>
                <p className="text-sm font-medium">Level {Math.floor(propertyManagement)}</p>
              </div>
            </div>

            <div className="property-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
              {PROPERTY_TYPES.slice(0, availableProperties).map((property) => {
                const count = Math.floor(propertyPortfolio[property.name] || 0)
                return (
                  <div
                    key={property.name}
                    className="property-item"
                    title={`${property.name}: ${count} (Value: ${formatMoney(count * property.value * 1000 * location)})`}
                  >
                    <div className="property-icon">{property.emoji}</div>
                    <div className="property-count">{count}</div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 estate-button"
            >
              <Building className="h-5 w-5 mr-2" /> Invest in Real Estate
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                      Property Income!
                    </h3>
                    <p className="text-center mb-4">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                      {formatMoney(offlineMessage.amount)}
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                      >
                        Collect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Business Upgrades</CardTitle>
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
              {upgradesPage === 1 ? "Expand your real estate empire" : "Premium upgrades for massive growth"}
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
      </div>
    </div>
  )
}

export default RealEstateClicker
