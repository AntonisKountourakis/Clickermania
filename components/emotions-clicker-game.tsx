"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, Smile, Moon, Music, Users, Sparkles, Star, BookOpen, Palette } from "lucide-react"

// Προσθέτω τα κινούμενα σωματίδια στο component
const PARTICLE_COLORS = [
  "#ff0080", // Ροζ
  "#ff8c00", // Πορτοκαλί
  "#ffff00", // Κίτρινο
  "#00ff00", // Πράσινο
  "#00ffff", // Γαλάζιο
  "#0080ff", // Μπλε
  "#8000ff", // Μωβ
]

const UPGRADES = [
  {
    id: "emotional_awareness",
    name: "Emotional Awareness",
    description: "Increase your ability to recognize emotions",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Smile className="h-4 w-4 mr-1" />,
  },
  {
    id: "meditation",
    name: "Meditation",
    description: "Generate emotions automatically through mindfulness",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Moon className="h-4 w-4 mr-1" />,
  },
  {
    id: "social_connections",
    name: "Social Connections",
    description: "Build relationships that enhance emotional experiences",
    basePrice: 50,
    priceMultiplier: 1.8,
    effect: 2,
    maxLevel: 30,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    id: "creative_expression",
    name: "Creative Expression",
    description: "Express emotions through art and creativity",
    basePrice: 100,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Music className="h-4 w-4 mr-1" />,
  },
  {
    id: "emotional_intelligence",
    name: "Emotional Intelligence",
    description: "Master the understanding and management of emotions",
    basePrice: 250,
    priceMultiplier: 2.5,
    effect: 10,
    maxLevel: 10,
    icon: <Sparkles className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "empathy_mastery",
    name: "Empathy Mastery",
    description: "Develop profound empathy to connect with others on a deeper level",
    basePrice: 500,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο emotional awareness
    maxLevel: 5,
    icon: <Heart className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "emotional_awareness", level: 15 } as const,
  },
  {
    id: "mindfulness_expert",
    name: "Mindfulness Expert",
    description: "Become a master of mindfulness and present-moment awareness",
    basePrice: 1000,
    priceMultiplier: 2.5,
    effect: 0.3, // 30% αύξηση στο meditation
    maxLevel: 5,
    icon: <Moon className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "meditation", level: 20 } as const,
  },
  {
    id: "emotional_philosopher",
    name: "Emotional Philosopher",
    description: "Develop profound insights into the nature of emotions",
    basePrice: 2500,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο emotional intelligence
    maxLevel: 3,
    icon: <BookOpen className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "emotional_intelligence", level: 5 } as const,
  },
  {
    id: "artistic_genius",
    name: "Artistic Genius",
    description: "Channel emotions into world-class artistic creations",
    basePrice: 5000,
    priceMultiplier: 3.5,
    effect: 0.4, // 40% αύξηση σε όλα
    maxLevel: 3,
    icon: <Palette className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "creative_expression", level: 15 } as const,
  },
  {
    id: "emotional_harmony",
    name: "Emotional Harmony",
    description: "Achieve perfect balance and harmony of all emotions",
    basePrice: 10000,
    priceMultiplier: 4.0,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Star className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "social_connections", level: 20 } as const,
  },
]

// Διαφορετικά συναισθήματα για τα εφέ κλικ
const EMOTIONS = [
  { emoji: "😊", name: "Joy", color: "#FFD700" },
  { emoji: "❤️", name: "Love", color: "#FF6B6B" },
  { emoji: "😌", name: "Peace", color: "#87CEFA" },
  { emoji: "✨", name: "Wonder", color: "#9370DB" },
  { emoji: "😃", name: "Excitement", color: "#FF7F50" },
  { emoji: "🥰", name: "Gratitude", color: "#98FB98" },
  { emoji: "😎", name: "Confidence", color: "#20B2AA" },
  { emoji: "🤗", name: "Compassion", color: "#DDA0DD" },
  { emoji: "😇", name: "Serenity", color: "#B0E0E6" },
  { emoji: "🌟", name: "Inspiration", color: "#FFD700" },
]

// Προσθήκη της συνάρτησης formatMoney μετά τα EMOTIONS

