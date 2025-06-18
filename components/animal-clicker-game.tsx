"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PawPrintIcon as Paw, Leaf, Trees, Bird, Fish, Dog, Cat, Rabbit, Globe } from "lucide-react"

const UPGRADES = [
  {
    id: "animal_care",
    name: "Animal Care",
    description: "Improve your ability to care for animals",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Paw className="h-4 w-4 mr-1" />,
  },
  {
    id: "animal_sanctuary",
    name: "Animal Sanctuary",
    description: "Create a sanctuary that generates animal points automatically",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Trees className="h-4 w-4 mr-1" />,
  },
  {
    id: "biodiversity",
    name: "Biodiversity",
    description: "Increase the variety of animals in your sanctuary",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Leaf className="h-4 w-4 mr-1" />,
  },
  {
    id: "conservation",
    name: "Conservation Efforts",
    description: "Expand your conservation efforts to protect more species",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Globe className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "exotic_animals",
    name: "Exotic Animals",
    description: "Add rare and exotic animals to your sanctuary",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο animal care
    maxLevel: 10,
    icon: <Bird className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "animal_care", level: 10 } as const,
  },
  {
    id: "marine_life",
    name: "Marine Life Center",
    description: "Expand your sanctuary to include marine animals",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο animal sanctuary
    maxLevel: 5,
    icon: <Fish className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "animal_sanctuary", level: 15 } as const,
  },
  {
    id: "breeding_program",
    name: "Breeding Program",
    description: "Start a breeding program for endangered species",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο biodiversity
    maxLevel: 3,
    icon: <Rabbit className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "biodiversity", level: 15 } as const,
  },
  {
    id: "wildlife_rescue",
    name: "Wildlife Rescue Team",
    description: "Form a team to rescue and rehabilitate injured wildlife",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο conservation
    maxLevel: 3,
    icon: <Dog className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "conservation", level: 10 } as const,
  },
  {
    id: "global_conservation",
    name: "Global Conservation Network",
    description: "Create a worldwide network of animal sanctuaries",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Cat className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "conservation", level: 15 } as const,
  },
]

