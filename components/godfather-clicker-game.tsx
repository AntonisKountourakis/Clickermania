"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Users,
  Briefcase,
  ShieldCheck,
  Crown,
  HandshakeIcon as HandShake,
  Wine,
  Landmark,
  Globe,
  Star,
  Map,
} from "lucide-react"

const UPGRADES = [
  {
    id: "family_loyalty",
    name: "Family Loyalty",
    description: "Strengthen bonds within your family",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "business_ventures",
    name: "Business Ventures",
    description: "Expand your legitimate business operations",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Briefcase className="h-4 w-4 mr-1" />,
  },
  {
    id: "territory_control",
    name: "Territory Control",
    description: "Increase your influence in various neighborhoods",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Map className="h-4 w-4 mr-1" />,
  },
  {
    id: "political_connections",
    name: "Political Connections",
    description: "Develop relationships with influential politicians",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Landmark className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "consigliere",
    name: "Consigliere",
    description: "Hire a trusted advisor to improve your decision making",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο family_loyalty
    maxLevel: 10,
    icon: <ShieldCheck className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "family_loyalty", level: 10 } as const,
  },
  {
    id: "international_expansion",
    name: "International Expansion",
    description: "Expand your family business to other countries",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο business_ventures
    maxLevel: 5,
    icon: <Globe className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "business_ventures", level: 15 } as const,
  },
  {
    id: "strategic_alliances",
    name: "Strategic Alliances",
    description: "Form alliances with other powerful families",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο territory_control
    maxLevel: 3,
    icon: <HandShake className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "territory_control", level: 15 } as const,
  },
  {
    id: "hollywood_connections",
    name: "Hollywood Connections",
    description: "Invest in the film industry for influence and legitimacy",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο political_connections
    maxLevel: 3,
    icon: <Star className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "political_connections", level: 10 } as const,
  },
  {
    id: "godfather_status",
    name: "Godfather Status",
    description: "Become the ultimate respected figure in the community",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Crown className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "political_connections", level: 15 } as const,
  },
]

