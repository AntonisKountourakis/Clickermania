"use client"
import { UnifiedClickerTemplate } from "./unified-clicker-template"

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

interface GamePreviewProps {
  gameData: GameData
}

export function GamePreview({ gameData }: GamePreviewProps) {
  // Αλλάζουμε τη συνάρτηση getIconComponent και τον τρόπο που περνάμε τα εικονίδια

  // Αντί για αυτό:
  // const getIconComponent = (iconName: string) => {
  //   const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
  //   return <Icon className="h-5 w-5" />
  // }

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
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <UnifiedClickerTemplate settings={gameSettings} />
    </div>
  )
}
