"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Bomb,
  SoupIcon as Soap,
  Users,
  Building,
  Briefcase,
  Skull,
  Zap,
  Flame,
  Sparkles,
  MessageSquare,
} from "lucide-react"

const UPGRADES = [
  {
    id: "soap_making",
    name: "Soap Making",
    description: "Improve your soap production skills",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Soap className="h-4 w-4 mr-1" />,
  },
  {
    id: "support_group",
    name: "Support Group",
    description: "Expand your network of support groups",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "paper_street",
    name: "Paper Street House",
    description: "Improve your headquarters",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Building className="h-4 w-4 mr-1" />,
  },
  {
    id: "corporate_jobs",
    name: "Corporate Infiltration",
    description: "Place members in corporate jobs",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Briefcase className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "project_mayhem",
    name: "Project Mayhem",
    description: "Initiate organized chaos operations",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο soap_making
    maxLevel: 10,
    icon: <Bomb className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "soap_making", level: 10 } as const,
  },
  {
    id: "space_monkeys",
    name: "Space Monkeys",
    description: "Train dedicated members for special operations",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο support_group
    maxLevel: 5,
    icon: <Zap className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "support_group", level: 15 } as const,
  },
  {
    id: "tyler_persona",
    name: "Tyler Persona",
    description: "Develop your alter ego's charisma and influence",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο paper_street
    maxLevel: 3,
    icon: <Skull className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "paper_street", level: 15 } as const,
  },
  {
    id: "credit_companies",
    name: "Credit Company Targets",
    description: "Target major financial institutions",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο corporate_jobs
    maxLevel: 3,
    icon: <Flame className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "corporate_jobs", level: 10 } as const,
  },
  {
    id: "enlightenment",
    name: "Enlightenment",
    description: "Achieve complete freedom from material possessions",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Sparkles className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "corporate_jobs", level: 15 } as const,
  },
]

