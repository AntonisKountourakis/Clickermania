"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { UnifiedClickerTemplate } from "@/components/unified-clicker-template"
import Link from "next/link"

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

export default function CustomGamePage() {
  const params = useParams()
  const router = useRouter()
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Βελτιώνουμε τη λειτουργία φόρτωσης του προσαρμοσμένου παιχνιδιού

  // Αντικαταστήστε το useEffect που φορτώνει τα δεδομένα του παιχνιδιού με το παρακάτω:

  useEffect(() => {
    try {
      const gameId = params.id as string
      const savedGamesStr = localStorage.getItem("custom-clicker-games")

      if (savedGamesStr) {
        const savedGames: GameData[] = JSON.parse(savedGamesStr)
        const game = savedGames.find((g) => g.id === gameId)

        if (game) {
          setGameData(game)
          console.log("Φορτώθηκε το παιχνίδι:", game)
        } else {
          console.error("Το παιχνίδι δεν βρέθηκε στη λίστα:", gameId)
          setError("Το παιχνίδι δεν βρέθηκε")
        }
      } else {
        console.error("Δεν βρέθηκαν αποθηκευμένα παιχνίδια")
        setError("Δεν βρέθηκαν αποθηκευμένα παιχνίδια")
      }
    } catch (error) {
      console.error("Error loading game:", error)
      setError("Σφάλμα κατά τη φόρτωση του παιχνιδιού")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  // Αφαιρούμε τη συνάρτηση getIconComponent και αλλάζουμε τον τρόπο που περνάμε τα εικονίδια

  // Αφαιρούμε αυτό:
  // const getIconComponent = (iconName: string) => {
  //   const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
  //   return <Icon className="h-5 w-5" />
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Φόρτωση παιχνιδιού...</p>
        </div>
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Σφάλμα</h1>
          <p className="mb-6">{error || "Άγνωστο σφάλμα"}</p>
          <Link href="/">
            <Button>Επιστροφή στην αρχική</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Και αντί για αυτό:
  // const gameSettings = {
  //   name: gameData.name,
  //   description: gameData.description,
  //   storageKey: gameData.storageKey || `custom-${gameData.id}-progress`,
  //   mainStatName: gameData.mainStatName,
  //   mainStatIcon: getIconComponent(gameData.mainStatIcon),
  //   secondaryStatName: gameData.secondaryStatName,
  //   secondaryStatIcon: getIconComponent(gameData.secondaryStatIcon),
  //   clickButtonText: gameData.clickButtonText,
  //   clickButtonIcon: getIconComponent(gameData.clickButtonIcon),
  //   backgroundClass: gameData.backgroundClass,
  //   headerGradientClass: gameData.headerGradientClass,
  //   buttonGradientClass: gameData.buttonGradientClass,
  //   textColorClass: gameData.textColorClass,
  //   accentColorClass: gameData.accentColorClass,
  //   clickMessages: gameData.clickMessages,
  //   ranks: gameData.ranks.map((rank) => ({
  //     ...rank,
  //     icon: rank.icon,
  //   })),
  //   upgrades: gameData.upgrades.map((upgrade) => ({
  //     ...upgrade,
  //     icon: getIconComponent(upgrade.icon),
  //   })),
  //   advancedUpgrades: gameData.advancedUpgrades.map((upgrade) => ({
  //     ...upgrade,
  //     icon: getIconComponent(upgrade.icon),
  //   })),
  // }

  // Χρησιμοποιούμε αυτό:
  const gameSettings = {
    name: gameData.name,
    description: gameData.description,
    storageKey: gameData.storageKey || `custom-${gameData.id}-progress`,
    mainStatName: gameData.mainStatName,
    mainStatIcon: gameData.mainStatIcon,
    secondaryStatName: gameData.secondaryStatName,
    secondaryStatIcon: gameData.secondaryStatIcon,
    clickButtonText: gameData.clickButtonText,
    clickButtonIcon: gameData.clickButtonIcon,
    backgroundClass: gameData.backgroundClass,
    headerGradientClass: gameData.headerGradientClass,
    buttonGradientClass: gameData.buttonGradientClass,
    textColorClass: gameData.textColorClass,
    accentColorClass: gameData.accentColorClass,
    clickMessages: gameData.clickMessages,
    ranks: gameData.ranks,
    upgrades: gameData.upgrades,
    advancedUpgrades: gameData.advancedUpgrades,
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4" />
            Επιστροφή
          </Button>
        </Link>
      </div>

      <UnifiedClickerTemplate settings={gameSettings} />
    </div>
  )
}
