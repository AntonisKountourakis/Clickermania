"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import { AlertCircle, Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GamePreview } from "./game-preview"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

// Τύποι για τα δεδομένα του παιχνιδιού
interface Upgrade {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  icon: string
  unlockRequirement?: { id: string; level: number }
}

interface Rank {
  name: string
  threshold: number
  icon: string
}

interface GameData {
  id: string
  name: string
  description: string
  storageKey: string
  mainStatName: string
  mainStatIcon: string
  secondaryStatName: string
  secondaryStatIcon: string
  clickButtonText: string
  clickButtonIcon: string
  backgroundClass: string
  headerGradientClass: string
  buttonGradientClass: string
  textColorClass: string
  accentColorClass: string
  clickMessages: string[]
  ranks: Rank[]
  upgrades: Upgrade[]
  advancedUpgrades: Upgrade[]
  emoji: string
  color: string
}

// Φορτώνουμε τη δομή του YouTube Clicker
const loadYouTubeClickerTemplate = (): GameData => {
  // Βασική δομή για νέο παιχνίδι
  const newGameId = uuidv4()

  return {
    id: newGameId,
    name: "Νέο Clicker Game",
    description: "Περιγραφή του παιχνιδιού",
    storageKey: `custom-${newGameId}-progress`,
    mainStatName: "Προβολές",
    mainStatIcon: "Eye",
    secondaryStatName: "Συνδρομητές",
    secondaryStatIcon: "Users",
    clickButtonText: "Δημιουργία Βίντεο",
    clickButtonIcon: "Video",
    backgroundClass: "bg-gradient-to-br from-red-500 to-red-800",
    headerGradientClass: "bg-gradient-to-r from-red-600 to-red-800",
    buttonGradientClass: "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800",
    textColorClass: "text-red-600",
    accentColorClass: "text-red-500",
    clickMessages: ["+ 1 προβολή", "Ωραίο βίντεο!", "Trending!", "Viral!"],
    ranks: [
      { name: "Νέος YouTuber", threshold: 0, icon: "🎬" },
      { name: "Ανερχόμενο Αστέρι", threshold: 1000, icon: "⭐" },
      { name: "Δημιουργός Περιεχομένου", threshold: 10000, icon: "🌟" },
      { name: "Influencer", threshold: 100000, icon: "🔥" },
      { name: "YouTube Star", threshold: 1000000, icon: "🌠" },
    ],
    upgrades: [
      {
        id: "better_camera",
        name: "Καλύτερη Κάμερα",
        description: "Αυξάνει τις προβολές ανά κλικ",
        basePrice: 10,
        priceMultiplier: 1.5,
        effect: 1,
        maxLevel: 10,
        icon: "Camera",
      },
      {
        id: "editing_software",
        name: "Λογισμικό Επεξεργασίας",
        description: "Αυξάνει τις αυτόματες προβολές ανά δευτερόλεπτο",
        basePrice: 50,
        priceMultiplier: 1.8,
        effect: 1,
        maxLevel: 10,
        icon: "Edit",
      },
    ],
    advancedUpgrades: [
      {
        id: "viral_marketing",
        name: "Viral Marketing",
        description: "Πολλαπλασιάζει όλες τις προβολές",
        basePrice: 500,
        priceMultiplier: 2.5,
        effect: 0.5,
        maxLevel: 5,
        icon: "TrendingUp",
        unlockRequirement: { id: "better_camera", level: 5 },
      },
      {
        id: "sponsorship",
        name: "Χορηγία",
        description: "Αυξάνει δραματικά τις αυτόματες προβολές",
        basePrice: 1000,
        priceMultiplier: 3.0,
        effect: 5,
        maxLevel: 3,
        icon: "DollarSign",
        unlockRequirement: { id: "editing_software", level: 5 },
      },
    ],
    emoji: "📹",
    color: "from-red-600 to-red-800",
  }
}

// Διαθέσιμα εικονίδια
const availableIcons = [
  "Star",
  "Zap",
  "MousePointer",
  "Clock",
  "Heart",
  "Award",
  "Gift",
  "Coffee",
  "Cpu",
  "DollarSign",
  "Droplet",
  "Feather",
  "Flame",
  "Gem",
  "Globe",
  "Hammer",
  "Leaf",
  "Lightning",
  "Music",
  "Rocket",
  "Smile",
  "Sun",
  "Target",
  "Trophy",
  "Video",
  "Camera",
  "Film",
  "Eye",
  "Users",
  "TrendingUp",
  "Edit",
]

// Διαθέσιμα χρώματα φόντου
const backgroundOptions = [
  { value: "bg-gradient-to-br from-blue-500 to-purple-600", label: "Μπλε-Μωβ" },
  { value: "bg-gradient-to-br from-red-500 to-red-800", label: "YouTube" },
  { value: "bg-gradient-to-br from-red-500 to-orange-600", label: "Κόκκινο-Πορτοκαλί" },
  { value: "bg-gradient-to-br from-green-500 to-teal-600", label: "Πράσινο-Τιρκουάζ" },
  { value: "bg-gradient-to-br from-yellow-500 to-amber-600", label: "Κίτρινο-Πορτοκαλί" },
  { value: "bg-gradient-to-br from-pink-500 to-rose-600", label: "Ροζ-Κόκκινο" },
  { value: "bg-gradient-to-br from-indigo-500 to-blue-600", label: "Λουλακί-Μπλε" },
  { value: "bg-gradient-to-br from-purple-500 to-indigo-600", label: "Μωβ-Λουλακί" },
  { value: "bg-gradient-to-br from-gray-700 to-gray-900", label: "Σκούρο Γκρι" },
]

// Διαθέσιμα χρώματα επικεφαλίδας
const headerOptions = [
  { value: "bg-gradient-to-r from-blue-600 to-purple-700", label: "Μπλε-Μωβ" },
  { value: "bg-gradient-to-r from-red-600 to-red-800", label: "YouTube" },
  { value: "bg-gradient-to-r from-red-600 to-orange-700", label: "Κόκκινο-Πορτοκαλί" },
  { value: "bg-gradient-to-r from-green-600 to-teal-700", label: "Πράσινο-Τιρκουάζ" },
  { value: "bg-gradient-to-r from-yellow-600 to-amber-700", label: "Κίτρινο-Πορτοκαλί" },
  { value: "bg-gradient-to-r from-pink-600 to-rose-700", label: "Ροζ-Κόκκινο" },
  { value: "bg-gradient-to-r from-indigo-600 to-blue-700", label: "Λουλακί-Μπλε" },
  { value: "bg-gradient-to-r from-purple-600 to-indigo-700", label: "Μωβ-Λουλακί" },
  { value: "bg-gradient-to-r from-gray-800 to-gray-900", label: "Σκούρο Γκρι" },
]

// Διαθέσιμα χρώματα κουμπιών
const buttonOptions = [
  { value: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700", label: "Μπλε-Μωβ" },
  { value: "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800", label: "YouTube" },
  {
    value: "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700",
    label: "Κόκκινο-Πορτοκαλί",
  },
  {
    value: "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700",
    label: "Πράσινο-Τιρκουάζ",
  },
  {
    value: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700",
    label: "Κίτρινο-Πορτοκαλί",
  },
  { value: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700", label: "Ροζ-Κόκκινο" },
  {
    value: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700",
    label: "Λουλακί-Μπλε",
  },
  {
    value: "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
    label: "Μωβ-Λουλακί",
  },
  { value: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900", label: "Σκούρο Γκρι" },
]

// Διαθέσιμα χρώματα κειμένου
const textColorOptions = [
  { value: "text-blue-600", label: "Μπλε" },
  { value: "text-red-600", label: "Κόκκινο" },
  { value: "text-green-600", label: "Πράσινο" },
  { value: "text-yellow-600", label: "Κίτρινο" },
  { value: "text-pink-600", label: "Ροζ" },
  { value: "text-indigo-600", label: "Λουλακί" },
  { value: "text-purple-600", label: "Μωβ" },
  { value: "text-gray-600", label: "Γκρι" },
]

// Διαθέσιμα χρώματα έμφασης
const accentColorOptions = [
  { value: "text-blue-500", label: "Μπλε" },
  { value: "text-red-500", label: "Κόκκινο" },
  { value: "text-green-500", label: "Πράσινο" },
  { value: "text-yellow-500", label: "Κίτρινο" },
  { value: "text-pink-500", label: "Ροζ" },
  { value: "text-indigo-500", label: "Λουλακί" },
  { value: "text-purple-500", label: "Μωβ" },
  { value: "text-gray-500", label: "Γκρι" },
]

// Διαθέσιμα emoji
const emojiOptions = [
  "🎮",
  "🎯",
  "🎲",
  "🎪",
  "🎭",
  "🎨",
  "🎬",
  "🎤",
  "🎧",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🎾",
  "🏐",
  "🏉",
  "🎱",
  "🏓",
  "🏸",
  "🥊",
  "🥋",
  "🎿",
  "🛹",
  "🛼",
  "🛶",
  "🎣",
  "🤿",
  "🏄",
  "🏊",
  "🚣",
  "🧗",
  "🚴",
  "🚵",
  "🏇",
  "🏆",
  "🥇",
  "🥈",
  "🥉",
  "🏅",
  "🎖️",
  "🏵️",
  "🎗️",
  "🎫",
  "🎟️",
  "🎪",
  "🎭",
  "🎨",
  "🎬",
  "🎤",
  "🎧",
  "🎼",
  "🎹",
  "🎷",
  "🎺",
  "🎸",
  "🎻",
  "🎲",
  "🎯",
  "🎳",
  "🎮",
  "🎰",
  "🧩",
  "🎭",
  "🎨",
  "🧵",
  "🧶",
  "👾",
  "🤖",
  "👽",
  "👻",
  "🧠",
  "🧸",
  "🎁",
  "🎈",
  "🎉",
  "🎊",
  "🎎",
  "🎏",
  "🎐",
  "🎑",
  "🧧",
  "🎀",
  "🎁",
  "🎗️",
  "🎟️",
  "🎫",
  "🧨",
  "💰",
  "💎",
  "⚡",
  "🔥",
  "💧",
  "🌊",
  "🍔",
  "🍕",
  "🍦",
  "🍩",
  "🍪",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍯",
  "🍼",
  "🥛",
  "☕",
  "🍵",
  "🍶",
  "🍾",
  "🍷",
  "🍸",
  "🍹",
  "🍺",
  "🍻",
  "🥂",
  "🥃",
  "🥤",
  "🧃",
  "🧉",
  "🧊",
  "🥢",
  "🍽️",
  "🍴",
  "🥄",
  "🔪",
  "🏺",
  "📹", // YouTube
]

// Διαθέσιμα χρώματα για τη λίστα παιχνιδιών
const colorOptions = [
  { value: "from-blue-600 to-purple-700", label: "Μπλε-Μωβ" },
  { value: "from-red-600 to-red-800", label: "YouTube" },
  { value: "from-red-600 to-orange-700", label: "Κόκκινο-Πορτοκαλί" },
  { value: "from-green-600 to-teal-700", label: "Πράσινο-Τιρκουάζ" },
  { value: "from-yellow-600 to-amber-700", label: "Κίτρινο-Πορτοκαλί" },
  { value: "from-pink-600 to-rose-700", label: "Ροζ-Κόκκινο" },
  { value: "from-indigo-600 to-blue-700", label: "Λουλακί-Μπλε" },
  { value: "from-purple-600 to-indigo-700", label: "Μωβ-Λουλακί" },
  { value: "from-gray-800 to-gray-900", label: "Σκούρο Γκρι" },
]

interface GameCreatorProps {
  editingGame?: GameData
}

export function GameCreator({ editingGame }: GameCreatorProps = {}) {
  const [gameData, setGameData] = useState<GameData>(loadYouTubeClickerTemplate())
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [newClickMessage, setNewClickMessage] = useState("")
  const { toast } = useToast()

  // Φόρτωση δεδομένων παιχνιδιού για επεξεργασία
  useEffect(() => {
    if (editingGame) {
      setGameData(editingGame)
    } else {
      // Φόρτωση του προτύπου YouTube Clicker
      setGameData(loadYouTubeClickerTemplate())
    }
  }, [editingGame])

  // Ενημέρωση βασικών πληροφοριών
  const updateBasicInfo = (field: keyof GameData, value: string) => {
    setGameData((prev) => ({ ...prev, [field]: value }))
  }

  // Προσθήκη μηνύματος κλικ
  const addClickMessage = () => {
    if (newClickMessage.trim()) {
      setGameData((prev) => ({
        ...prev,
        clickMessages: [...prev.clickMessages, newClickMessage.trim()],
      }))
      setNewClickMessage("")
    }
  }

  // Αφαίρεση μηνύματος κλικ
  const removeClickMessage = (index: number) => {
    setGameData((prev) => ({
      ...prev,
      clickMessages: prev.clickMessages.filter((_, i) => i !== index),
    }))
  }

  // Προσθήκη νέας αναβάθμισης
  const addUpgrade = (advanced = false) => {
    const newUpgrade: Upgrade = {
      id: `upgrade_${uuidv4().substring(0, 8)}`,
      name: "Νέα Αναβάθμιση",
      description: "Περιγραφή αναβάθμισης",
      basePrice: 50,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 10,
      icon: "Star",
    }

    if (advanced) {
      setGameData((prev) => ({
        ...prev,
        advancedUpgrades: [...prev.advancedUpgrades, newUpgrade],
      }))
    } else {
      setGameData((prev) => ({
        ...prev,
        upgrades: [...prev.upgrades, newUpgrade],
      }))
    }
  }

  // Ενημέρωση αναβάθμισης
  const updateUpgrade = (index: number, field: keyof Upgrade, value: any, advanced = false) => {
    if (advanced) {
      setGameData((prev) => {
        const updatedUpgrades = [...prev.advancedUpgrades]
        updatedUpgrades[index] = { ...updatedUpgrades[index], [field]: value }
        return { ...prev, advancedUpgrades: updatedUpgrades }
      })
    } else {
      setGameData((prev) => {
        const updatedUpgrades = [...prev.upgrades]
        updatedUpgrades[index] = { ...updatedUpgrades[index], [field]: value }
        return { ...prev, upgrades: updatedUpgrades }
      })
    }
  }

  // Αφαίρεση αναβάθμισης
  const removeUpgrade = (index: number, advanced = false) => {
    if (advanced) {
      setGameData((prev) => ({
        ...prev,
        advancedUpgrades: prev.advancedUpgrades.filter((_, i) => i !== index),
      }))
    } else {
      setGameData((prev) => ({
        ...prev,
        upgrades: prev.upgrades.filter((_, i) => i !== index),
      }))
    }
  }

  // Προσθήκη νέας βαθμίδας
  const addRank = () => {
    const lastRank = gameData.ranks[gameData.ranks.length - 1]
    const newThreshold = lastRank ? lastRank.threshold * 10 : 0

    setGameData((prev) => ({
      ...prev,
      ranks: [
        ...prev.ranks,
        {
          name: "Νέα Βαθμίδα",
          threshold: newThreshold,
          icon: "🏆",
        },
      ],
    }))
  }

  // Ενημέρωση βαθμίδας
  const updateRank = (index: number, field: keyof Rank, value: any) => {
    setGameData((prev) => {
      const updatedRanks = [...prev.ranks]
      updatedRanks[index] = { ...updatedRanks[index], [field]: value }
      return { ...prev, ranks: updatedRanks }
    })
  }

  // Αφαίρεση βαθμίδας
  const removeRank = (index: number) => {
    setGameData((prev) => ({
      ...prev,
      ranks: prev.ranks.filter((_, i) => i !== index),
    }))
  }

  // Αποθήκευση παιχνιδιού
  const saveGame = () => {
    try {
      // Έλεγχος για υποχρεωτικά πεδία
      if (!gameData.name.trim()) {
        toast({
          title: "Σφάλμα",
          description: "Το όνομα του παιχνιδιού είναι υποχρεωτικό.",
          variant: "destructive",
        })
        return
      }

      // Δημιουργία του αντικειμένου παιχνιδιού
      const gameObject = {
        id: gameData.id,
        title: gameData.name,
        description: gameData.description,
        image: "/placeholder.svg?height=200&width=300", // Fixed placeholder image
        href: `/games/custom/${gameData.id}`,
        color: gameData.color,
        emoji: gameData.emoji || "🎮",
      }

      // Εμφάνιση οδηγιών για προσθήκη στον κώδικα
      toast({
        title: "Παιχνίδι δημιουργήθηκε",
        description:
          "Για να προσθέσετε το παιχνίδι, αντιγράψτε τον παρακάτω κώδικα στον πίνακα clickerGames στο αρχείο app/page.tsx",
      })

      // Εμφάνιση του κώδικα που πρέπει να προστεθεί
      console.log(`Προσθέστε αυτό στον πίνακα clickerGames στο αρχείο app/page.tsx:`)
      console.log(JSON.stringify(gameObject, null, 2))

      // Επαναφορά της φόρμας (αν χρειάζεται)
      // resetForm(); // Assuming resetForm is defined elsewhere if needed

      // toast({
      //   title: "Επιτυχία",
      //   description: "Το παιχνίδι αποθηκεύτηκε επιτυχώς!",
      // })

      // // Εμφάνιση περισσότερων πληροφοριών για αποσφαλμάτωση
      // console.log("Παιχνίδι αποθηκεύτηκε:", gameData)
      // console.log("Λίστα προσαρμοσμένων παιχνιδιών:", customGamesList)
    } catch (error) {
      console.error("Error saving game:", error)
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την αποθήκευση του παιχνιδιού.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Φόρμα επεξεργασίας */}
      <div className="space-y-6">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Βασικά</TabsTrigger>
            <TabsTrigger value="appearance">Εμφάνιση</TabsTrigger>
            <TabsTrigger value="upgrades">Αναβαθμίσεις</TabsTrigger>
            <TabsTrigger value="ranks">Βαθμίδες</TabsTrigger>
          </TabsList>

          {/* Βασικές πληροφορίες */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Όνομα Παιχνιδιού</Label>
                <Input
                  id="name"
                  value={gameData.name}
                  onChange={(e) => updateBasicInfo("name", e.target.value)}
                  placeholder="π.χ. Space Clicker"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji">Emoji</Label>
                <Select value={gameData.emoji} onValueChange={(value) => updateBasicInfo("emoji", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε emoji" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="grid grid-cols-8 gap-2 p-2">
                      {emojiOptions.map((emoji, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer p-2 text-center text-xl hover:bg-gray-100 rounded ${gameData.emoji === emoji ? "bg-blue-100" : ""}`}
                          onClick={() => updateBasicInfo("emoji", emoji)}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Περιγραφή</Label>
              <Textarea
                id="description"
                value={gameData.description}
                onChange={(e) => updateBasicInfo("description", e.target.value)}
                placeholder="Περιγράψτε το παιχνίδι σας"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Χρώμα (για τη λίστα παιχνιδιών)</Label>
              <Select value={gameData.color} onValueChange={(value) => updateBasicInfo("color", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 bg-gradient-to-r ${option.value}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainStatName">Όνομα Κύριου Στατιστικού</Label>
                <Input
                  id="mainStatName"
                  value={gameData.mainStatName}
                  onChange={(e) => updateBasicInfo("mainStatName", e.target.value)}
                  placeholder="π.χ. Πόντοι, Χρήματα, κλπ."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainStatIcon">Εικονίδιο Κύριου Στατιστικού</Label>
                <Select value={gameData.mainStatIcon} onValueChange={(value) => updateBasicInfo("mainStatIcon", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryStatName">Όνομα Δευτερεύοντος Στατιστικού</Label>
                <Input
                  id="secondaryStatName"
                  value={gameData.secondaryStatName}
                  onChange={(e) => updateBasicInfo("secondaryStatName", e.target.value)}
                  placeholder="π.χ. Ισχύς, Ταχύτητα, κλπ."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryStatIcon">Εικονίδιο Δευτερεύοντος Στατιστικού</Label>
                <Select
                  value={gameData.secondaryStatIcon}
                  onValueChange={(value) => updateBasicInfo("secondaryStatIcon", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clickButtonText">Κείμενο Κουμπιού Κλικ</Label>
                <Input
                  id="clickButtonText"
                  value={gameData.clickButtonText}
                  onChange={(e) => updateBasicInfo("clickButtonText", e.target.value)}
                  placeholder="π.χ. Κλικ!, Συλλογή!, κλπ."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clickButtonIcon">Εικονίδιο Κουμπιού Κλικ</Label>
                <Select
                  value={gameData.clickButtonIcon}
                  onValueChange={(value) => updateBasicInfo("clickButtonIcon", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Μηνύματα Κλικ</Label>
              <div className="flex space-x-2">
                <Input
                  value={newClickMessage}
                  onChange={(e) => setNewClickMessage(e.target.value)}
                  placeholder="Προσθέστε ένα μήνυμα κλικ"
                />
                <Button onClick={addClickMessage} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {gameData.clickMessages.map((message, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {message}
                    <button
                      onClick={() => removeClickMessage(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Εμφάνιση */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundClass">Χρώμα Φόντου</Label>
              <Select
                value={gameData.backgroundClass}
                onValueChange={(value) => updateBasicInfo("backgroundClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα φόντου" />
                </SelectTrigger>
                <SelectContent>
                  {backgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${option.value}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headerGradientClass">Χρώμα Επικεφαλίδας</Label>
              <Select
                value={gameData.headerGradientClass}
                onValueChange={(value) => updateBasicInfo("headerGradientClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα επικεφαλίδας" />
                </SelectTrigger>
                <SelectContent>
                  {headerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${option.value}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonGradientClass">Χρώμα Κουμπιών</Label>
              <Select
                value={gameData.buttonGradientClass}
                onValueChange={(value) => updateBasicInfo("buttonGradientClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα κουμπιών" />
                </SelectTrigger>
                <SelectContent>
                  {buttonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded mr-2 ${option.value.split(" ")[0]} ${option.value.split(" ")[1]}`}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColorClass">Χρώμα Κειμένου</Label>
              <Select
                value={gameData.textColorClass}
                onValueChange={(value) => updateBasicInfo("textColorClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα κειμένου" />
                </SelectTrigger>
                <SelectContent>
                  {textColorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded mr-2 bg-${option.value.split("-")[1]}-${option.value.split("-")[2]}`}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColorClass">Χρώμα Έμφασης</Label>
              <Select
                value={gameData.accentColorClass}
                onValueChange={(value) => updateBasicInfo("accentColorClass", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε χρώμα έμφασης" />
                </SelectTrigger>
                <SelectContent>
                  {accentColorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded mr-2 bg-${option.value.split("-")[1]}-${option.value.split("-")[2]}`}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Αναβαθμίσεις */}
          <TabsContent value="upgrades" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Βασικές Αναβαθμίσεις</h3>
              <Button onClick={() => addUpgrade(false)} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Προσθήκη
              </Button>
            </div>

            {gameData.upgrades.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Δεν υπάρχουν αναβαθμίσεις</AlertTitle>
                <AlertDescription>Προσθέστε τουλάχιστον μία αναβάθμιση για το παιχνίδι σας.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {gameData.upgrades.map((upgrade, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{upgrade.name}</h4>
                        <Button
                          onClick={() => removeUpgrade(index, false)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Όνομα</Label>
                          <Input value={upgrade.name} onChange={(e) => updateUpgrade(index, "name", e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <Label>Εικονίδιο</Label>
                          <Select value={upgrade.icon} onValueChange={(value) => updateUpgrade(index, "icon", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Περιγραφή</Label>
                          <Input
                            value={upgrade.description}
                            onChange={(e) => updateUpgrade(index, "description", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Αρχική Τιμή</Label>
                          <Input
                            type="number"
                            value={upgrade.basePrice}
                            onChange={(e) => updateUpgrade(index, "basePrice", Number(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Πολλαπλασιαστής Τιμής</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={upgrade.priceMultiplier}
                            onChange={(e) => updateUpgrade(index, "priceMultiplier", Number(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Επίδραση</Label>
                          <Input
                            type="number"
                            value={upgrade.effect}
                            onChange={(e) => updateUpgrade(index, "effect", Number(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Μέγιστο Επίπεδο</Label>
                          <Input
                            type="number"
                            value={upgrade.maxLevel}
                            onChange={(e) => updateUpgrade(index, "maxLevel", Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <h3 className="text-lg font-medium">Προχωρημένες Αναβαθμίσεις</h3>
              <Button onClick={() => addUpgrade(true)} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Προσθήκη
              </Button>
            </div>

            <div className="space-y-4">
              {gameData.advancedUpgrades.map((upgrade, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{upgrade.name}</h4>
                      <Button
                        onClick={() => removeUpgrade(index, true)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Όνομα</Label>
                        <Input
                          value={upgrade.name}
                          onChange={(e) => updateUpgrade(index, "name", e.target.value, true)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Εικονίδιο</Label>
                        <Select
                          value={upgrade.icon}
                          onValueChange={(value) => updateUpgrade(index, "icon", value, true)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Περιγραφή</Label>
                        <Input
                          value={upgrade.description}
                          onChange={(e) => updateUpgrade(index, "description", e.target.value, true)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Αρχική Τιμή</Label>
                        <Input
                          type="number"
                          value={upgrade.basePrice}
                          onChange={(e) => updateUpgrade(index, "basePrice", Number(e.target.value), true)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Πολλαπλασιαστής Τιμής</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={upgrade.priceMultiplier}
                          onChange={(e) => updateUpgrade(index, "priceMultiplier", Number(e.target.value), true)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Επίδραση</Label>
                        <Input
                          type="number"
                          value={upgrade.effect}
                          onChange={(e) => updateUpgrade(index, "effect", Number(e.target.value), true)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Μέγιστο Επίπεδο</Label>
                        <Input
                          type="number"
                          value={upgrade.maxLevel}
                          onChange={(e) => updateUpgrade(index, "maxLevel", Number(e.target.value), true)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Απαίτηση Ξεκλειδώματος</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={upgrade.unlockRequirement?.id || "none"}
                            onValueChange={(value) => {
                              if (value === "none") {
                                // Αφαίρεση απαίτησης
                                const updatedUpgrade = { ...upgrade }
                                delete updatedUpgrade.unlockRequirement
                                setGameData((prev) => {
                                  const updatedUpgrades = [...prev.advancedUpgrades]
                                  updatedUpgrades[index] = updatedUpgrade
                                  return { ...prev, advancedUpgrades: updatedUpgrades }
                                })
                              } else {
                                updateUpgrade(
                                  index,
                                  "unlockRequirement",
                                  {
                                    id: value,
                                    level: upgrade.unlockRequirement?.level || 1,
                                  },
                                  true,
                                )
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Επιλέξτε αναβάθμιση" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Καμία απαίτηση</SelectItem>
                              {gameData.upgrades.map((basicUpgrade) => (
                                <SelectItem key={basicUpgrade.id} value={basicUpgrade.id}>
                                  {basicUpgrade.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            placeholder="Επίπεδο"
                            value={upgrade.unlockRequirement?.level || 1}
                            onChange={(e) => {
                              if (upgrade.unlockRequirement) {
                                updateUpgrade(
                                  index,
                                  "unlockRequirement",
                                  {
                                    ...upgrade.unlockRequirement,
                                    level: Number(e.target.value),
                                  },
                                  true,
                                )
                              }
                            }}
                            disabled={!upgrade.unlockRequirement}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Βαθμίδες */}
          <TabsContent value="ranks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Βαθμίδες</h3>
              <Button onClick={addRank} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Προσθήκη
              </Button>
            </div>

            {gameData.ranks.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Δεν υπάρχουν βαθμίδες</AlertTitle>
                <AlertDescription>Προσθέστε τουλάχιστον μία βαθμίδα για το παιχνίδι σας.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {gameData.ranks.map((rank, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rank.name}</h4>
                        <Button
                          onClick={() => removeRank(index)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={index === 0} // Δεν επιτρέπεται η διαγραφή της πρώτης βαθμίδας
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Όνομα</Label>
                          <Input value={rank.name} onChange={(e) => updateRank(index, "name", e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <Label>Όριο Πόντων</Label>
                          <Input
                            type="number"
                            value={rank.threshold}
                            onChange={(e) => updateRank(index, "threshold", Number(e.target.value))}
                            disabled={index === 0} // Η πρώτη βαθμίδα πάντα ξεκινάει από 0
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Εικονίδιο</Label>
                          <Select value={rank.icon} onValueChange={(value) => updateRank(index, "icon", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Επιλέξτε εικονίδιο" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <div className="grid grid-cols-8 gap-2 p-2">
                                {emojiOptions.map((emoji, emojiIndex) => (
                                  <div
                                    key={emojiIndex}
                                    className={`cursor-pointer p-2 text-center text-xl hover:bg-gray-100 rounded ${rank.icon === emoji ? "bg-blue-100" : ""}`}
                                    onClick={() => updateRank(index, "icon", emoji)}
                                  >
                                    {emoji}
                                  </div>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2">
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" /> Απόκρυψη Προεπισκόπησης
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Προεπισκόπηση
              </>
            )}
          </Button>

          <Button onClick={saveGame} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Αποθήκευση
          </Button>
        </div>
      </div>

      {/* Προεπισκόπηση */}
      {showPreview && (
        <div className="sticky top-4">
          <h3 className="text-lg font-medium mb-4">Προεπισκόπηση</h3>
          <GamePreview gameData={gameData} />
        </div>
      )}
    </div>
  )
}