// Διαφορετικές επιχειρήσεις/περιοχές
const TERRITORIES = [
  { emoji: "🏙️", name: "Little Italy", value: 1 },
  { emoji: "🍝", name: "Restaurant", value: 2 },
  { emoji: "🎰", name: "Casino", value: 3 },
  { emoji: "🏨", name: "Hotel", value: 4 },
  { emoji: "🎭", name: "Theater", value: 5 },
  { emoji: "🏦", name: "Bank", value: 6 },
  { emoji: "🚢", name: "Port", value: 7 },
  { emoji: "🏭", name: "Factory", value: 8 },
  { emoji: "🏪", name: "Retail", value: 9 },
  { emoji: "🍷", name: "Vineyard", value: 10 },
  { emoji: "🎬", name: "Studio", value: 11 },
  { emoji: "🏛️", name: "City Hall", value: 12 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const GODFATHER_QUOTES = [
  "I'm gonna make him an offer he can't refuse.",
  "A man who doesn't spend time with his family can never be a real man.",
  "Great men are not born great, they grow great.",
  "Revenge is a dish best served cold.",
  "Keep your friends close, but your enemies closer.",
  "Never hate your enemies. It affects your judgment.",
  "A friend should always underestimate your virtues and an enemy overestimate your faults.",
  "Friendship is everything. Friendship is more than talent.",
  "I don't trust society to protect us, I have no intention of placing my fate in the hands of men.",
  "Never tell anybody outside the family what you're thinking again.",
]

// Επίπεδα σεβασμού και απαιτούμενοι πόντοι
const RESPECT_LEVELS = [
  { name: "Associate", threshold: 0 },
  { name: "Soldier", threshold: 100 },
  { name: "Capo", threshold: 500 },
  { name: "Underboss", threshold: 2000 },
  { name: "Consigliere", threshold: 5000 },
  { name: "Don", threshold: 10000 },
  { name: "Godfather", threshold: 25000 },
  { name: "Capo di tutti Capi", threshold: 50000 },
  { name: "Legendary Don", threshold: 100000 },
  { name: "The Last Don", threshold: 250000 },
]

const formatRespect = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const GodfatherClicker = () => {
  const [respect, setRespect] = useState(0)
  const [familyLoyalty, setFamilyLoyalty] = useState(1)
  const [businessVentures, setBusinessVentures] = useState(0)
  const [territoryControl, setTerritoryControl] = useState(1)
  const [politicalConnections, setPoliticalConnections] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; territory?: string }>
  >([])
  const [territoriesOwned, setTerritoriesOwned] = useState<Record<string, number>>({})
  const [availableTerritories, setAvailableTerritories] = useState(4) // Αρχικά διαθέσιμες περιοχές
  const [familyStreak, setFamilyStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced
  const [randomQuote, setRandomQuote] = useState("")

  // Επιλογή τυχαίου quote κατά την αρχικοποίηση
  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * GODFATHER_QUOTES.length)
    setRandomQuote(GODFATHER_QUOTES[quoteIndex])
  }, [])

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("godfather-clicker-progress")
    if (savedProgress) {
      try {
        const {
          respect: savedRespect,
          familyLoyalty: savedFamilyLoyalty,
          businessVentures: savedBusinessVentures,
          territoryControl: savedTerritoryControl,
          politicalConnections: savedPoliticalConnections,
          upgrades: savedUpgrades,
          territoriesOwned: savedTerritoriesOwned,
          availableTerritories: savedAvailableTerritories,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setFamilyLoyalty(savedFamilyLoyalty || 1)
        setBusinessVentures(savedBusinessVentures || 0)
        setTerritoryControl(savedTerritoryControl || 1)
        setPoliticalConnections(savedPoliticalConnections || 1)
        setUpgrades(savedUpgrades || {})
        setTerritoriesOwned(savedTerritoriesOwned || {})
        setAvailableTerritories(savedAvailableTerritories || 4)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedBusinessVentures > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlineRespect =
            (timeDiff / 1000) * (savedBusinessVentures * savedTerritoryControl * savedPoliticalConnections * 1.0)
          setRespect((savedRespect || 0) + offlineRespect)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlineRespect > 0) {
            setOfflineMessage({
              message: `While you were away, your family businesses generated`,
              amount: offlineRespect,
            })
          }
        } else {
          setRespect(savedRespect || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      respect,
      familyLoyalty,
      businessVentures,
      territoryControl,
      politicalConnections,
      upgrades,
      territoriesOwned,
      availableTerritories,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("godfather-clicker-progress", JSON.stringify(progress))
  }, [
    respect,
    familyLoyalty,
    businessVentures,
    territoryControl,
    politicalConnections,
    upgrades,
    territoriesOwned,
    availableTerritories,
  ])

  const handleClick = useCallback(() => {
    const now = Date.now()

    // Έλεγχος για streak (κλικ μέσα σε 2 δευτερόλεπτα)
    if (now - lastClickTime < 2000) {
      setFamilyStreak((prev) => Math.min(prev + 1, 5))
    } else {
      setFamilyStreak(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και το streak
    const streakBonus = familyStreak * 0.2 // 20% επιπλέον ανά streak
    const baseValue = familyLoyalty * territoryControl * politicalConnections
    const totalValue = baseValue * (1 + streakBonus)

    setRespect((prevRespect) => prevRespect + totalValue)

    // Προσθήκη τυχαίας περιοχής στη συλλογή
    const availableTerritoryTypes = Math.min(availableTerritories, TERRITORIES.length)
    const randomTerritory = TERRITORIES[Math.floor(Math.random() * availableTerritoryTypes)]

    setTerritoriesOwned((prev) => ({
      ...prev,
      [randomTerritory.name]: (prev[randomTerritory.name] || 0) + 0.1, // Προσθέτουμε μέρος μιας περιοχής με κάθε κλικ
    }))

    // Προσθήκη εφέ κλικ
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Τυχαία θέση μεταξύ 10% και 90%
    const y = Math.random() * 80 + 10

    // Επιλογή τυχαίου quote
    const quoteIndex = Math.floor(Math.random() * GODFATHER_QUOTES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: GODFATHER_QUOTES[quoteIndex],
          territory: randomTerritory.emoji,
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [familyLoyalty, territoryControl, politicalConnections, familyStreak, lastClickTime, availableTerritories])

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

      if (respect >= cost) {
        setRespect((prevRespect) => prevRespect - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "family_loyalty") {
            setFamilyLoyalty((prev) => prev + upgrade.effect)
          } else if (upgradeId === "business_ventures") {
            setBusinessVentures((prev) => prev + upgrade.effect)
          } else if (upgradeId === "territory_control") {
            setTerritoryControl((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων περιοχών με κάθε αναβάθμιση territory_control
            setAvailableTerritories((prev) => Math.min(prev + 1, TERRITORIES.length))
          } else if (upgradeId === "political_connections") {
            setPoliticalConnections((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "consigliere") {
            setFamilyLoyalty((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "international_expansion") {
            setBusinessVentures((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "strategic_alliances") {
            setTerritoryControl((prev) => prev * (1 + upgrade.effect))
            setAvailableTerritories((prev) => Math.min(prev + 2, TERRITORIES.length))
          } else if (upgradeId === "hollywood_connections") {
            setPoliticalConnections((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "godfather_status") {
            // Διπλασιασμός όλων
            setFamilyLoyalty((prev) => prev * 2)
            setBusinessVentures((prev) => prev * 2)
            setTerritoryControl((prev) => prev * 2)
            setPoliticalConnections((prev) => prev * 2)
            setAvailableTerritories(TERRITORIES.length) // Ξεκλείδωμα όλων των περιοχών
          }
        }
      }
    },
    [respect, upgrades],
  )

  // Αυτόματη παραγωγή πόντων από τις επιχειρήσεις
  useEffect(() => {
    const interval = setInterval(() => {
      if (businessVentures > 0) {
        const passiveValue = businessVentures * territoryControl * politicalConnections
        setRespect((prevRespect) => prevRespect + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέα περιοχή από τις επιχειρήσεις
        if (Math.random() < 0.1) {
          const availableTerritoryTypes = Math.min(availableTerritories, TERRITORIES.length)
          const randomTerritory = TERRITORIES[Math.floor(Math.random() * availableTerritoryTypes)]

          setTerritoriesOwned((prev) => ({
            ...prev,
            [randomTerritory.name]: (prev[randomTerritory.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [businessVentures, territoryControl, politicalConnections, availableTerritories])

  // Υπολογισμός του τρέχοντος επιπέδου σεβασμού με βάση τους πόντους
  const getCurrentRespectLevel = () => {
    for (let i = RESPECT_LEVELS.length - 1; i >= 0; i--) {
      if (respect >= RESPECT_LEVELS[i].threshold) {
        return RESPECT_LEVELS[i].name
      }
    }
    return RESPECT_LEVELS[0].name
  }

  // Υπολογισμός προόδου προς το επόμενο επίπεδο σεβασμού
  const getNextRespectProgress = () => {
    const currentLevel = getCurrentRespectLevel()
    const currentLevelIndex = RESPECT_LEVELS.findIndex((level) => level.name === currentLevel)

    if (currentLevelIndex === RESPECT_LEVELS.length - 1) {
      return 100 // Ήδη στο μέγιστο επίπεδο
    }

    const currentThreshold = RESPECT_LEVELS[currentLevelIndex].threshold
    const nextThreshold = RESPECT_LEVELS[currentLevelIndex + 1].threshold
    const progress = ((respect - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Υπολογισμός του επόμενου επιπέδου σεβασμού
  const getNextRespectLevel = () => {
    const currentLevel = getCurrentRespectLevel()
    const currentLevelIndex = RESPECT_LEVELS.findIndex((level) => level.name === currentLevel)

    if (currentLevelIndex === RESPECT_LEVELS.length - 1) {
      return null // Ήδη στο μέγιστο επίπεδο
    }

    return RESPECT_LEVELS[currentLevelIndex + 1].name
  }

  // Υπολογισμός του συνολικού αριθμού περιοχών που ελέγχονται
  const calculateTotalTerritories = () => {
    return Object.values(territoriesOwned).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center godfather-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="vintage-filter"></div>
      <div className="film-grain"></div>

      {/* Rose petals for visual effect */}
      <div className="rose-petals">
        {Array.from({ length: 10 }).map((_, index) => {
          const size = Math.random() * 30 + 10
          const left = Math.random() * 100
          const delay = Math.random() * 15
          const duration = Math.random() * 10 + 10

          return (
            <div
              key={index}
              className="rose-petal"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `-${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-black/90 backdrop-blur-lg border border-amber-700/50 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-red-900 to-amber-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-amber-300">The Godfather</CardTitle>
            <CardDescription className="text-center text-amber-200/80">
              Build your family empire and earn respect
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-sm font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                  color: "rgba(212, 175, 55, 0.8)",
                }}
              >
                <div className="flex items-center">
                  {effect.territory && <span className="text-xl mr-2">{effect.territory}</span>}
                  <span className="italic">{effect.text}</span>
                </div>
              </div>
            ))}

            <div className="godfather-quote">"{randomQuote}"</div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <HandShake className="h-5 w-5 mr-2 text-amber-500" />
                <p className="text-lg font-bold text-amber-400">Respect: {formatRespect(respect)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-amber-400/80">
                  Rank: <span className="font-bold">{getCurrentRespectLevel()}</span>
                </p>
              </div>
            </div>

            {/* Respect progress bar */}
            {getNextRespectLevel() && (
              <div className="mb-2">
                <div className="respect-progress">
                  <div className="respect-progress-fill" style={{ width: `${getNextRespectProgress()}%` }}></div>
                </div>
                <div className="respect-label">Next: {getNextRespectLevel()}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-amber-900/30 p-2 rounded-lg">
                <p className="text-xs text-amber-400/80">Family Loyalty</p>
                <p className="text-sm font-medium text-amber-300">Level {Math.floor(familyLoyalty)}</p>
              </div>
              <div className="bg-amber-900/30 p-2 rounded-lg">
                <p className="text-xs text-amber-400/80">Business Income</p>
                <p className="text-sm font-medium text-amber-300">
                  {formatRespect(businessVentures * territoryControl * politicalConnections)}/s
                </p>
              </div>
              <div className="bg-amber-900/30 p-2 rounded-lg">
                <p className="text-xs text-amber-400/80">Territories</p>
                <p className="text-sm font-medium text-amber-300">{calculateTotalTerritories()}</p>
              </div>
              <div className="bg-amber-900/30 p-2 rounded-lg">
                <p className="text-xs text-amber-400/80">Family Streak</p>
                <p className="text-sm font-medium text-amber-300">
                  x{familyStreak} ({familyStreak * 20}% bonus)
                </p>
              </div>
            </div>

            <div className="territories-grid mb-4">
              {TERRITORIES.slice(0, availableTerritories).map((territory) => {
                const count = Math.floor(territoriesOwned[territory.name] || 0)
                return (
                  <div key={territory.name} className="territory-item" title={`${territory.name}: ${count}`}>
                    <div className="territory-icon">{territory.emoji}</div>
                    <div className="territory-count">{count}</div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-red-900 to-amber-800 hover:from-red-950 hover:to-amber-900 text-amber-300 font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 offer-button"
            >
              <Wine className="h-5 w-5 mr-2" /> Make an Offer
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-red-900 via-amber-900 to-red-900 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-black rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400">
                      Family Business
                    </h3>
                    <p className="text-center mb-4 text-amber-200">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400">
                      {formatRespect(offlineMessage.amount)} respect
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-red-900 to-amber-800 text-amber-300 rounded-lg hover:from-red-950 hover:to-amber-900 transition-all"
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

        <Card className="shadow-md bg-black/90 backdrop-blur-lg border border-amber-700/50">
          <CardHeader className="bg-gradient-to-r from-red-900 to-amber-900 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-amber-300 text-lg sm:text-xl">Family Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-amber-300 text-red-900 font-bold" : "bg-red-900 text-amber-300"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-amber-300 text-red-900 font-bold" : "bg-red-900 text-amber-300"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-amber-200/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Strengthen your family's foundation" : "Expand your influence and power"}
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
                      onClick={() => respect >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-amber-900/30 transition-all ${
                        respect >= cost && !isMaxLevel
                          ? "bg-amber-900/20 hover:bg-amber-900/30 cursor-pointer"
                          : "bg-amber-900/10 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-amber-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-amber-200/80 truncate">{upgrade.description}</p>
                        <p className="text-xs text-amber-200/60">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          respect >= cost && !isMaxLevel ? "bg-gradient-to-r from-red-900 to-amber-800" : "bg-gray-800"
                        } text-amber-300 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatRespect(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Σελίδα 2: Προχωρημένα upgrades
              <>
                <div className="bg-amber-900/20 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-amber-300">
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
                      onClick={() => isUnlocked && respect >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-amber-900/30 transition-all ${
                        isUnlocked
                          ? respect >= cost && !isMaxLevel
                            ? "bg-amber-900/20 hover:bg-amber-900/30 cursor-pointer"
                            : "bg-amber-900/10 opacity-70"
                          : "bg-gray-900/50 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-amber-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-amber-200/80 truncate">{upgrade.description}</p>
                        <p className="text-xs text-amber-200/60">
                          {isUnlocked
                            ? `Level: ${currentLevel}`
                            : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                        </p>
                      </div>
                      <div
                        className={`${
                          isUnlocked && respect >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-red-900 to-amber-800"
                            : "bg-gray-800"
                        } text-amber-300 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatRespect(cost)})`}
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

export default GodfatherClicker