// Διαφορετικοί τύποι κανόνων
const RULES = [
  { icon: "1️⃣", name: "First Rule", value: 1 },
  { icon: "2️⃣", name: "Second Rule", value: 2 },
  { icon: "3️⃣", name: "Third Rule", value: 3 },
  { icon: "4️⃣", name: "Fourth Rule", value: 5 },
  { icon: "5️⃣", name: "Fifth Rule", value: 8 },
  { icon: "6️⃣", name: "Sixth Rule", value: 13 },
  { icon: "7️⃣", name: "Seventh Rule", value: 21 },
  { icon: "8️⃣", name: "Eighth Rule", value: 34 },
  { icon: "🧼", name: "Soap Recipe", value: 55 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const FIGHT_CLUB_QUOTES = [
  "You are not your job!",
  "You are not how much money you have!",
  "You are not the car you drive!",
  "You are not the contents of your wallet!",
  "The things you own end up owning you.",
  "It's only after we've lost everything that we're free to do anything.",
  "Self-improvement is masturbation. Self-destruction...",
  "I am Jack's complete lack of surprise.",
  "I am Jack's smirking revenge.",
  "I am Jack's raging bile duct.",
  "I am Jack's cold sweat.",
  "I am Jack's broken heart.",
]

const formatPoints = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const FightClubClicker = () => {
  const [chaos, setChaos] = useState(0)
  const [soapMaking, setSoapMaking] = useState(1)
  const [supportGroup, setSupportGroup] = useState(0)
  const [paperStreet, setPaperStreet] = useState(1)
  const [corporateJobs, setCorporateJobs] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number; text: string }>>([])
  const [rulesLearned, setRulesLearned] = useState<Record<string, number>>({})
  const [availableRules, setAvailableRules] = useState(3) // Αρχικά διαθέσιμοι κανόνες
  const [societyStatus, setSocietyStatus] = useState(0) // -10 to 10, επηρεάζει τα έσοδα
  const [societyMultiplier, setSocietyMultiplier] = useState(1)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced
  const [showFirstRule, setShowFirstRule] = useState(false)

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("fight-club-clicker-progress")
    if (savedProgress) {
      try {
        const {
          chaos: savedChaos,
          soapMaking: savedSoapMaking,
          supportGroup: savedSupportGroup,
          paperStreet: savedPaperStreet,
          corporateJobs: savedCorporateJobs,
          upgrades: savedUpgrades,
          rulesLearned: savedRulesLearned,
          availableRules: savedAvailableRules,
          showFirstRule: savedShowFirstRule,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setSoapMaking(savedSoapMaking || 1)
        setSupportGroup(savedSupportGroup || 0)
        setPaperStreet(savedPaperStreet || 1)
        setCorporateJobs(savedCorporateJobs || 1)
        setUpgrades(savedUpgrades || {})
        setRulesLearned(savedRulesLearned || {})
        setAvailableRules(savedAvailableRules || 3)
        setShowFirstRule(savedShowFirstRule || false)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedSupportGroup > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlineChaos = (timeDiff / 1000) * (savedSupportGroup * savedPaperStreet * savedCorporateJobs * 1.0)
          setChaos((savedChaos || 0) + offlineChaos)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlineChaos > 0) {
            setOfflineMessage({
              message: `While you were away, your members generated`,
              amount: offlineChaos,
            })
          }
        } else {
          setChaos(savedChaos || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      chaos,
      soapMaking,
      supportGroup,
      paperStreet,
      corporateJobs,
      upgrades,
      rulesLearned,
      availableRules,
      showFirstRule,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("fight-club-clicker-progress", JSON.stringify(progress))
  }, [
    chaos,
    soapMaking,
    supportGroup,
    paperStreet,
    corporateJobs,
    upgrades,
    rulesLearned,
    availableRules,
    showFirstRule,
  ])

  // Υπολογισμός του τρέχοντος πολλαπλασιαστή με βάση την κατάσταση της κοινωνίας
  useEffect(() => {
    const interval = setInterval(() => {
      // Αλλαγή της κατάστασης της κοινωνίας κάθε 15 δευτερόλεπτα
      const statusChange = Math.random() * 4 - 2 // -2 έως 2
      setSocietyStatus((prev) => {
        const newStatus = Math.max(-10, Math.min(10, prev + statusChange))
        // Ο πολλαπλασιαστής κυμαίνεται από 0.5 έως 1.5 με βάση την κατάσταση
        const newMultiplier = 1 + newStatus / 20
        setSocietyMultiplier(newMultiplier)
        return newStatus
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και τον κοινωνικό πολλαπλασιαστή
    const baseValue = soapMaking * paperStreet * corporateJobs
    const totalValue = baseValue * societyMultiplier

    setChaos((prevChaos) => prevChaos + totalValue)

    // Προσθήκη τυχαίου κανόνα στη συλλογή
    const availableRuleTypes = Math.min(availableRules, RULES.length)
    const randomRule = RULES[Math.floor(Math.random() * availableRuleTypes)]

    setRulesLearned((prev) => ({
      ...prev,
      [randomRule.name]: (prev[randomRule.name] || 0) + 0.1, // Προσθέτουμε μέρος ενός κανόνα με κάθε κλικ
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random quote
    const quoteIndex = Math.floor(Math.random() * FIGHT_CLUB_QUOTES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: FIGHT_CLUB_QUOTES[quoteIndex],
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)

    // Εμφάνιση του πρώτου κανόνα μετά από αρκετά κλικ
    if (!showFirstRule && chaos > 50) {
      setShowFirstRule(true)
    }
  }, [soapMaking, paperStreet, corporateJobs, societyMultiplier, availableRules, chaos, showFirstRule])

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

      if (chaos >= cost) {
        setChaos((prevChaos) => prevChaos - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "soap_making") {
            setSoapMaking((prev) => prev + upgrade.effect)
          } else if (upgradeId === "support_group") {
            setSupportGroup((prev) => prev + upgrade.effect)
          } else if (upgradeId === "paper_street") {
            setPaperStreet((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων κανόνων με κάθε αναβάθμιση paper_street
            setAvailableRules((prev) => Math.min(prev + 1, RULES.length))
          } else if (upgradeId === "corporate_jobs") {
            setCorporateJobs((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "project_mayhem") {
            setSoapMaking((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "space_monkeys") {
            setSupportGroup((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "tyler_persona") {
            setPaperStreet((prev) => prev * (1 + upgrade.effect))
            setAvailableRules((prev) => Math.min(prev + 2, RULES.length))
          } else if (upgradeId === "credit_companies") {
            setCorporateJobs((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "enlightenment") {
            // Διπλασιασμός όλων
            setSoapMaking((prev) => prev * 2)
            setSupportGroup((prev) => prev * 2)
            setPaperStreet((prev) => prev * 2)
            setCorporateJobs((prev) => prev * 2)
            setAvailableRules(RULES.length) // Ξεκλείδωμα όλων των κανόνων
          }
        }
      }
    },
    [chaos, upgrades],
  )

  // Αυτόματη παραγωγή πόντων από τις ομάδες υποστήριξης
  useEffect(() => {
    const interval = setInterval(() => {
      if (supportGroup > 0) {
        const passiveValue = supportGroup * paperStreet * corporateJobs * societyMultiplier
        setChaos((prevChaos) => prevChaos + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέο κανόνα από τις ομάδες
        if (Math.random() < 0.1) {
          const availableRuleTypes = Math.min(availableRules, RULES.length)
          const randomRule = RULES[Math.floor(Math.random() * availableRuleTypes)]

          setRulesLearned((prev) => ({
            ...prev,
            [randomRule.name]: (prev[randomRule.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [supportGroup, paperStreet, corporateJobs, societyMultiplier, availableRules])

  // Υπολογισμός του χρώματος της κατάστασης της κοινωνίας
  const getSocietyStatusColor = () => {
    if (societyStatus > 2) return "text-red-500"
    if (societyStatus < -2) return "text-green-500"
    return "text-yellow-500"
  }

  // Υπολογισμός του εικονιδίου της κατάστασης της κοινωνίας
  const getSocietyStatusIcon = () => {
    if (societyStatus > 2) return "🔥"
    if (societyStatus < -2) return "💤"
    return "⚖️"
  }

  // Υπολογισμός του συνολικού αριθμού κανόνων
  const calculateTotalRules = () => {
    return Object.values(rulesLearned).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center fightclub-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="static-overlay"></div>

      {/* Soap bubbles for visual effect */}
      {Array.from({ length: 10 }).map((_, index) => {
        const size = Math.random() * 50 + 20
        const left = Math.random() * 100
        const delay = Math.random() * 15
        const duration = Math.random() * 10 + 10

        return (
          <div
            key={index}
            className="soap-bubble"
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

      <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-gray-900/90 backdrop-blur-lg border border-red-900/50 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-gray-900 to-red-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white flicker-text">
              {showFirstRule ? "Project Mayhem" : "Fight Club"}
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              {showFirstRule ? "You do not talk about Fight Club" : "Click to start your journey"}
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
                  color: "rgba(229, 62, 62, 0.8)",
                }}
              >
                {effect.text}
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-red-500" />
                <p className="text-lg font-bold text-red-400">Chaos: {formatPoints(chaos)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-gray-400">
                  Society Status:{" "}
                  <span className={getSocietyStatusColor()}>
                    {getSocietyStatusIcon()} {(societyMultiplier * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Rules Learned</p>
                <p className="text-sm font-medium text-red-300">{calculateTotalRules()}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Support Group Output</p>
                <p className="text-sm font-medium text-red-300">
                  {formatPoints(supportGroup * paperStreet * corporateJobs * societyMultiplier)}/s
                </p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Soap Quality</p>
                <p className="text-sm font-medium text-red-300">Level {Math.floor(soapMaking)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Paper Street</p>
                <p className="text-sm font-medium text-red-300">Level {Math.floor(paperStreet)}</p>
              </div>
            </div>

            {showFirstRule && (
              <div className="rule-grid mb-4">
                {RULES.slice(0, availableRules).map((rule) => {
                  const count = Math.floor(rulesLearned[rule.name] || 0)
                  return (
                    <div key={rule.name} className="rule-item" title={`${rule.name}: ${count}`}>
                      <div className="rule-icon">{rule.icon}</div>
                      <div className="rule-count">{count}</div>
                    </div>
                  )
                })}
              </div>
            )}

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-gray-800 to-red-900 hover:from-gray-900 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 fightclub-button"
            >
              <span className="glitch-text" data-text="Break Things">
                Break Things
              </span>
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500">
                      Project Progress!
                    </h3>
                    <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500">
                      {formatPoints(offlineMessage.amount)} chaos
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-800 to-red-900 text-white rounded-lg hover:from-gray-900 hover:to-red-800 transition-all"
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

        <Card className="shadow-md bg-gray-900/90 backdrop-blur-lg border border-red-900/50">
          <CardHeader className="bg-gradient-to-r from-gray-900 to-red-900 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl flicker-text">Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-red-900 font-bold" : "bg-red-900 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-red-900 font-bold" : "bg-red-900 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your basic operations" : "Advanced upgrades for societal impact"}
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
                      onClick={() => chaos >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-red-900/30 transition-all ${
                        chaos >= cost && !isMaxLevel
                          ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                          : "bg-gray-800/30 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-red-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          chaos >= cost && !isMaxLevel ? "bg-gradient-to-r from-gray-800 to-red-900" : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatPoints(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Σελίδα 2: Προχωρημένα upgrades
              <>
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-red-300">
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
                      onClick={() => isUnlocked && chaos >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-red-900/30 transition-all ${
                        isUnlocked
                          ? chaos >= cost && !isMaxLevel
                            ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                            : "bg-gray-800/30 opacity-70"
                          : "bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-red-300 flex items-center text-sm">
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
                          isUnlocked && chaos >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-gray-800 to-red-900"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatPoints(cost)})`}
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

export default FightClubClicker