// Διαφορετικοί τύποι ζώων
const ANIMAL_TYPES = [
  { emoji: "🐶", name: "Dog", value: 1 },
  { emoji: "🐱", name: "Cat", value: 1 },
  { emoji: "🐰", name: "Rabbit", value: 2 },
  { emoji: "🐦", name: "Bird", value: 2 },
  { emoji: "🦊", name: "Fox", value: 3 },
  { emoji: "🦁", name: "Lion", value: 5 },
  { emoji: "🐘", name: "Elephant", value: 8 },
  { emoji: "🦒", name: "Giraffe", value: 10 },
  { emoji: "🐬", name: "Dolphin", value: 15 },
  { emoji: "🦓", name: "Zebra", value: 12 },
  { emoji: "🐼", name: "Panda", value: 20 },
  { emoji: "🦧", name: "Orangutan", value: 25 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const ANIMAL_MESSAGES = [
  "🐾 Animal rescued!",
  "🌿 New habitat!",
  "🦁 Wildlife protected!",
  "🐘 Conservation success!",
  "🐼 Endangered species saved!",
  "🦓 Animal thriving!",
  "🦒 New species discovered!",
  "🐬 Marine life protected!",
]

const formatPoints = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const AnimalClicker = () => {
  const [points, setPoints] = useState(0)
  const [animalCare, setAnimalCare] = useState(1)
  const [sanctuary, setSanctuary] = useState(0)
  const [biodiversity, setBiodiversity] = useState(1)
  const [conservation, setConservation] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; animal: string }>
  >([])
  const [animalCollection, setAnimalCollection] = useState<Record<string, number>>({})
  const [availableAnimals, setAvailableAnimals] = useState(4) // Αρχικά διαθέσιμοι τύποι ζώων
  const [environmentStatus, setEnvironmentStatus] = useState(0) // -10 to 10, επηρεάζει τα έσοδα
  const [environmentMultiplier, setEnvironmentMultiplier] = useState(1)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("animal-clicker-progress")
    if (savedProgress) {
      try {
        const {
          points: savedPoints,
          animalCare: savedAnimalCare,
          sanctuary: savedSanctuary,
          biodiversity: savedBiodiversity,
          conservation: savedConservation,
          upgrades: savedUpgrades,
          animalCollection: savedAnimalCollection,
          availableAnimals: savedAvailableAnimals,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setAnimalCare(savedAnimalCare || 1)
        setSanctuary(savedSanctuary || 0)
        setBiodiversity(savedBiodiversity || 1)
        setConservation(savedConservation || 1)
        setUpgrades(savedUpgrades || {})
        setAnimalCollection(savedAnimalCollection || {})
        setAvailableAnimals(savedAvailableAnimals || 4)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedSanctuary > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlinePoints = (timeDiff / 1000) * (savedSanctuary * savedBiodiversity * savedConservation * 1.0)
          setPoints((savedPoints || 0) + offlinePoints)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlinePoints > 0) {
            setOfflineMessage({
              message: `Welcome back, Animal Lover! Your sanctuary generated`,
              amount: offlinePoints,
            })
          }
        } else {
          setPoints(savedPoints || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      points,
      animalCare,
      sanctuary,
      biodiversity,
      conservation,
      upgrades,
      animalCollection,
      availableAnimals,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("animal-clicker-progress", JSON.stringify(progress))
  }, [points, animalCare, sanctuary, biodiversity, conservation, upgrades, animalCollection, availableAnimals])

  // Υπολογισμός του τρέχοντος πολλαπλασιαστή με βάση την κατάσταση του περιβάλλοντος
  useEffect(() => {
    const interval = setInterval(() => {
      // Αλλαγή της κατάστασης του περιβάλλοντος κάθε 15 δευτερόλεπτα
      const statusChange = Math.random() * 4 - 2 // -2 έως 2
      setEnvironmentStatus((prev) => {
        const newStatus = Math.max(-10, Math.min(10, prev + statusChange))
        // Ο πολλαπλασιαστής κυμαίνεται από 0.5 έως 1.5 με βάση την κατάσταση
        const newMultiplier = 1 + newStatus / 20
        setEnvironmentMultiplier(newMultiplier)
        return newStatus
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και τον πολλαπλασιαστή του περιβάλλοντος
    const baseValue = animalCare * biodiversity * conservation
    const totalValue = baseValue * environmentMultiplier

    setPoints((prevPoints) => prevPoints + totalValue)

    // Προσθήκη τυχαίου ζώου στη συλλογή
    const availableAnimalTypes = Math.min(availableAnimals, ANIMAL_TYPES.length)
    const randomAnimal = ANIMAL_TYPES[Math.floor(Math.random() * availableAnimalTypes)]

    setAnimalCollection((prev) => ({
      ...prev,
      [randomAnimal.name]: (prev[randomAnimal.name] || 0) + 0.1, // Προσθέτουμε μέρος ενός ζώου με κάθε κλικ
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random message
    const messageIndex = Math.floor(Math.random() * ANIMAL_MESSAGES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: ANIMAL_MESSAGES[messageIndex],
          animal: randomAnimal.emoji,
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [animalCare, biodiversity, conservation, environmentMultiplier, availableAnimals])

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

      if (points >= cost) {
        setPoints((prevPoints) => prevPoints - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "animal_care") {
            setAnimalCare((prev) => prev + upgrade.effect)
          } else if (upgradeId === "animal_sanctuary") {
            setSanctuary((prev) => prev + upgrade.effect)
          } else if (upgradeId === "biodiversity") {
            setBiodiversity((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων τύπων ζώων με κάθε αναβάθμιση biodiversity
            setAvailableAnimals((prev) => Math.min(prev + 1, ANIMAL_TYPES.length))
          } else if (upgradeId === "conservation") {
            setConservation((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "exotic_animals") {
            setAnimalCare((prev) => prev * (1 + upgrade.effect))
            setAvailableAnimals((prev) => Math.min(prev + 2, ANIMAL_TYPES.length))
          } else if (upgradeId === "marine_life") {
            setSanctuary((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "breeding_program") {
            setBiodiversity((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "wildlife_rescue") {
            setConservation((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "global_conservation") {
            // Διπλασιασμός όλων
            setAnimalCare((prev) => prev * 2)
            setSanctuary((prev) => prev * 2)
            setBiodiversity((prev) => prev * 2)
            setConservation((prev) => prev * 2)
            setAvailableAnimals(ANIMAL_TYPES.length) // Ξεκλείδωμα όλων των ζώων
          }
        }
      }
    },
    [points, upgrades],
  )

  // Αυτόματη παραγωγή πόντων από το καταφύγιο
  useEffect(() => {
    const interval = setInterval(() => {
      if (sanctuary > 0) {
        const passiveValue = sanctuary * biodiversity * conservation * environmentMultiplier
        setPoints((prevPoints) => prevPoints + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέο ζώο από το καταφύγιο
        if (Math.random() < 0.1) {
          const availableAnimalTypes = Math.min(availableAnimals, ANIMAL_TYPES.length)
          const randomAnimal = ANIMAL_TYPES[Math.floor(Math.random() * availableAnimalTypes)]

          setAnimalCollection((prev) => ({
            ...prev,
            [randomAnimal.name]: (prev[randomAnimal.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [sanctuary, biodiversity, conservation, environmentMultiplier, availableAnimals])

  // Υπολογισμός του χρώματος της κατάστασης του περιβάλλοντος
  const getEnvironmentColor = () => {
    if (environmentStatus > 2) return "text-green-500"
    if (environmentStatus < -2) return "text-red-500"
    return "text-yellow-500"
  }

  // Υπολογισμός του εικονιδίου της κατάστασης του περιβάλλοντος
  const getEnvironmentIcon = () => {
    if (environmentStatus > 2) return "🌳"
    if (environmentStatus < -2) return "🏭"
    return "🌱"
  }

  // Υπολογισμός του συνολικού αριθμού ζώων
  const calculateTotalAnimals = () => {
    return Object.values(animalCollection).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center animal-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="nature-scene"></div>
      <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-green-300 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">Animal Sanctuary</CardTitle>
            <CardDescription className="text-center text-white/80">
              Rescue animals and build your wildlife sanctuary!
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
                }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{effect.animal}</span>
                  <span className="text-green-700">{effect.text}</span>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Paw className="h-5 w-5 mr-2 text-green-600" />
                <p className="text-lg font-bold text-green-700">Points: {formatPoints(points)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-gray-600">
                  Environment:{" "}
                  <span className={getEnvironmentColor()}>
                    {getEnvironmentIcon()} {(environmentMultiplier * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Animals Rescued</p>
                <p className="text-sm font-medium">{calculateTotalAnimals()}</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Sanctuary Income</p>
                <p className="text-sm font-medium">
                  {formatPoints(sanctuary * biodiversity * conservation * environmentMultiplier)}/s
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Animal Care</p>
                <p className="text-sm font-medium">Level {Math.floor(animalCare)}</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Biodiversity</p>
                <p className="text-sm font-medium">Level {Math.floor(biodiversity)}</p>
              </div>
            </div>

            <div className="animal-grid mb-4">
              {ANIMAL_TYPES.slice(0, availableAnimals).map((animal) => {
                const count = Math.floor(animalCollection[animal.name] || 0)
                return (
                  <div key={animal.name} className="animal-item" title={`${animal.name}: ${count}`}>
                    <div className="animal-emoji">{animal.emoji}</div>
                    <div className="animal-count">{count}</div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 animal-button"
            >
              <Paw className="h-5 w-5 mr-2" /> Rescue Animals
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-600">
                      Wildlife Update!
                    </h3>
                    <p className="text-center mb-4">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-500 to-green-600">
                      {formatPoints(offlineMessage.amount)} points
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all"
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

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-green-300">
          <CardHeader className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Sanctuary Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-green-600 font-bold" : "bg-green-600 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-green-600 font-bold" : "bg-green-600 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your animal sanctuary" : "Advanced upgrades for wildlife conservation"}
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
                      onClick={() => points >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-100 transition-all ${
                        points >= cost && !isMaxLevel
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
                          points >= cost && !isMaxLevel ? "bg-gradient-to-r from-green-600 to-green-500" : "bg-gray-300"
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
                      onClick={() => isUnlocked && points >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-green-100 transition-all ${
                        isUnlocked
                          ? points >= cost && !isMaxLevel
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
                          isUnlocked && points >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-green-600 to-green-500"
                            : "bg-gray-300"
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

export default AnimalClicker