const formatMoney = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const EmotionsClicker = () => {
  const [emotions, setEmotions] = useState(0)
  const [emotionalAwareness, setEmotionalAwareness] = useState(1)
  const [meditation, setMeditation] = useState(0)
  const [socialConnections, setSocialConnections] = useState(1)
  const [creativeExpression, setCreativeExpression] = useState(1)
  const [emotionalIntelligence, setEmotionalIntelligence] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; emotion: (typeof EMOTIONS)[0] }>
  >([])
  const [emotionBalance, setEmotionBalance] = useState<Record<string, number>>({})
  const [emotionVariety, setEmotionVariety] = useState(3) // Αρχικά διαθέσιμα συναισθήματα
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("emotions-clicker-progress")
    if (savedProgress) {
      try {
        const {
          emotions: savedEmotions,
          emotionalAwareness: savedEmotionalAwareness,
          meditation: savedMeditation,
          socialConnections: savedSocialConnections,
          creativeExpression: savedCreativeExpression,
          emotionalIntelligence: savedEmotionalIntelligence,
          upgrades: savedUpgrades,
          emotionBalance: savedEmotionBalance,
          emotionVariety: savedEmotionVariety,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setEmotionalAwareness(savedEmotionalAwareness || 1)
        setMeditation(savedMeditation || 0)
        setSocialConnections(savedSocialConnections || 1)
        setCreativeExpression(savedCreativeExpression || 1)
        setEmotionalIntelligence(savedEmotionalIntelligence || 1)
        setUpgrades(savedUpgrades || {})
        setEmotionBalance(savedEmotionBalance || {})
        setEmotionVariety(savedEmotionVariety || 3)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedMeditation > 0) {
          // Υπολογισμός συναισθημάτων που παρήχθησαν offline (σε δευτερόλεπτα)
          const offlineEmotions = (timeDiff / 1000) * (savedMeditation * 0.5 * savedEmotionalIntelligence)
          setEmotions((savedEmotions || 0) + offlineEmotions)

          // Εμφάνιση μηνύματος για τα συναισθήματα που παρήχθησαν offline
          if (offlineEmotions > 0) {
            setOfflineMessage({
              message: `Welcome back! You've experienced`,
              amount: offlineEmotions,
            })
          }
        } else {
          setEmotions(savedEmotions || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      emotions,
      emotionalAwareness,
      meditation,
      socialConnections,
      creativeExpression,
      emotionalIntelligence,
      upgrades,
      emotionBalance,
      emotionVariety,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("emotions-clicker-progress", JSON.stringify(progress))
  }, [
    emotions,
    emotionalAwareness,
    meditation,
    socialConnections,
    creativeExpression,
    emotionalIntelligence,
    upgrades,
    emotionBalance,
    emotionVariety,
  ])

  const handleClick = useCallback(() => {
    // Υπολογισμός αξίας κλικ με βάση τις αναβαθμίσεις
    const emotionValue = emotionalAwareness * socialConnections * (1 + emotionalIntelligence * 0.1)
    setEmotions((prevEmotions) => prevEmotions + emotionValue)

    // Επιλογή τυχαίου συναισθήματος με βάση την ποικιλία συναισθημάτων
    const availableEmotionsCount = Math.min(emotionVariety, EMOTIONS.length)
    const randomEmotion = EMOTIONS[Math.floor(Math.random() * availableEmotionsCount)]

    // Ενημέρωση του ισοζυγίου συναισθημάτων
    setEmotionBalance((prev) => ({
      ...prev,
      [randomEmotion.name]: (prev[randomEmotion.name] || 0) + 1,
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random emotion based on variety
    const availableEmotionsCount2 = Math.min(emotionVariety, EMOTIONS.length)
    const randomEmotion2 = EMOTIONS[Math.floor(Math.random() * availableEmotionsCount2)]

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [...prev, { id, x, y, emotion: randomEmotion2 }].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [emotionalAwareness, socialConnections, emotionalIntelligence, emotionVariety])

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

      if (emotions >= cost) {
        setEmotions((prevEmotions) => prevEmotions - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "emotional_awareness") {
            setEmotionalAwareness((prev) => prev + upgrade.effect)
          } else if (upgradeId === "meditation") {
            setMeditation((prev) => prev + upgrade.effect)
          } else if (upgradeId === "social_connections") {
            setSocialConnections((prev) => prev + upgrade.effect)
            // Αύξηση της ποικιλίας συναισθημάτων με κάθε αναβάθμιση κοινωνικών συνδέσεων
            setEmotionVariety((prev) => Math.min(prev + 1, EMOTIONS.length))
          } else if (upgradeId === "creative_expression") {
            setCreativeExpression((prev) => prev + upgrade.effect)
          } else if (upgradeId === "emotional_intelligence") {
            setEmotionalIntelligence((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "empathy_mastery") {
            setEmotionalAwareness((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "mindfulness_expert") {
            setMeditation((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "emotional_philosopher") {
            setEmotionalIntelligence((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "artistic_genius") {
            // Αύξηση όλων των παραμέτρων
            setEmotionalAwareness((prev) => prev * (1 + upgrade.effect * 0.25))
            setMeditation((prev) => prev * (1 + upgrade.effect * 0.25))
            setSocialConnections((prev) => prev * (1 + upgrade.effect * 0.25))
            setCreativeExpression((prev) => prev * (1 + upgrade.effect * 0.5))
          } else if (upgradeId === "emotional_harmony") {
            // Διπλασιασμός όλων
            setEmotionalAwareness((prev) => prev * 2)
            setMeditation((prev) => prev * 2)
            setSocialConnections((prev) => prev * 2)
            setCreativeExpression((prev) => prev * 2)
            setEmotionalIntelligence((prev) => prev * 2)
            setEmotionVariety(EMOTIONS.length) // Ξεκλείδωμα όλων των συναισθημάτων
          }
        }
      }
    },
    [emotions, upgrades],
  )

  // Αυτόματη παραγωγή συναισθημάτων μέσω διαλογισμού
  useEffect(() => {
    const interval = setInterval(() => {
      if (meditation > 0) {
        const autoValue = meditation * 0.5 * emotionalIntelligence
        setEmotions((prevEmotions) => prevEmotions + autoValue)

        // Προσθήκη τυχαίου συναισθήματος στο ισοζύγιο
        const availableEmotionsCount = Math.min(emotionVariety, EMOTIONS.length)
        const randomEmotion = EMOTIONS[Math.floor(Math.random() * availableEmotionsCount)]

        setEmotionBalance((prev) => ({
          ...prev,
          [randomEmotion.name]: (prev[randomEmotion.name] || 0) + 0.5,
        }))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [meditation, emotionalIntelligence, emotionVariety])

  // Υπολογισμός του κυρίαρχου συναισθήματος
  const getDominantEmotion = () => {
    if (Object.keys(emotionBalance).length === 0) return null

    let dominant = { name: "", value: 0 }
    Object.entries(emotionBalance).forEach(([name, value]) => {
      if (value > dominant.value) {
        dominant = { name, value }
      }
    })

    return dominant.name
  }

  // Εύρεση του emoji για το συναίσθημα
  const getEmotionEmoji = (emotionName: string) => {
    const emotion = EMOTIONS.find((e) => e.name === emotionName)
    return emotion ? emotion.emoji : "😊"
  }

  const dominantEmotion = getDominantEmotion()

  return (
    <div className="min-h-screen flex items-center justify-center emotions-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="emotion-particles">
        {Array.from({ length: 20 }).map((_, index) => {
          const size = Math.random() * 50 + 20
          const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
          const left = Math.random() * 100
          const delay = Math.random() * 15
          const duration = Math.random() * 10 + 10

          return (
            <div
              key={index}
              className="emotion-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                left: `${left}%`,
                bottom: `-${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-purple-300 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Emotions Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">
              Experience and collect different emotions!
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
                  color: effect.emotion.color,
                }}
              >
                {effect.emotion.emoji} {effect.emotion.name}
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-pink-500" />
                <p className="text-lg font-bold text-purple-700">Emotions: {formatMoney(emotions)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600">Awareness: {emotionalAwareness.toFixed(1)}</p>
                <p className="text-sm text-gray-600">
                  Auto: +{formatMoney(meditation * 0.5 * emotionalIntelligence)}/s
                </p>
              </div>
            </div>

            {dominantEmotion && (
              <div className="mb-4 p-2 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-purple-700">
                  Dominant Emotion: {getEmotionEmoji(dominantEmotion)} {dominantEmotion}
                </p>
              </div>
            )}

            <div className="grid grid-cols-5 gap-1 mb-4">
              {EMOTIONS.slice(0, emotionVariety).map((emotion) => (
                <div
                  key={emotion.name}
                  className="text-center p-1 rounded-md"
                  style={{ opacity: emotionBalance[emotion.name] ? 1 : 0.3 }}
                  title={`${emotion.name}: ${Math.floor(emotionBalance[emotion.name] || 0)}`}
                >
                  <div className="text-xl">{emotion.emoji}</div>
                  <div className="text-xs truncate">{formatMoney(emotionBalance[emotion.name] || 0)}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Feel Emotions
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-purple-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Emotional Growth</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-purple-500 font-bold" : "bg-purple-600 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-purple-500 font-bold" : "bg-purple-600 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Enhance your emotional experiences" : "Transcendent emotional upgrades"}
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
                      onClick={() => emotions >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-100 transition-all ${
                        emotions >= cost && !isMaxLevel
                          ? "bg-purple-50 hover:bg-purple-100 cursor-pointer"
                          : "bg-purple-50/70 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          emotions >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-gray-300"
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
                <div className="bg-purple-50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-purple-800">
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
                      onClick={() => isUnlocked && emotions >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-purple-100 transition-all ${
                        isUnlocked
                          ? emotions >= cost && !isMaxLevel
                            ? "bg-purple-50 hover:bg-purple-100 cursor-pointer"
                            : "bg-purple-50/70 opacity-70"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-800 flex items-center text-sm">
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
                          isUnlocked && emotions >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
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
      </div>
      {/* Offline Progress Message */}
      {offlineMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
          <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-1 rounded-xl animate-pulse max-w-md w-full">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                Emotional Journey!
              </h3>
              <p className="text-center mb-4 text-gray-700 dark:text-gray-300">{offlineMessage.message}</p>
              <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                {formatMoney(offlineMessage.amount)} emotions
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setOfflineMessage(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Collect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmotionsClicker
