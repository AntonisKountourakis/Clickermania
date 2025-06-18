"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Skull,
  Zap,
  Dna,
  Footprints,
  Eye,
  Moon,
  Flame,
  CloudFog,
  FanIcon as Fangs,
  SkullIcon as MonsterSkull,
  SkullIcon as BeastSkull,
} from "lucide-react"

const UPGRADES = [
  {
    id: "monster_strength",
    name: "Monster Strength",
    description: "Increase your monster's physical power",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Skull className="h-4 w-4 mr-1" />,
  },
  {
    id: "haunting_ability",
    name: "Haunting Ability",
    description: "Generate fear automatically by haunting",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <CloudFog className="h-4 w-4 mr-1" />,
  },
  {
    id: "mutation",
    name: "Mutation",
    description: "Evolve your monster with new terrifying features",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Dna className="h-4 w-4 mr-1" />,
  },
  {
    id: "hunting_skills",
    name: "Hunting Skills",
    description: "Improve your ability to hunt and scare prey",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Footprints className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "night_vision",
    name: "Night Vision",
    description: "See perfectly in the dark to hunt more effectively",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο monster_strength
    maxLevel: 10,
    icon: <Eye className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "monster_strength", level: 10 } as const,
  },
  {
    id: "nocturnal_power",
    name: "Nocturnal Power",
    description: "Gain extra strength during the night",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο haunting_ability
    maxLevel: 5,
    icon: <Moon className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "haunting_ability", level: 15 } as const,
  },
  {
    id: "elemental_adaptation",
    name: "Elemental Adaptation",
    description: "Adapt to different environments for more effective hunting",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο mutation
    maxLevel: 3,
    icon: <Flame className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "mutation", level: 15 } as const,
  },
  {
    id: "apex_predator",
    name: "Apex Predator",
    description: "Become the ultimate predator in your ecosystem",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο hunting_skills
    maxLevel: 3,
    icon: <Fangs className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "hunting_skills", level: 10 } as const,
  },
  {
    id: "legendary_beast",
    name: "Legendary Beast",
    description: "Transform into a creature of legend that inspires terror in all",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <BeastSkull className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "hunting_skills", level: 15 } as const,
  },
]

// Διαφορετικά είδη τεράτων
const MONSTER_TYPES = [
  { emoji: "👹", name: "Ogre", value: 1 },
  { emoji: "👻", name: "Ghost", value: 2 },
  { emoji: "🧟", name: "Zombie", value: 3 },
  { emoji: "🧛", name: "Vampire", value: 4 },
  { emoji: "🐺", name: "Werewolf", value: 5 },
  { emoji: "🦇", name: "Bat", value: 6 },
  { emoji: "🕷️", name: "Spider", value: 7 },
  { emoji: "🐍", name: "Snake", value: 8 },
  { emoji: "🦂", name: "Scorpion", value: 9 },
  { emoji: "🐙", name: "Kraken", value: 10 },
  { emoji: "🐉", name: "Dragon", value: 11 },
  { emoji: "💀", name: "Skeleton", value: 12 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const MONSTER_QUOTES = [
  "Fear me, mortal!",
  "The night is mine!",
  "Run while you can!",
  "I lurk in the shadows!",
  "Your nightmares come alive!",
  "Darkness consumes all!",
  "Hear my terrifying roar!",
  "I am the monster under your bed!",
  "Tremble before me!",
  "Your fear feeds me!",
]

// Επίπεδα εξέλιξης και απαιτούμενοι πόντοι
const EVOLUTION_LEVELS = [
  { name: "Minor Creature", threshold: 0 },
  { name: "Creepy Critter", threshold: 100 },
  { name: "Frightening Beast", threshold: 500 },
  { name: "Terrifying Monster", threshold: 2000 },
  { name: "Nightmare Incarnate", threshold: 5000 },
  { name: "Horror Legend", threshold: 10000 },
  { name: "Eldritch Horror", threshold: 25000 },
  { name: "Ancient Terror", threshold: 50000 },
  { name: "Cosmic Horror", threshold: 100000 },
  { name: "Primordial Fear", threshold: 250000 },
]

const formatFear = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const MonsterClicker = () => {
  const [fear, setFear] = useState(0)
  const [monsterStrength, setMonsterStrength] = useState(1)
  const [hauntingAbility, setHauntingAbility] = useState(0)
  const [mutation, setMutation] = useState(1)
  const [huntingSkills, setHuntingSkills] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; monster?: string }>
  >([])
  const [monstersCollected, setMonstersCollected] = useState<Record<string, number>>({})
  const [availableMonsters, setAvailableMonsters] = useState(4) // Αρχικά διαθέσιμα είδη τεράτων
  const [scareStreak, setScareStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced
  const [randomQuote, setRandomQuote] = useState("")
  const [scareAnimation, setScareAnimation] = useState(false)
  const [lightningFlash, setLightningFlash] = useState(false)
  const [eyes, setEyes] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  // Επιλογή τυχαίου quote κατά την αρχικοποίηση
  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * MONSTER_QUOTES.length)
    setRandomQuote(MONSTER_QUOTES[quoteIndex])

    // Δημιουργία τυχαίων ματιών στο σκοτάδι
    const newEyes = []
    for (let i = 0; i < 5; i++) {
      newEyes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 3,
      })
    }
    setEyes(newEyes)

    // Τυχαίες αστραπές
    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setLightningFlash(true)
        setTimeout(() => setLightningFlash(false), 200)
      }
    }, 5000)

    return () => clearInterval(lightningInterval)
  }, [])

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("monster-clicker-progress")
    if (savedProgress) {
      try {
        const {
          fear: savedFear,
          monsterStrength: savedMonsterStrength,
          hauntingAbility: savedHauntingAbility,
          mutation: savedMutation,
          huntingSkills: savedHuntingSkills,
          upgrades: savedUpgrades,
          monstersCollected: savedMonstersCollected,
          availableMonsters: savedAvailableMonsters,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setMonsterStrength(savedMonsterStrength || 1)
        setHauntingAbility(savedHauntingAbility || 0)
        setMutation(savedMutation || 1)
        setHuntingSkills(savedHuntingSkills || 1)
        setUpgrades(savedUpgrades || {})
        setMonstersCollected(savedMonstersCollected || {})
        setAvailableMonsters(savedAvailableMonsters || 4)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedHauntingAbility > 0) {
          // Υπολογισμός φόβου που παράχθηκε offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlineFear = (timeDiff / 1000) * (savedHauntingAbility * savedMutation * savedHuntingSkills * 1.0)
          setFear((savedFear || 0) + offlineFear)

          // Εμφάνιση μηνύματος για το φόβο που παράχθηκε offline
          if (offlineFear > 0) {
            setOfflineMessage({
              message: `While you were away, your monsters generated`,
              amount: offlineFear,
            })
          }
        } else {
          setFear(savedFear || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      fear,
      monsterStrength,
      hauntingAbility,
      mutation,
      huntingSkills,
      upgrades,
      monstersCollected,
      availableMonsters,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("monster-clicker-progress", JSON.stringify(progress))
  }, [fear, monsterStrength, hauntingAbility, mutation, huntingSkills, upgrades, monstersCollected, availableMonsters])

  const handleClick = useCallback(() => {
    const now = Date.now()

    // Έλεγχος για streak (κλικ μέσα σε 2 δευτερόλεπτα)
    if (now - lastClickTime < 2000) {
      setScareStreak((prev) => Math.min(prev + 1, 5))
    } else {
      setScareStreak(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και το streak
    const streakBonus = scareStreak * 0.2 // 20% επιπλέον ανά streak
    const baseValue = monsterStrength * mutation * huntingSkills
    const totalValue = baseValue * (1 + streakBonus)

    setFear((prevFear) => prevFear + totalValue)

    // Προσθήκη τυχαίου τέρατος στη συλλογή
    const availableMonsterTypes = Math.min(availableMonsters, MONSTER_TYPES.length)
    const randomMonster = MONSTER_TYPES[Math.floor(Math.random() * availableMonsterTypes)]

    setMonstersCollected((prev) => ({
      ...prev,
      [randomMonster.name]: (prev[randomMonster.name] || 0) + 0.1, // Προσθέτουμε μέρος ενός τέρατος με κάθε κλικ
    }))

    // Προσθήκη εφέ κλικ
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Τυχαία θέση μεταξύ 10% και 90%
    const y = Math.random() * 80 + 10

    // Επιλογή τυχαίου quote
    const quoteIndex = Math.floor(Math.random() * MONSTER_QUOTES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: MONSTER_QUOTES[quoteIndex],
          monster: randomMonster.emoji,
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)

    // Εμφάνιση animation τρόμου
    setScareAnimation(true)
    setTimeout(() => {
      setScareAnimation(false)
    }, 500)

    // Τυχαία αστραπή με κάθε κλικ
    if (Math.random() < 0.2) {
      setLightningFlash(true)
      setTimeout(() => setLightningFlash(false), 200)
    }
  }, [monsterStrength, mutation, huntingSkills, scareStreak, lastClickTime, availableMonsters])

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

      if (fear >= cost) {
        setFear((prevFear) => prevFear - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "monster_strength") {
            setMonsterStrength((prev) => prev + upgrade.effect)
          } else if (upgradeId === "haunting_ability") {
            setHauntingAbility((prev) => prev + upgrade.effect)
          } else if (upgradeId === "mutation") {
            setMutation((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων ειδών τεράτων με κάθε αναβάθμιση mutation
            setAvailableMonsters((prev) => Math.min(prev + 1, MONSTER_TYPES.length))
          } else if (upgradeId === "hunting_skills") {
            setHuntingSkills((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "night_vision") {
            setMonsterStrength((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "nocturnal_power") {
            setHauntingAbility((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "elemental_adaptation") {
            setMutation((prev) => prev * (1 + upgrade.effect))
            setAvailableMonsters((prev) => Math.min(prev + 2, MONSTER_TYPES.length))
          } else if (upgradeId === "apex_predator") {
            setHuntingSkills((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "legendary_beast") {
            // Διπλασιασμός όλων
            setMonsterStrength((prev) => prev * 2)
            setHauntingAbility((prev) => prev * 2)
            setMutation((prev) => prev * 2)
            setHuntingSkills((prev) => prev * 2)
            setAvailableMonsters(MONSTER_TYPES.length) // Ξεκλείδωμα όλων των ειδών τεράτων
          }
        }
      }
    },
    [fear, upgrades],
  )

  // Αυτόματη παραγωγή φόβου από το haunting
  useEffect(() => {
    const interval = setInterval(() => {
      if (hauntingAbility > 0) {
        const passiveValue = hauntingAbility * mutation * huntingSkills
        setFear((prevFear) => prevFear + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέο τέρας από το haunting
        if (Math.random() < 0.1) {
          const availableMonsterTypes = Math.min(availableMonsters, MONSTER_TYPES.length)
          const randomMonster = MONSTER_TYPES[Math.floor(Math.random() * availableMonsterTypes)]

          setMonstersCollected((prev) => ({
            ...prev,
            [randomMonster.name]: (prev[randomMonster.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [hauntingAbility, mutation, huntingSkills, availableMonsters])

  // Υπολογισμός του τρέχοντος επιπέδου εξέλιξης με βάση το φόβο
  const getCurrentEvolutionLevel = () => {
    for (let i = EVOLUTION_LEVELS.length - 1; i >= 0; i--) {
      if (fear >= EVOLUTION_LEVELS[i].threshold) {
        return EVOLUTION_LEVELS[i].name
      }
    }
    return EVOLUTION_LEVELS[0].name
  }

  // Υπολογισμός προόδου προς το επόμενο επίπεδο εξέλιξης
  const getNextEvolutionProgress = () => {
    const currentLevel = getCurrentEvolutionLevel()
    const currentLevelIndex = EVOLUTION_LEVELS.findIndex((level) => level.name === currentLevel)

    if (currentLevelIndex === EVOLUTION_LEVELS.length - 1) {
      return 100 // Ήδη στο μέγιστο επίπεδο
    }

    const currentThreshold = EVOLUTION_LEVELS[currentLevelIndex].threshold
    const nextThreshold = EVOLUTION_LEVELS[currentLevelIndex + 1].threshold
    const progress = ((fear - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Υπολογισμός του επόμενου επιπέδου εξέλιξης
  const getNextEvolutionLevel = () => {
    const currentLevel = getCurrentEvolutionLevel()
    const currentLevelIndex = EVOLUTION_LEVELS.findIndex((level) => level.name === currentLevel)

    if (currentLevelIndex === EVOLUTION_LEVELS.length - 1) {
      return null // Ήδη στο μέγιστο επίπεδο
    }

    return EVOLUTION_LEVELS[currentLevelIndex + 1].name
  }

  // Υπολογισμός του συνολικού αριθμού τεράτων που έχουν συλλεχθεί
  const calculateTotalMonsters = () => {
    return Object.values(monstersCollected).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center monster-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="fog-overlay"></div>
      <div className="monster-shadow"></div>

      {/* Lightning flash effect */}
      <div className={`lightning-flash ${lightningFlash ? "opacity-100" : ""}`}></div>

      {/* Eyes in the dark */}
      <div className="eyes-in-dark">
        {eyes.map((eye) => (
          <div
            key={eye.id}
            className="eye"
            style={{
              left: `${eye.x}%`,
              top: `${eye.y}%`,
              width: `${eye.size}px`,
              height: `${eye.size}px`,
            }}
          />
        ))}
      </div>

      {/* Mist particles for visual effect */}
      <div className="mist-particles">
        {Array.from({ length: 10 }).map((_, index) => {
          const size = Math.random() * 30 + 10
          const left = Math.random() * 100
          const delay = Math.random() * 15
          const duration = Math.random() * 10 + 10

          return (
            <div
              key={index}
              className="mist-particle"
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
          className="shadow-md bg-gray-900/90 backdrop-blur-lg border border-purple-700/50 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-purple-900 to-fuchsia-900 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-purple-200">Monster Evolution</CardTitle>
            <CardDescription className="text-center text-purple-200/80">
              Scare humans, evolve your monster, and spread terror
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
                  color: "rgba(139, 92, 246, 0.8)",
                }}
              >
                <div className="flex items-center">
                  {effect.monster && <span className="text-xl mr-2">{effect.monster}</span>}
                  <span className="italic">{effect.text}</span>
                </div>
              </div>
            ))}

            <div className="monster-quote">"{randomQuote}"</div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                <p className="text-lg font-bold text-purple-300">Fear: {formatFear(fear)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-purple-300/80">
                  Evolution: <span className="font-bold">{getCurrentEvolutionLevel()}</span>
                </p>
              </div>
            </div>

            {/* Evolution progress bar */}
            {getNextEvolutionLevel() && (
              <div className="mb-2">
                <div className="evolution-progress">
                  <div className="evolution-progress-fill" style={{ width: `${getNextEvolutionProgress()}%` }}></div>
                </div>
                <div className="evolution-label">Next: {getNextEvolutionLevel()}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-purple-900/30 p-2 rounded-lg">
                <p className="text-xs text-purple-300/80">Monster Strength</p>
                <p className="text-sm font-medium text-purple-300">Level {Math.floor(monsterStrength)}</p>
              </div>
              <div className="bg-purple-900/30 p-2 rounded-lg">
                <p className="text-xs text-purple-300/80">Haunting Income</p>
                <p className="text-sm font-medium text-purple-300">
                  {formatFear(hauntingAbility * mutation * huntingSkills)}/s
                </p>
              </div>
              <div className="bg-purple-900/30 p-2 rounded-lg">
                <p className="text-xs text-purple-300/80">Monsters</p>
                <p className="text-sm font-medium text-purple-300">{calculateTotalMonsters()}</p>
              </div>
              <div className="bg-purple-900/30 p-2 rounded-lg">
                <p className="text-xs text-purple-300/80">Scare Streak</p>
                <p className="text-sm font-medium text-purple-300">
                  x{scareStreak} ({scareStreak * 20}% bonus)
                </p>
              </div>
            </div>

            <div className="monsters-grid mb-4">
              {MONSTER_TYPES.slice(0, availableMonsters).map((monster) => {
                const count = Math.floor(monstersCollected[monster.name] || 0)
                return (
                  <div key={monster.name} className="monster-item" title={`${monster.name}: ${count}`}>
                    <div className="monster-icon">{monster.emoji}</div>
                    <div className="monster-count">{count}</div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-800 hover:from-purple-800 hover:to-fuchsia-900 text-purple-100 font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 scare-button"
            >
              <MonsterSkull className={`h-5 w-5 mr-2 ${scareAnimation ? "scare-animation" : ""}`} /> Scare Humans
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-purple-800 via-fuchsia-700 to-purple-800 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400">
                      Nightmares Spread
                    </h3>
                    <p className="text-center mb-4 text-purple-200">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400">
                      {formatFear(offlineMessage.amount)} fear
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-700 to-fuchsia-800 text-purple-100 rounded-lg hover:from-purple-800 hover:to-fuchsia-900 transition-all"
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

        <Card className="shadow-md bg-gray-900/90 backdrop-blur-lg border border-purple-700/50">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-fuchsia-900 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-purple-200 text-lg sm:text-xl">Monster Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-purple-200 text-purple-900 font-bold" : "bg-purple-900 text-purple-200"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-purple-200 text-purple-900 font-bold" : "bg-purple-900 text-purple-200"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-purple-200/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Enhance your monster's abilities" : "Unlock terrifying advanced powers"}
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
                      onClick={() => fear >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all ${
                        fear >= cost && !isMaxLevel
                          ? "bg-purple-900/20 hover:bg-purple-900/30 cursor-pointer"
                          : "bg-purple-900/10 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-purple-300/80 truncate">{upgrade.description}</p>
                        <p className="text-xs text-purple-300/60">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          fear >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-purple-700 to-fuchsia-800"
                            : "bg-gray-800"
                        } text-purple-200 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatFear(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Σελίδα 2: Προχωρημένα upgrades
              <>
                <div className="bg-purple-900/20 p-2 sm:p-3 rounded-lg mb-3">
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
                      onClick={() => isUnlocked && fear >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-900/30 transition-all ${
                        isUnlocked
                          ? fear >= cost && !isMaxLevel
                            ? "bg-purple-900/20 hover:bg-purple-900/30 cursor-pointer"
                            : "bg-purple-900/10 opacity-70"
                          : "bg-gray-900/50 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-300 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-purple-300/80 truncate">{upgrade.description}</p>
                        <p className="text-xs text-purple-300/60">
                          {isUnlocked
                            ? `Level: ${currentLevel}`
                            : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                        </p>
                      </div>
                      <div
                        className={`${
                          isUnlocked && fear >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-purple-700 to-fuchsia-800"
                            : "bg-gray-800"
                        } text-purple-200 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatFear(cost)})`}
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

export default MonsterClicker
