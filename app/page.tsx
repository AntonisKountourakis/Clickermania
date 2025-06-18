"use client"

import { useEffect, useState, useLayoutEffect, useCallback, useRef, useMemo } from "react"
// Προσθέστε την εισαγωγή του Link στην αρχή του αρχείου, αν δεν υπάρχει ήδη
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSettings } from "@/contexts/settings-context"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import { AnimatedBackground } from "@/components/animated-background"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
// Add these imports at the top of the file
import { useRenderPerformance, usePerformanceCallback, usePerformanceEffect } from "@/hooks/use-performance-tracking"
import { startPerformanceTracking, endPerformanceTracking, throttle } from "@/utils/performance-tracking"
// Προσθέστε αυτή την εισαγωγή στην αρχή του αρχείου
import { useScrollOptimization } from "@/hooks/use-scroll-optimization"
// Προσθέστε την εισαγωγή του CustomGamesSection στην αρχή του αρχείου
// Αφαιρέστε αυτή τη γραμμή:
//import CustomGamesSection from "@/components/custom-games-section"

// Game data with progress information
interface Game {
  id: string
  name: string
  path: string
  description: string
  icon?: string
  progress?: number
}

const clickerGames = [
  {
    id: "clicker",
    title: "Gaming Clicker",
    description: "Click to earn gaming points and level up!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/clicker",
    color: "from-indigo-600 to-purple-700",
    emoji: "🎮",
  },
  {
    id: "youtube-clicker",
    title: "YouTube Creator",
    description: "Create content, gain views, and grow your channel",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/youtube-clicker",
    color: "from-red-600 to-red-800",
    emoji: "📹",
  },
  {
    id: "lotr-clicker",
    title: "The Lord of the Rings",
    description: "Wield the One Ring and journey through Middle-earth",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/lotr-clicker",
    color: "from-amber-700 to-amber-500",
    emoji: "💍",
  },
  {
    id: "sweet-clicker",
    title: "Sweet Bakery Clicker",
    description: "Bake delicious sweets and expand your bakery!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/sweet-clicker",
    color: "from-pink-500 to-purple-500",
    emoji: "🧁",
  },
  {
    id: "western-clicker",
    title: "The Good, the Bad and the Ugly",
    description: "Hunt bounties, find gold, and become a legend of the West",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/western-clicker",
    color: "from-amber-700 to-amber-900",
    emoji: "🤠",
  },
  {
    id: "football-clicker",
    title: "Football Manager Clicker",
    description: "Score goals and build your football empire!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/football-clicker",
    color: "from-green-600 to-green-700",
    emoji: "⚽",
  },
  {
    id: "capitalism-clicker",
    title: "Capitalism Clicker",
    description: "Invest, expand, and dominate the market!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/capitalism-clicker",
    color: "from-blue-600 to-indigo-600",
    emoji: "💰",
  },
  {
    id: "emotions-clicker",
    title: "Emotions Clicker",
    description: "Experience and collect different emotions!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/emotions-clicker",
    color: "from-purple-500 to-pink-500",
    emoji: "❤️",
  },
  {
    id: "real-estate-clicker",
    title: "Real Estate Tycoon",
    description: "Buy, renovate, and rent properties to build your empire!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/real-estate-clicker",
    color: "from-blue-500 to-indigo-600",
    emoji: "🏢",
  },
  {
    id: "animal-clicker",
    title: "Animal Sanctuary",
    description: "Rescue animals and build your wildlife sanctuary!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/animal-clicker",
    color: "from-green-700 to-green-500",
    emoji: "🐾",
  },
  //{
  //id: "space-clicker",
  //title: "Space Explorer",
  //description: "Explore the cosmos and build your galactic empire!",
  //image: "/placeholder.svg?height=200&width=300",
  //href: "/games/space-clicker",
  //color: "from-indigo-900 to-purple-900",
  //emoji: "🚀",
  //},
  {
    id: "fight-club-clicker",
    title: "Fight Club",
    description: "Break free from consumer culture and create chaos!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/fight-club-clicker",
    color: "from-gray-900 to-red-900",
    emoji: "🧼",
  },
  {
    id: "school-clicker",
    title: "School Clicker",
    description: "Study hard and improve your grades!",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/school-clicker",
    color: "from-blue-500 to-blue-600",
    emoji: "📚",
  },
  {
    id: "godfather-clicker",
    title: "The Godfather",
    description: "Build your family empire and earn respect",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/godfather-clicker",
    color: "from-red-900 to-amber-900",
    emoji: "🌹",
  },
  {
    id: "monster-clicker",
    title: "Monster Evolution",
    description: "Scare humans, evolve your monster, and spread terror",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/monster-clicker",
    color: "from-purple-700 to-fuchsia-800",
    emoji: "👹",
  },
  {
    id: "vehicle-clicker",
    title: "Speed Racer",
    description: "Drive fast, upgrade your vehicles, and become a racing legend",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/vehicle-clicker",
    color: "from-blue-700 to-blue-900",
    emoji: "🏎️",
  },
  {
    id: "weather-clicker",
    title: "Weather Master",
    description: "Control the elements and become a master meteorologist",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/weather-clicker",
    color: "from-sky-600 to-sky-800",
    emoji: "🌦️",
  },
  {
    id: "alien-clicker",
    title: "Alien Invasion",
    description: "Take over the Earth, one click at a time",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/alien-clicker",
    color: "from-green-700 to-green-500",
    emoji: "👽",
  },
  {
    id: "troy-clicker",
    title: "Troy: Battle for Glory",
    description: "Conquer the ancient city of Troy",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/troy-clicker",
    color: "from-amber-800 to-amber-600",
    emoji: "🛡️",
  },
  {
    id: "city-clicker",
    title: "City Builder",
    description: "Develop your metropolis from a small town to a thriving city",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/city-clicker",
    color: "from-blue-800 to-blue-600",
    emoji: "🏙️",
  },
  //{
  // id: "rockstar-clicker",
  //title: "Rock Star",
  //description: "Play music, gain fans, and become a legendary rock star",
  // image: "/placeholder.svg?height=200&width=300",
  // href: "/games/rockstar-clicker",
  // color: "from-purple-800 to-pink-600",
  //emoji: "🎸",
  // },
  {
    id: "budapest-clicker",
    title: "The Grand Budapest Hotel",
    description: "Manage the famous hotel and collect rare artifacts",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/budapest-clicker",
    color: "from-pink-500 to-purple-400",
    emoji: "🏨",
  },
  {
    id: "pirate-clicker",
    title: "Pirate Adventure",
    description: "Sail the high seas, plunder treasures, and become a legendary pirate",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/pirate-clicker",
    color: "from-blue-800 to-blue-600",
    emoji: "⛵",
  },
  {
    id: "music-producer-clicker",
    title: "Music Producer",
    description: "Create beats, produce tracks, and become a music mogul",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/music-producer-clicker",
    color: "from-purple-600 to-purple-800",
    emoji: "🎧",
  },
  {
    id: "greek-mythology-clicker",
    title: "Greek Mythology",
    description: "Harness the power of the gods and build your Olympian empire",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/greek-mythology-clicker",
    color: "from-blue-500 to-amber-400",
    emoji: "🏛️",
  },
  {
    id: "holiday-clicker",
    title: "Holiday Clicker",
    description: "Earn vacation points and upgrade your holiday experience",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/holiday-clicker",
    color: "from-blue-400 to-cyan-600",
    emoji: "🏖️",
  },
  {
    id: "breaking-bad-clicker",
    title: "Breaking Bad",
    description: "Cook, sell, and build your empire in this chemistry-themed clicker",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/breaking-bad-clicker",
    color: "from-green-700 to-green-500",
    emoji: "⚗️",
  },
  {
    id: "saltburn-clicker",
    title: "Saltburn",
    description: "Climb the social ladder and infiltrate the elite in this wealth-themed clicker",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/saltburn-clicker",
    color: "from-amber-500 to-yellow-600",
    emoji: "🏊‍♂️",
  },
  {
    id: "mountain-clicker",
    title: "Mountain Explorer",
    description: "Climb peaks, discover trails, and become a legendary mountaineer",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/mountain-clicker",
    color: "from-blue-700 to-teal-600",
    emoji: "🏔️",
  },
  //{
  //id: "strategy",
  //title: "Kingdom Builder",
  //description: "Build and manage your own medieval kingdom",
  //image: "/placeholder.svg?height=200&width=300",
  //href: "/games/strategy",
  //color: "from-blue-700 to-indigo-900",
  //emoji: "👑",
  //},
  //{
  //id: "norse-clicker",
  //title: "Norse Mythology Clicker",
  //description: "Harness the power of Norse gods, build Viking settlements, and ascend to Asgard!",
  //image: "/weathered-viking-hammer.png",
  //href: "/games/norse-clicker",
  //color: "from-blue-900 to-slate-700",
  //emoji: "🔨",
  //},
  {
    id: "aviation-clicker",
    title: "Aviation Empire",
    description: "Build your aviation empire, from small planes to space shuttles",
    image: "/blue-sky-airplane.png",
    href: "/games/aviation-clicker",
    color: "from-sky-600 to-blue-800",
    emoji: "✈️",
  },
  {
    id: "supermarket-clicker",
    title: "Supermarket Tycoon",
    description: "Build your retail empire from a small shop to a global supermarket chain",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/supermarket-clicker",
    color: "from-green-600 to-green-400",
    emoji: "🛒",
  },
  {
    id: "clothing-clicker",
    title: "Fashion Empire",
    description: "Build your fashion empire one click at a time!",
    href: "/games/clothing-clicker",
    color: "from-purple-600 to-indigo-700",
    emoji: "👕",
  },
  //{
  //id: "cookie-clicker",
  //title: "Cookie Clicker",
  //description: "The ultimate classic. Start baking cookies with clicks and build an empire!",
  //image: "/chocolate-chip-cookie.png",
  //href: "/games/cookie-clicker",
  //color: "from-amber-600 to-amber-800",
  //emoji: "🍪",
  //},
  {
    id: "dinosaur-clicker",
    title: "Dinosaur Park",
    description: "Build and manage your prehistoric adventure park",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/dinosaur-clicker",
    color: "from-green-800 to-green-600",
    emoji: "🦖",
  },
  {
    id: "zombie-clicker",
    title: "Zombie Outbreak",
    description: "Survive the apocalypse and build your zombie-proof base",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/zombie-clicker",
    color: "from-green-900 to-gray-800",
    emoji: "🧟",
  },
  {
    id: "restaurant-clicker",
    title: "Restaurant Empire",
    description: "Cook delicious meals and build your culinary empire",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/restaurant-clicker",
    color: "from-red-700 to-yellow-600",
    emoji: "🍽️",
  },
  {
    id: "detective-clicker",
    title: "Mystery Detective",
    description: "Solve cases, find clues, and become the ultimate detective",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/detective-clicker",
    color: "from-gray-800 to-blue-900",
    emoji: "🔍",
  },
  {
    id: "galaxy-clicker",
    title: "Galaxy Conquest",
    description: "Explore distant planets and build an intergalactic civilization",
    image: "/placeholder.svg?height=200&width=300",
    href: "/games/galaxy-clicker",
    color: "from-violet-900 to-indigo-700",
    emoji: "🌌",
  },
  // {
  //id: "wizard-clicker",
  //title: "Wizard Academy",
  //description: "Cast spells, brew potions, and become a legendary wizard",
  //image: "/placeholder.svg?height=200&width=300",
  //href: "/games/wizard-clicker",
  //color: "from-purple-900 to-indigo-800",
  //emoji: "🧙",
  //},
]

// Προσθέστε τον παρακάτω κώδικα μετά τη δήλωση του πίνακα clickerGames
// και πριν από τη συνάρτηση formatNumber

// Συνάρτηση για μορφοποίηση μεγάλων αριθμών
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

// Συνάρτηση για τη δημιουργία τυχαίων εικονιδίων παιχνιδιών
const getRandomGameEmojis = (count: number) => {
  const emojis = []
  for (let i = 0; i < count; i++) {
    const randomGame = clickerGames[Math.floor(Math.random() * clickerGames.length)]
    emojis.push(randomGame.emoji)
  }
  return emojis
}

// Τροποποιήστε τη συνάρτηση HomePage για να συμπεριλάβει τα προσαρμοσμένα παιχνίδια
// Αντικαταστήστε την αρχή της συνάρτησης HomePage με τον παρακάτω κώδικα:

export default function HomePage() {
  const router = useRouter()

  // Inside the HomePage component, add this line near the top
  useRenderPerformance("HomePage")

  // Προσθήκη μιας μεταβλητής για να παρακολουθούμε αν έχει γίνει ήδη ανακατεύθυνση
  const hasRedirectedRef = useRef(false)

  // Πρόσβαση στις ρυθμίσεις
  const { settings } = useSettings()
  const { isMobile, touchOptimized, preserveDesktopStyle, reducedAnimations } = useMobileOptimization()
  const { deviceTier, isLowPerformance } = usePerformanceMonitor()
  // Προσθέστε αυτό μέσα στο component, μετά τα άλλα hooks
  const { scrollBehavior, smoothScrollTo } = useScrollOptimization()

  // Χρησιμοποιούμε απευθείας τα clickerGames ως την πηγή παιχνιδιών
  const allGames = clickerGames

  // Determine animation quality based on device performance
  const animationQuality = useMemo(() => {
    if (reducedAnimations || isLowPerformance) return "low"
    if (deviceTier === "low") return "low"
    if (deviceTier === "medium") return "medium"
    return "high"
  }, [deviceTier, isLowPerformance, reducedAnimations])

  // State variables
  const [forceUpdate, setForceUpdate] = useState(0)
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [initialRender, setInitialRender] = useState(true)
  const [gamesWithProgress, setGamesWithProgress] = useState<Record<string, number>>({})
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showIntro, setShowIntro] = useState(false)
  const [introStep, setIntroStep] = useState(0)
  const [gameEmojis, setGameEmojis] = useState<string[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isManualScrolling, setIsManualScrolling] = useState(false)
  const [initialScrollDone, setInitialScrollDone] = useState(false)

  // Refs
  const progressRef = useRef<Record<string, number>>({})
  const introTimerRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const lastScrollPositionRef = useRef<number>(0)
  const currentPageGroupRef = useRef<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Calculate pagination data with useMemo to prevent recalculations on every render
  const paginationData = useMemo(() => {
    const totalPages = allGames.length
    const currentGroup = Math.floor(currentGameIndex / 5)
    const startIndex = currentGroup * 5
    const endIndex = Math.min(startIndex + 5, totalPages)
    const totalGroups = Math.ceil(totalPages / 5)

    // Store current group in ref to avoid re-renders
    currentPageGroupRef.current = currentGroup

    return {
      totalPages,
      currentGroup,
      startIndex,
      endIndex,
      totalGroups,
      hasPrevGroup: currentGroup > 0,
      hasNextGroup: currentGroup < totalGroups - 1,
    }
  }, [currentGameIndex, allGames.length])

  // Ενημερώνουμε το progressRef όταν αλλάζει το gamesWithProgress
  useEffect(() => {
    progressRef.current = gamesWithProgress
  }, [gamesWithProgress])

  // Έλεγχος αν πρέπει να εμφανιστεί η εισαγωγή
  useEffect(() => {
    if (mounted) {
      // Skip intro by default - set hasSeenIntro to true
      localStorage.setItem("has-seen-intro", "true")
      setShowIntro(false)
    }
  }, [mounted])

  // Χειρισμός κλεισίματος της εισαγωγής
  const handleCloseIntro = () => {
    localStorage.setItem("has-seen-intro", "true")
    setShowIntro(false)
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current)
    }
  }

  // Also add audio initialization to the intro click handler to ensure music starts playing
  const handleIntroClick = () => {
    if (introStep < 3) {
      setIntroStep(introStep + 1)
      setClickCount(clickCount + 1)
      // Remove the audio play code from here since it's handled in the AudioPlayer component
    } else {
      handleCloseIntro()
    }
  }

  // Προχωρήστε αυτόματα στο επόμενο βήμα της εισαγωγής μετά από λίγο
  useEffect(() => {
    if (showIntro && introStep < 3) {
      introTimerRef.current = setTimeout(() => {
        setIntroStep(introStep + 1)
      }, 2000)
    }

    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current)
      }
    }
  }, [showIntro, introStep])

  // Replace the refreshGameProgress function with this optimized version
  const refreshGameProgress = usePerformanceCallback("refreshGameProgress", () => {
    console.log("Ανανέωση δεδομένων προόδου παιχνιδιών")
    startPerformanceTracking("scanGameProgress")

    const gamesWithProgressObj: Record<string, number> = {}

    // Scan all clicker games for progress
    allGames.forEach((game) => {
      // Check different possible keys
      const possibleKeys = [
        `${game.id}-clicker-progress`,
        `${game.id}-progress`,
        `${game.id.replace("-clicker", "")}-clicker-progress`,
        `${game.id}-game-progress`,
      ]

      for (const key of possibleKeys) {
        const progress = localStorage.getItem(key)
        if (progress) {
          try {
            const progressData = JSON.parse(progress)

            // Check for various fields that might contain points
            let points = 0
            if (progressData) {
              if (progressData.score !== undefined) {
                points = progressData.score
              } else if (progressData.money !== undefined) {
                points = progressData.money
              } else if (progressData.points !== undefined) {
                points = progressData.points
              } else if (progressData.goals !== undefined) {
                points = progressData.goals
              } else if (progressData.sweets !== undefined) {
                points = progressData.sweets
              } else if (progressData.clicks !== undefined) {
                points = progressData.clicks
              } else if (progressData.fans !== undefined) {
                points = progressData.fans
              } else if (progressData.views !== undefined) {
                points = progressData.views
              } else if (progressData.subscribers !== undefined) {
                points = progressData.subscribers
              } else if (progressData.mainStat !== undefined) {
                points = progressData.mainStat
              } else {
                // If none of the above fields are found, look for any numeric field
                for (const field in progressData) {
                  if (typeof progressData[field] === "number" && progressData[field] > 0) {
                    points = progressData[field]
                    break
                  }
                }
              }

              if (points > 0) {
                gamesWithProgressObj[game.id] = points
                break // Found progress, no need to check other keys
              }
            }
          } catch (e) {
            console.error(`Error reading progress for ${game.id}:`, e)
          }
        }
      }

      // Special handling for detective-clicker
      if (game.id === "detective-clicker" && !gamesWithProgressObj[game.id]) {
        const clues = localStorage.getItem("detective-clicker-clues")
        if (clues) {
          try {
            const cluesValue = Number.parseFloat(clues)
            if (!isNaN(cluesValue) && cluesValue > 0) {
              gamesWithProgressObj[game.id] = cluesValue
            }
          } catch (e) {
            console.error(`Error reading clues for detective-clicker:`, e)
          }
        }
      }
    })
    endPerformanceTracking("scanGameProgress")
    console.log("Ενημερωμένα δεδομένα προόδου:", gamesWithProgressObj)
    setGamesWithProgress(gamesWithProgressObj)
  })

  // Επίσης, ενημερώνουμε το handleReset για να συμπεριλάβει το vehicle-clicker-progress
  const handleReset = () => {
    // Λίστα με όλα τα κλειδιά localStorage που χρησιμοποιούνται στα παιχνίδια
    const gameKeys = [
      "clicker-game-progress",
      "sweet-clicker-progress",
      "football-clicker-progress",
      "capitalism-clicker-progress",
      "emotions-clicker-progress",
      "real-estate-clicker-progress",
      "animal-clicker-progress",
      "space-clicker-progress",
      "fight-club-clicker-progress",
      "school-clicker-progress",
      "godfather-clicker-progress",
      "youtube-clicker-progress",
      "western-clicker-progress",
      "monster-clicker-progress",
      "vehicle-clicker-progress", // Προσθήκη του νέου παιχνιδιού
      "lotr-clicker-progress",
      "weather-clicker-progress", // Add the weather game
      "alien-clicker-progress", // Add the alien game
      "troy-clicker-progress", // Add the Troy game
      "city-clicker-progress", // Add the City Builder game
      "rockstar-clicker-progress", // Add the Rock Star game
      "budapest-clicker-progress", // Add the Budapest Hotel game
      "pirate-clicker-progress", // Add the Pirate Adventure game
      "music-producer-clicker-progress", // Add the Music Producer game
      "greek-mythology-clicker-progress", // Add the Greek Mythology game
      "holiday-clicker-progress", // Add the Holiday Clicker game
      "breaking-bad-clicker-progress", // Add the Breaking Bad Clicker game
      "saltburn-clicker-progress", // Add the Saltburn Clicker game
      "mountain-clicker-progress", // Add the Mountain Clicker game
      "strategy-progress", // Add the strategy game
      "norse-clicker-progress", // Add the Norse Mythology game
      "aviation-clicker-progress", // Add the Aviation Empire game
      "supermarket-clicker-progress", // Add the Supermarket Tycoon game
      "clothing-clicker-progress", // Add the Clothing Clicker game
      "cookie-clicker-progress", // Add the Cookie Clicker game
      "dinosaur-clicker-progress",
      "zombie-clicker-progress",
      "restaurant-clicker-progress",
      "detective-clicker-progress",
      "galaxy-clicker-progress",
      "wizard-clicker-progress",
      "last-played-game", // Προσθήκη του last-played-game για να καθαρίσει και αυτό
    ]

    // Διαγραφή όλων των δεδομένων παιχνιδιών
    gameKeys.forEach((key) => {
      localStorage.removeItem(key)
    })

    // Κλείσιμο του dialog
    setOpen(false)

    localStorage.removeItem("games-current-page")
    localStorage.removeItem("games-scroll-position")
    localStorage.removeItem("exact-scroll-position")
    localStorage.removeItem("current-game-index")
    localStorage.removeItem("horizontal-scroll-position")
    localStorage.removeItem("skip-homepage-scroll")

    // Προαιρετικά: ανανέωση της σελίδας για να εφαρμοστούν οι αλλαγές
    window.location.reload()
  }

  // Scroll functions - optimized for better performance
  // Ενημερώστε τη συνάρτηση scrollToGame για να χρησιμοποιεί το νέο hook
  const scrollToGame = useCallback(
    (index: number, ScrollBehavior = "auto") => {
      if (scrollContainerRef.current && index >= 0 && index < allGames.length) {
        const containerWidth = scrollContainerRef.current.clientWidth

        // Ενημέρωση του state
        setCurrentGameIndex(index)

        // Αποθήκευση στο localStorage
        localStorage.setItem("current-game-index", index.toString())
        localStorage.setItem("last-played-game", allGames[index].id)

        // Χρήση άμεσης μετάβασης χωρίς animation
        scrollContainerRef.current.scrollTo({
          left: containerWidth * index,
          behavior: "auto", // Changed from scrollBehavior to always use "auto"
        })
      }
    },
    [allGames],
  )

  // Navigation functions for pagination groups
  const scrollLeft = useCallback(() => {
    if (currentGameIndex > 0) {
      scrollToGame(currentGameIndex - 1, "auto")
    }
  }, [currentGameIndex, scrollToGame])

  const scrollRight = useCallback(() => {
    if (currentGameIndex < allGames.length - 1) {
      scrollToGame(currentGameIndex + 1, "auto")
    }
  }, [currentGameIndex, allGames.length, scrollToGame])

  const goToPrevGroup = useCallback(() => {
    if (paginationData.hasPrevGroup) {
      const newGroupStart = (paginationData.currentGroup - 1) * 5
      scrollToGame(newGroupStart, "auto")
    }
  }, [paginationData.hasPrevGroup, paginationData.currentGroup, scrollToGame])

  const goToNextGroup = useCallback(() => {
    if (paginationData.hasNextGroup) {
      const newGroupStart = (paginationData.currentGroup + 1) * 5
      scrollToGame(newGroupStart, "auto")
    }
  }, [paginationData.hasNextGroup, paginationData.currentGroup, scrollToGame])

  const goToPage = useCallback(
    (index: number) => {
      scrollToGame(index, "auto")
    },
    [scrollToGame],
  )

  // Enhanced handleScroll function with better position tracking
  const handleScroll = usePerformanceCallback(
    "handleScroll",
    throttle(() => {
      if (!scrollContainerRef.current || isManualScrolling) return

      // Χρήση requestAnimationFrame για καλύτερη απόδοση
      requestAnimationFrame(() => {
        if (!scrollContainerRef.current) return

        // Λήψη τρέχουσας θέσης κύλισης
        const scrollPosition = scrollContainerRef.current.scrollLeft

        // Ενημέρωση μόνο αν η θέση κύλισης έχει αλλάξει σημαντικά
        if (Math.abs(scrollPosition - lastScrollPositionRef.current) < 10) return
        lastScrollPositionRef.current = scrollPosition

        // Υπολογισμός τρέχοντος δείκτη παιχνιδιού με βάση τη θέση κύλισης
        const containerWidth = scrollContainerRef.current.clientWidth
        const newIndex = Math.round(scrollPosition / containerWidth)

        // Ενημέρωση τρέχοντος δείκτη παιχνιδιού αν έχει αλλάξει
        if (newIndex !== currentGameIndex && newIndex >= 0 && newIndex < allGames.length) {
          startPerformanceTracking("updateGameIndex")
          setCurrentGameIndex(newIndex)

          // Αποθήκευση τόσο του τρέχοντος δείκτη όσο και της ακριβούς θέσης κύλισης στο localStorage
          // Χρήση setTimeout για να αποφύγουμε πολλαπλές εγγραφές στο localStorage
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }

          scrollTimeoutRef.current = setTimeout(() => {
            localStorage.setItem("current-game-index", newIndex.toString())
            localStorage.setItem("horizontal-scroll-position", scrollPosition.toString())
            localStorage.setItem("last-played-game", allGames[newIndex].id)
            localStorage.setItem("last-viewed-game-id", allGames[newIndex].id)
          }, 100)

          endPerformanceTracking("updateGameIndex")
        }
      })
    }, 16), // Μειώστε το throttle σε 16ms (περίπου 60fps) για πιο ομαλή κύλιση
  )

  // Optimized scroll handler with minimal calculations
  // const handleScroll = useCallback(() => {
  //   if (!scrollContainerRef.current || isManualScrolling) return

  //   // Throttle scroll events for better performance
  //   const now = Date.now()
  //   if (now - lastScrollTimeRef.current < 50) return
  //   lastScrollTimeRef.current = now

  //   // Use requestAnimationFrame for better performance
  //   requestAnimationFrame(() => {
  //     if (!scrollContainerRef.current) return

  //     // Get current scroll position
  //     const scrollPosition = scrollContainerRef.current.scrollLeft

  //     // Only update if scroll position has changed significantly
  //     if (Math.abs(scrollPosition - lastScrollPositionRef.current) < 10) return
  //     lastScrollPositionRef.current = scrollPosition

  //     // Calculate current game index based on scroll position
  //     const containerWidth = scrollContainerRef.current.clientWidth
  //     const newIndex = Math.round(scrollPosition / containerWidth)

  //     // Update current game index if changed
  //     if (newIndex !== currentGameIndex && newIndex >= 0 && newIndex < clickerGames.length) {
  //       setCurrentGameIndex(newIndex)
  //       // Save the current index to localStorage
  //       localStorage.setItem("current-game-index", newIndex.toString())
  //     }
  //   })
  // }, [currentGameIndex, isManualScrolling, clickerGames.length])

  // Save scroll position and restore it when returning to the homepage
  useEffect(() => {
    if (mounted && scrollContainerRef.current && !initialScrollDone) {
      // Get saved game index from localStorage with fallback
      const savedIndex = localStorage.getItem("current-game-index")
      const lastPlayedGame = localStorage.getItem("last-played-game")

      if (lastPlayedGame) {
        // Βρες το index του τελευταίου παιχνιδιού από το ID
        const gameIndex = allGames.findIndex((game) => game.id === lastPlayedGame)

        if (gameIndex !== -1) {
          // Άμεση ενημέρωση του state
          setCurrentGameIndex(gameIndex)

          // Άμεση μετάβαση στο αποθηκευμένο παιχνίδι χωρίς animation
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              const containerWidth = scrollContainerRef.current.clientWidth
              scrollContainerRef.current.scrollTo({
                left: containerWidth * gameIndex,
                behavior: "auto", // Άμεση μετάβαση χωρίς animation
              })
              console.log(`Άμεση μετάβαση στο παιχνίδι ${lastPlayedGame} (index: ${gameIndex})`)

              // Προσθήκη δεύτερου requestAnimationFrame για καλύτερο συγχρονισμό
              requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: containerWidth * gameIndex,
                    behavior: "auto",
                  })
                }
              })
            }
          })
        } else if (savedIndex) {
          // Fallback στο αποθηκευμένο index αν δεν βρεθεί το παιχνίδι
          const index = Math.min(Number.parseInt(savedIndex, 10), allGames.length - 1)
          setCurrentGameIndex(index)

          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              const containerWidth = scrollContainerRef.current.clientWidth
              scrollContainerRef.current.scrollTo({
                left: containerWidth * index,
                behavior: "auto",
              })
            }
          })
        }
      } else if (savedIndex) {
        // Fallback στο αποθηκευμένο index αν δεν υπάρχει last-played-game
        const index = Math.min(Number.parseInt(savedIndex, 10), allGames.length - 1)
        setCurrentGameIndex(index)

        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth
            scrollContainerRef.current.scrollTo({
              left: containerWidth * index,
              behavior: "auto",
            })
          }
        })
      }

      setInitialScrollDone(true)
    }

    // Save position when leaving the page or component unmounts
    return () => {
      if (scrollContainerRef.current && mounted) {
        const saveIndex = currentGameIndex.toString()
        const savePosition = scrollContainerRef.current.scrollLeft.toString()
        localStorage.setItem("current-game-index", saveIndex)
        localStorage.setItem("horizontal-scroll-position", savePosition)
        localStorage.setItem("last-played-game", allGames[currentGameIndex].id)
        console.log(
          `Saved game position: index ${saveIndex}, position ${savePosition}, game ${allGames[currentGameIndex].id}`,
        )
      }
    }
  }, [mounted, initialScrollDone, currentGameIndex, allGames])

  // Χρησιμοποιούμε useLayoutEffect για άμεση αποκατάσταση της θέσης κύλισης πριν από την απόδοση
  useLayoutEffect(() => {
    if (mounted && scrollContainerRef.current && !initialScrollDone) {
      const lastPlayedGame = localStorage.getItem("last-played-game")

      if (lastPlayedGame) {
        const gameIndex = allGames.findIndex((game) => game.id === lastPlayedGame)

        if (gameIndex !== -1) {
          setCurrentGameIndex(gameIndex)

          // Άμεση μετάβαση στο αποθηκευμένο παιχνίδι με διπλό requestAnimationFrame
          // για βελτιωμένη αξιοπιστία στο rendering
          const containerWidth = scrollContainerRef.current.clientWidth

          // Πρώτο scroll άμεσα
          scrollContainerRef.current.scrollTo({
            left: containerWidth * gameIndex,
            behavior: "auto",
          })

          // Δεύτερο scroll μετά από μικρή καθυστέρηση
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                left: containerWidth * gameIndex,
                behavior: "auto",
              })
            }
          }, 50)
        }
      }
    }
  }, [mounted, allGames, initialScrollDone])

  // Χρησιμοποιούμε το useLayoutEffect για άμεση αποκατάσταση της θέσης κύλισης
  // πριν από οποιαδήποτε απόδοση
  // useLayoutEffect(() => {
  //   if (!mounted) return

  //   // Έλεγχος αν πρέπει να αποκαταστήσουμε την ακριβή θέση κύλισης
  //   if (initialRender) {
  //     const exactScrollPosition = localStorage.getItem("exact-scroll-position")
  //     if (exactScrollPosition) {
  //       // Άμεση αποκατάσταση της θέσης κύλισης χωρίς καθυστέρηση
  //       window.scrollTo({
  //         top: Number.parseInt(exactScrollPosition),
  //         behavior: "auto", // Χρησιμοποιούμε "auto" αντί για "smooth" για άμεση μετάβαση χωρίς κίνηση
  //       })

  //       // Διατηρούμε τη θέση για μελλοντική χρήση αντί να την αφαιρούμε
  //       // localStorage.removeItem("exact-scroll-position")
  //     }
  //     setInitialRender(false)
  //   }
  // }, [mounted, initialRender])

  // Replace the first useEffect with usePerformanceEffect
  usePerformanceEffect(
    "initialMount",
    () => {
      if (mounted) return // Only run once on initial mount

      setMounted(true)

      // ΠΡΟΣΘΗΚΗ: Έλεγχος αν πρέπει να μεταφερθούμε απευθείας στο τελευταίο παιχνίδι
      const skipHomepage = localStorage.getItem("skip-homepage-scroll") === "true"
      const lastPlayedGame = localStorage.getItem("last-played-game")

      if (skipHomepage && lastPlayedGame) {
        // Καθαρίζουμε το flag
        localStorage.removeItem("skip-homepage-scroll")

        // Άμεση μετάβαση στο τελευταίο παιχνίδι χωρίς να περιμένουμε render
        router.push(`/games/${lastPlayedGame}`)
        return
      }

      // Fix for mobile viewport height issue (white space) and ensure animations work on mobile
      const fixViewportHeight = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)

        // Ensure animations are enabled on mobile
        document.documentElement.classList.remove("reduced-animation")
        document.documentElement.classList.remove("low-end")
      }

      fixViewportHeight()
      window.addEventListener("resize", fixViewportHeight)
      window.addEventListener("orientationchange", fixViewportHeight)

      // Also handle game links to save current game index before navigating
      const attachLinkHandlers = () => {
        const gameLinks = document.querySelectorAll('a[href^="/games/"]')
        gameLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            // Save the current game index and exact scroll position
            localStorage.setItem("current-game-index", currentGameIndex.toString())
            localStorage.setItem("exact-scroll-position", window.scrollY.toString())
            localStorage.setItem("horizontal-scroll-position", scrollContainerRef.current?.scrollLeft.toString() || "0")

            // Store the game ID from the href
            const href = link.getAttribute("href")
            if (href) {
              const gameId = href.split("/").pop()
              localStorage.setItem("last-played-game", gameId || "")
            }
          })
        })
      }

      // Attach handlers immediately
      attachLinkHandlers()

      return () => {
        window.removeEventListener("resize", fixViewportHeight)
        window.removeEventListener("orientationchange", fixViewportHeight)
      }
    },
    [router, currentGameIndex],
  )

  // Χρησιμοποιούμε το useEffect για να αποφύγουμε hydration errors
  // Τροποποιήστε το useEffect που φορτώνει τα δεδομένα
  // Προσθέστε forceUpdate στο dependency array του useEffect για να ενεργοποιήσετε ανανέωση
  // useEffect(() => {
  //   if (mounted) return // Only run once on initial mount

  //   setMounted(true)

  //   // ΠΡΟΣΘΗΚΗ: Έλεγχος αν πρέπει να μεταφερθούμε απευθείας στο τελευταίο παιχνίδι
  //   const skipHomepage = localStorage.getItem("skip-homepage-scroll") === "true"
  //   const lastPlayedGame = localStorage.getItem("last-played-game")

  //   if (skipHomepage && lastPlayedGame) {
  //     // Καθαρίζουμε το flag
  //     localStorage.removeItem("skip-homepage-scroll")

  //     // Άμεση μετάβαση στο τελευταίο παιχνίδι χωρίς να περιμένουμε render
  //     router.push(`/games/${lastPlayedGame}`)
  //     return
  //   }

  //   // Fix for mobile viewport height issue (white space) and ensure animations work on mobile
  //   const fixViewportHeight = () => {
  //     const vh = window.innerHeight * 0.01
  //     document.documentElement.style.setProperty("--vh", `${vh}px`)

  //     // Ensure animations are enabled on mobile
  //     document.documentElement.classList.remove("reduced-animation")
  //     document.documentElement.classList.remove("low-end")
  //   }

  //   fixViewportHeight()
  //   window.addEventListener("resize", fixViewportHeight)
  //   window.addEventListener("orientationchange", fixViewportHeight)

  //   // Also handle game links to save current game index before navigating
  //   const attachLinkHandlers = () => {
  //     const gameLinks = document.querySelectorAll('a[href^="/games/"]')
  //     gameLinks.forEach((link) => {
  //       link.addEventListener("click", (e) => {
  //         // Save the current game index
  //         localStorage.setItem("current-game-index", currentGameIndex.toString())

  //         // Store the game ID from the href
  //         const href = link.getAttribute("href")
  //         if (href) {
  //           const gameId = href.split("/").pop()
  //           localStorage.setItem("last-played-game", gameId)
  //         }
  //       })
  //     })
  //   }

  //   // Attach handlers immediately
  //   attachLinkHandlers()

  //   return () => {
  //     window.removeEventListener("resize", fixViewportHeight)
  //     window.removeEventListener("orientationchange", fixViewportHeight)
  //   }
  // }, [router, currentGameIndex]) // Remove mounted and forceUpdate from dependencies

  // Separate effect for visibility change to avoid loops
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Ο χρήστης επέστρεψε στη σελίδα - ανανέωση των δεδομένων
        refreshGameProgress()
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", refreshGameProgress)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", refreshGameProgress)
    }
  }, [refreshGameProgress])

  // Add event listener for real-time updates
  useEffect(() => {
    // Άμεση αρχική ανανέωση
    refreshGameProgress()

    // Δημιουργία μιας συνάρτησης που θα ελέγχει για αλλαγές στο localStorage
    const checkForChanges = () => {
      // Δημιουργία ενός αντιγράφου των τρεχόντων τιμών για σύγκριση
      const currentValues: Record<string, number> = {}

      // Έλεγχος όλων των παιχνιδιών για αλλαγές
      allGames.forEach((game) => {
        const possibleKeys = [
          `${game.id}-clicker-progress`,
          `${game.id}-progress`,
          `${game.id.replace("-clicker", "")}-clicker-progress`,
          `${game.id}-game-progress`,
        ]

        for (const key of possibleKeys) {
          const progress = localStorage.getItem(key)
          if (progress) {
            try {
              const progressData = JSON.parse(progress)
              let points = 0

              // Έλεγχος για διάφορα πεδία που μπορεί να περιέχουν πόντους
              if (progressData.score !== undefined) points = progressData.score
              else if (progressData.money !== undefined) points = progressData.money
              else if (progressData.points !== undefined) points = progressData.points
              else if (progressData.goals !== undefined) points = progressData.goals
              else if (progressData.sweets !== undefined) points = progressData.sweets
              else if (progressData.clicks !== undefined) points = progressData.clicks
              else if (progressData.fans !== undefined) points = progressData.fans
              else if (progressData.views !== undefined) points = progressData.views
              else if (progressData.subscribers !== undefined) points = progressData.subscribers
              else if (progressData.mainStat !== undefined) points = progressData.mainStat
              else {
                // Αν δεν βρεθεί κανένα από τα παραπάνω πεδία, ψάξε για οποιοδήποτε αριθμητικό πεδίο
                for (const field in progressData) {
                  if (typeof progressData[field] === "number" && progressData[field] > 0) {
                    points = progressData[field]
                    break
                  }
                }
              }

              if (points > 0) {
                currentValues[game.id] = points
                break // Βρήκαμε πρόοδο, δεν χρειάζεται να ελέγξουμε άλλα κλειδιά
              }
            } catch (e) {
              console.error(`Error checking progress for ${game.id}:`, e)
            }
          }
        }

        // Ειδικός χειρισμός για το detective-clicker
        if (game.id === "detective-clicker" && !currentValues[game.id]) {
          const clues = localStorage.getItem("detective-clicker-clues")
          if (clues) {
            try {
              const cluesValue = Number.parseFloat(clues)
              if (!isNaN(cluesValue) && cluesValue > 0) {
                currentValues[game.id] = cluesValue
              }
            } catch (e) {
              console.error(`Error reading clues for detective-clicker:`, e)
            }
          }
        }
      })

      // Έλεγχος αν υπάρχουν αλλαγές
      let hasChanges = false
      const currentProgressRef = progressRef.current

      // Σύγκριση με τις τρέχουσες τιμές
      Object.keys(currentValues).forEach((gameId) => {
        if (!currentProgressRef[gameId] || currentProgressRef[gameId] !== currentValues[gameId]) {
          hasChanges = true
        }
      })

      // Σύγκριση για παιχνίδια που μπορεί να έχουν αφαιρεθεί
      Object.keys(currentProgressRef).forEach((gameId) => {
        if (!currentValues[gameId]) {
          hasChanges = true
        }
      })

      // Αν υπάρχουν αλλαγές, ανανέωσε τα δεδομένα
      if (hasChanges) {
        console.log("Εντοπίστηκαν αλλαγές στην πρόοδο των παιχνιδιών!")
        setGamesWithProgress({ ...currentValues })
      }
    }

    // Ρύθμιση ενός interval που θα ελέγχει συχνά για αλλαγές
    const progressInterval = setInterval(checkForChanges, 1000) // Έλεγχος κάθε 1 δευτερόλεπτο

    // Επίσης, έλεγχος για αλλαγές όταν το παράθυρο αποκτά ξανά εστίαση
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForChanges()
      }
    }

    // Προσθήκη event listeners
    window.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", checkForChanges)
    window.addEventListener("storage", checkForChanges) // Για αλλαγές από άλλες καρτέλες

    // Καθαρισμός κατά την αποφόρτωση
    return () => {
      clearInterval(progressInterval)
      window.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", checkForChanges)
      window.removeEventListener("storage", checkForChanges)
    }
  }, [refreshGameProgress, allGames]) // Remove gamesWithProgress from dependencies

  // Αντικαταστήστε τις συναρτήσεις χειρισμού αφής με τις παρακάτω βελτιωμένες εκδόσεις:
  const handleTouchStart = (e: TouchEvent) => {
    // Αποφυγή πολλαπλών αγγιγμάτων - χρήση μόνο του πρώτου δακτύλου
    if (e.touches.length !== 1) return
    setIsManualScrolling(true)
    // Αποθήκευση της αρχικής θέσης αφής
    lastScrollPositionRef.current = e.touches[0].clientX

    // Προσθήκη: Αποθήκευση του χρόνου έναρξης για υπολογισμό ταχύτητας
    lastScrollTimeRef.current = Date.now()
  }

  const handleTouchMove = (e: TouchEvent) => {
    // Αποφυγή πολλαπλών αγγιγμάτων - χρήση μόνο του πρώτου δακτύλου
    if (e.touches.length !== 1 || !isManualScrolling || !scrollContainerRef.current) return

    // Υπολογισμός της απόστασης που έχει μετακινηθεί
    const currentX = e.touches[0].clientX
    const diff = lastScrollPositionRef.current - currentX

    // Αποφυγή μικρών κινήσεων που μπορεί να είναι ακούσιες
    if (Math.abs(diff) < 2) return

    // Εφαρμογή αντίστασης στην κύλιση στα άκρα για πιο φυσική αίσθηση
    if ((currentGameIndex === 0 && diff < 0) || (currentGameIndex === allGames.length - 1 && diff > 0)) {
      // Μειωμένη επίδραση της κύλισης στα άκρα
      scrollContainerRef.current.scrollLeft += diff * 0.2
    } else {
      // Άμεση ανταπόκριση χωρίς καθυστέρηση
      scrollContainerRef.current.scrollLeft += diff
    }

    // Ενημέρωση της τελευταίας θέσης για την επόμενη κίνηση
    lastScrollPositionRef.current = currentX

    // Αποτροπή της προεπιλεγμένης συμπεριφοράς (όπως κύλιση της σελίδας)
    e.preventDefault()
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isManualScrolling || !scrollContainerRef.current) {
      setIsManualScrolling(false)
      return
    }

    // Υπολογισμός της ταχύτητας κύλισης
    const now = Date.now()
    const timeElapsed = now - lastScrollTimeRef.current
    const containerWidth = scrollContainerRef.current.clientWidth
    const currentScrollLeft = scrollContainerRef.current.scrollLeft

    // Υπολογισμός του τρέχοντος δείκτη με βάση τη θέση
    let targetIndex = Math.round(currentScrollLeft / containerWidth)

    // Περιορισμός του δείκτη στα όρια του πίνακα
    targetIndex = Math.max(0, Math.min(targetIndex, allGames.length - 1))

    // Άμεση ενημέρωση του state
    setCurrentGameIndex(targetIndex)

    // Άμεση μετάβαση στη σωστή θέση χωρίς animation
    scrollContainerRef.current.scrollTo({
      left: containerWidth * targetIndex,
      behavior: "auto",
    })

    // Αποθήκευση στο localStorage
    localStorage.setItem("current-game-index", targetIndex.toString())
    localStorage.setItem("last-played-game", allGames[targetIndex].id)

    // Επαναφορά της κατάστασης
    setIsManualScrolling(false)
  }

  // Add event listeners for scroll container
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current) return

    const container = scrollContainerRef.current

    // Προσθήκη event listener για scroll με passive flag για καλύτερη απόδοση
    container.addEventListener("scroll", handleScroll, { passive: true })

    // Αντικαταστήστε τους event listeners για touch events με τους παρακάτω βελτιωμένους:
    // Προσθήκη event listeners με passive: false για καλύτερη απόδοση
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false }) // passive: false για να επιτρέπεται το preventDefault()
    container.addEventListener("touchend", handleTouchEnd, { passive: true })
    container.addEventListener("touchcancel", () => setIsManualScrolling(false), { passive: true })

    // Προσθήκη event listener για wheel για καλύτερο έλεγχο
    container.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          // Οριζόντια κύλιση με τροχό - αφήστε το να συμβεί φυσικά
          return
        }

        // Κάθετη κύλιση - μετατροπή σε οριζόντια
        e.preventDefault()
        container.scrollLeft += e.deltaY
      },
      { passive: false },
    )

    return () => {
      container.removeEventListener("scroll", handleScroll)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", () => setIsManualScrolling(false))
      container.removeEventListener("wheel", handleTouchEnd)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [mounted, handleScroll, allGames.length])

  // Προσθέστε αυτό το useEffect για να ρυθμίσετε τον Intersection Observer
  useEffect(() => {
    if (!mounted || typeof IntersectionObserver === "undefined") return

    // Καθαρισμός προηγούμενου observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Δημιουργία νέου observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gameId = entry.target.getAttribute("data-game-id")
            const gameIndex = allGames.findIndex((game) => game.id === gameId)

            if (gameIndex !== -1 && gameIndex !== currentGameIndex) {
              // Ενημέρωση του τρέχοντος παιχνιδιού χωρίς να προκαλέσει κύλιση
              // (χρησιμοποιείται ως βοηθητικός μηχανισμός για το κύριο σύστημα κύλισης)
              requestAnimationFrame(() => {
                setCurrentGameIndex(gameIndex)
              })
            }
          }
        })
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "0px",
        threshold: 0.6, // Απαιτεί 60% ορατότητα για να θεωρηθεί ορατό
      },
    )

    // Παρακολούθηση όλων των καρτών παιχνιδιών
    const gameCards = document.querySelectorAll(".game-card-container")
    gameCards.forEach((card) => {
      observerRef.current?.observe(card)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [mounted, currentGameIndex, allGames])

  // Προσθέστε αυτό το useEffect για προφόρτωση γειτονικών παιχνιδιών
  useEffect(() => {
    if (!mounted) return

    // Προφόρτωση των γειτονικών παιχνιδιών (προηγούμενο και επόμενο)
    const preloadNeighbors = () => {
      const preloadIndexes = [currentGameIndex - 1, currentGameIndex + 1].filter(
        (idx) => idx >= 0 && idx < allGames.length,
      )

      preloadIndexes.forEach((idx) => {
        const game = allGames[idx]
        if (game && game.image && game.image.startsWith("/")) {
          const img = new Image()
          img.src = game.image
        }
      })
    }

    preloadNeighbors()
  }, [currentGameIndex, mounted, allGames])

  // Προσθέστε αυτή τη βελτιωμένη συνάρτηση για κύλιση σε συγκεκριμένο παιχνίδι

  // Προσθέστε αυτή τη συνάρτηση μετά από τις άλλες συναρτήσεις χειρισμού
  const handleBackFromGame = useCallback(() => {
    // Restore the exact position without animation
    if (scrollContainerRef.current) {
      const lastPlayedGame = localStorage.getItem("last-played-game")

      if (lastPlayedGame) {
        const gameIndex = allGames.findIndex((game) => game.id === lastPlayedGame)

        if (gameIndex !== -1) {
          setCurrentGameIndex(gameIndex)

          // Άμεση μετάβαση στο αποθηκευμένο παιχνίδι
          const containerWidth = scrollContainerRef.current.clientWidth
          scrollContainerRef.current.scrollTo({
            left: containerWidth * gameIndex,
            behavior: "auto",
          })

          console.log(`Άμεση μετάβαση στο παιχνίδι ${lastPlayedGame} (index: ${gameIndex})`)
        }
      }

      // Fallback στο αποθηκευμένο index
      const savedIndex = localStorage.getItem("current-game-index")
      if (savedIndex) {
        const index = Number.parseInt(savedIndex, 10)
        setCurrentGameIndex(index)

        // Άμεση μετάβαση
        const containerWidth = scrollContainerRef.current.clientWidth
        scrollContainerRef.current.scrollTo({
          left: containerWidth * index,
          behavior: "auto",
        })
      }
    }
  }, [allGames])

  // Προσθέστε αυτό το useEffect για να ανιχνεύει την επιστροφή από παιχνίδι
  useEffect(() => {
    window.addEventListener("popstate", handleBackFromGame)
    return () => {
      window.removeEventListener("popstate", handleBackFromGame)
    }
  }, [handleBackFromGame])

  // Additional handler for more reliable back navigation centering
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to ensure the DOM is ready after navigation
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const savedIndex = localStorage.getItem("current-game-index")
          if (savedIndex) {
            const index = Number.parseInt(savedIndex, 10)
            const containerWidth = scrollContainerRef.current.clientWidth

            // Force centering on the correct game
            scrollContainerRef.current.scrollTo({
              left: containerWidth * index,
              behavior: "auto",
            })

            console.log("Back navigation: centered on game", index)
          }
        }
      }, 150)
    }

    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Ενημέρωση του χρώματος του fluid border όταν αλλάζει το τρέχον παιχνίδι
  useEffect(() => {
    if (!mounted) return

    // Αποθήκευση του τρέχοντος χρώματος παιχνιδιού στο localStorage
    const currentGame = allGames[currentGameIndex]
    if (currentGame) {
      const gameColor = currentGame.color.split(" ")[0].replace("from-", "")
      localStorage.setItem("current-game-color", gameColor)

      // Ενημέρωση του CSS για το τρέχον χρώμα παιχνιδιού
      document.documentElement.style.setProperty("--current-game-color", gameColor)
    }
  }, [currentGameIndex, mounted, allGames])

  // Add this effect to save the current game whenever it changes
  useEffect(() => {
    if (mounted && currentGameIndex >= 0 && currentGameIndex < allGames.length) {
      localStorage.setItem("current-game-index", currentGameIndex.toString())
      localStorage.setItem("last-played-game", allGames[currentGameIndex].id)
      console.log(`Saved current game: ${allGames[currentGameIndex].id} at index ${currentGameIndex}`)
    }
  }, [currentGameIndex, mounted, allGames])

  // Προσθέστε αυτό το νέο useEffect μετά το άλλο useEffect για το visibilityChange
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Όταν η σελίδα γίνεται ορατή, ελέγχουμε και επαναφέρουμε τη θέση κύλισης αν χρειάζεται
      if (document.visibilityState === "visible" && scrollContainerRef.current && mounted) {
        const lastPlayedGame = localStorage.getItem("last-played-game")

        if (lastPlayedGame) {
          const gameIndex = allGames.findIndex((game) => game.id === lastPlayedGame)
          if (gameIndex !== -1 && gameIndex !== currentGameIndex) {
            console.log("Visibility change: Restoring game position")

            // Ενημέρωση του index
            setCurrentGameIndex(gameIndex)

            // Κύλιση στο σωστό παιχνίδι
            setTimeout(() => {
              if (scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth
                scrollContainerRef.current.scrollTo({
                  left: containerWidth * gameIndex,
                  behavior: "auto",
                })
              }
            }, 100)
          }
        }
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [allGames, currentGameIndex, mounted])

  if (!mounted) {
    return null
  }

  // Επιλογή χρωματικού συνδυασμού με βάση το τρέχον θέμα
  const getThemeColors = () => {
    switch (settings.theme) {
      case "futuristic":
        return {
          background: "var(--background-gradient)",
          cardBg: "var(--card-background)",
          cardBorder: "var(--card-border)",
          textColor: "var(--text-color)",
          headerColor: "var(--header-color)",
          buttonBg: "var(--button-gradient)",
          buttonHoverBg: "var(--button-hover-gradient)",
          buttonText: "var(--button-text)",
          shadow: "var(--theme-shadow)",
        }
      case "retro":
        return {
          background: "var(--background-gradient)",
          cardBg: "var(--card-background)",
          cardBorder: "var(--card-border)",
          textColor: "var(--text-color)",
          headerColor: "var(--header-color)",
          buttonBg: "var(--button-gradient)",
          buttonHoverBg: "var(--button-hover-gradient)",
          buttonText: "var(--button-text)",
          shadow: "var(--theme-shadow)",
        }
      case "nature":
        return {
          background: "var(--background-gradient)",
          cardBg: "var(--card-background)",
          cardBorder: "var(--card-border)",
          textColor: "var(--text-color)",
          headerColor: "var(--header-color)",
          buttonBg: "var(--button-gradient)",
          buttonHoverBg: "var(--button-hover-gradient)",
          buttonText: "var(--button-text)",
          shadow: "var(--theme-shadow)",
        }
      case "dark":
        return {
          background: "var(--background-gradient)",
          cardBg: "var(--card-background)",
          cardBorder: "var(--card-border)",
          textColor: "var(--text-color)",
          headerColor: "var(--header-color)",
          buttonBg: "var(--button-gradient)",
          buttonHoverBg: "var(--button-hover-gradient)",
          buttonText: "var(--button-text)",
          shadow: "var(--theme-shadow)",
        }
      default: // western theme (default)
        return {
          background: "var(--background-gradient)",
          cardBg: "var(--card-background)",
          cardBorder: "var(--card-border)",
          textColor: "var(--text-color)",
          headerColor: "var(--header-color)",
          buttonBg: "var(--button-gradient)",
          buttonHoverBg: "var(--button-hover-gradient)",
          buttonText: "var(--button-text)",
          shadow: "var(--theme-shadow)",
        }
    }
  }

  const themeColors = getThemeColors()

  // Create pagination buttons array outside of JSX to avoid re-renders
  const paginationButtons = []

  // Only add prev group button if needed
  if (paginationData.hasPrevGroup) {
    paginationButtons.push(
      <button
        key="prev-group"
        className="min-w-7 h-7 rounded-full transition-all text-xs flex items-center justify-center bg-white/30 text-white hover:bg-white/50 px-2"
        onClick={goToPrevGroup}
        aria-label="Previous group"
      >
        «
      </button>,
    )
  }

  // Add page buttons for current group
  for (let i = paginationData.startIndex; i < paginationData.endIndex; i++) {
    paginationButtons.push(
      <button
        key={`page-${i}`}
        className={`min-w-7 h-7 rounded-full transition-all text-xs flex items-center justify-center ${
          i === currentGameIndex
            ? "bg-white text-black font-bold scale-110"
            : "bg-white/30 text-white hover:bg-white/50"
        }`}
        onClick={() => goToPage(i)}
        aria-label={`Go to game ${i + 1}`}
      >
        {i + 1}
      </button>,
    )
  }

  // Only add next group button if needed
  if (paginationData.hasNextGroup) {
    paginationButtons.push(
      <button
        key="next-group"
        className="min-w-7 h-7 rounded-full transition-all text-xs flex items-center justify-center bg-white/30 text-white hover:bg-white/50 px-2"
        onClick={goToNextGroup}
        aria-label="Next group"
      >
        »
      </button>,
    )
  }

  return (
    <div
      className="min-h-screen relative w-full overflow-hidden m-0 p-0"
      style={{ color: themeColors.textColor, fontFamily: "var(--body-font)" }}
    >
      {/* Animated background using our new component */}
      <AnimatedBackground quality="high" disableOnLowEnd={false} />

      {/* Content */}
      <div className="w-full relative z-10 m-0 p-0" style={{ backgroundColor: "transparent" }}>
        <h1
          className={`text-${isMobile ? "3xl" : "4xl"} font-bold text-center pt-10 mt-8 m-0 relative`}
          style={{ fontFamily: "var(--main-font)", color: themeColors.headerColor }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] inline-block">
            ClickerMania
          </span>
          <div className="absolute -top-5 -left-5 w-[calc(100%+40px)] h-[calc(100%+20px)] rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl -z-10"></div>
        </h1>
        {/* Horizontal scrolling container */}
        <div className="relative w-full mt-10">
          {/* Invisible click areas for navigation */}
          <div
            className="absolute left-0 top-0 w-1/5 h-full z-10 cursor-pointer touch-optimized"
            onClick={() => {
              scrollLeft()
              // Ensure the game ID is saved immediately
              if (currentGameIndex > 0) {
                localStorage.setItem("last-played-game", allGames[currentGameIndex - 1].id)
              }
            }}
            aria-label="Previous game"
          />
          <div
            className="absolute right-0 top-0 w-1/5 h-full z-10 cursor-pointer touch-optimized"
            onClick={() => {
              scrollRight()
              // Ensure the game ID is saved immediately
              if (currentGameIndex < allGames.length - 1) {
                localStorage.setItem("last-played-game", allGames[currentGameIndex + 1].id)
              }
            }}
            aria-label="Next game"
          />
          {/* Horizontal scrolling games container */}
          <div
            ref={scrollContainerRef}
            className={`flex overflow-x-auto hide-scrollbar py-2 px-0 mx-auto snap-x snap-mandatory scroll-smooth scroll-container ${isLowPerformance ? "low-performance" : ""}`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              maxWidth: "100vw",
              willChange: "scroll-position",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translate3d(0,0,0)",
              WebkitTransform: "translate3d(0,0,0)",
              perspective: "1000px",
              WebkitPerspective: "1000px",
              scrollSnapType: "x mandatory",
              scrollBehavior: "auto",
              scrollPaddingLeft: "0px",
              scrollPaddingRight: "0px",
              overscrollBehavior: "contain",
              touchAction: "pan-x",
              WebkitTapHighlightColor: "transparent", // Προσθήκη: Αφαίρεση του highlight κατά το tap
            }}
          >
            {allGames.map((game, index) => (
              <div
                key={game.id}
                className="flex-shrink-0 w-[100vw] px-4 game-card-container flex justify-center snap-start scroll-item"
                style={{ scrollSnapAlign: "center" }}
                data-game-id={game.id}
              >
                <Link
                  href={game.href}
                  className="block transition-all duration-300 h-full w-full max-w-md"
                  data-game-id={game.id}
                >
                  <Card
                    className={`w-full h-full overflow-hidden relative ${touchOptimized ? "touch-optimized" : ""} game-card magnetic-border-card`}
                    style={{
                      backgroundColor: themeColors.cardBg,
                      borderWidth: "3px",
                      borderStyle: "solid",
                      borderColor: `${game.color.split(" ")[0].replace("from-", "")}`,
                      color: themeColors.textColor,
                      boxShadow: `0 0 15px ${game.color.split(" ")[0].replace("from-", "")}80`,
                      transition: "all 0.3s ease",
                    }}
                    data-game-id={game.id}
                    data-game-color={game.color.split(" ")[0].replace("from-", "")}
                    onMouseMove={(e) => {
                      if (isLowPerformance) return
                      const card = e.currentTarget
                      const rect = card.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const centerX = rect.width / 2
                      const centerY = rect.height / 2

                      // Calculate distance from center (0 to 1)
                      const distanceX = (x - centerX) / centerX
                      const distanceY = (y - centerY) / centerY

                      // Calculate corners position
                      card.style.setProperty("--mouse-x", `${x}px`)
                      card.style.setProperty("--mouse-y", `${y}px`)
                      card.style.setProperty("--distance-x", distanceX.toString())
                      card.style.setProperty("--distance-y", distanceY.toString())

                      card.classList.add("magnetic-active")
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.classList.remove("magnetic-active")
                    }}
                  >
                    {gamesWithProgress[game.id] && (
                      <div
                        className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-red-600 z-10 shadow-[0_0_10px_rgba(255,0,0,0.7)] ${isLowPerformance ? "" : "animate-pulse"}`}
                        key={`progress-badge-${game.id}`}
                      />
                    )}
                    <div
                      className="aspect-video w-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: `linear-gradient(to right, ${game.color.replace("from-", "").replace("to-", "")})`,
                      }}
                    >
                      <span className="text-9xl">{game.emoji}</span>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle
                        className="text-xl"
                        style={{ fontFamily: "var(--main-font)", color: themeColors.headerColor }}
                      >
                        {game.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-1" style={{ color: `${themeColors.textColor}cc` }}>
                        {game.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <div
                        className="w-full py-2 px-4 text-white font-semibold rounded-md text-center shadow-[0_0_15px_rgba(255,255,255,0.2)] text-lg"
                        style={{
                          background: themeColors.buttonBg,
                          color: themeColors.buttonText,
                        }}
                      >
                        Play Now
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Game counter and pagination dots */}
        <div className="text-center mt-1 text-sm opacity-70">
          {currentGameIndex + 1} / {allGames.length}
        </div>
        {/* Pagination numbers */}
        <div className="flex justify-center mt-1 text-sm opacity-70">
          {paginationData.currentGroup + 1} / {paginationData.totalGroups}
        </div>
        {/* Προσθήκη του τμήματος προσαρμοσμένων παιχνιδιών */}
        {/* Reset button with mobile optimization */}
        //
        <div className="flex justify-center mt-2">
          <Button
            onClick={() => setOpen(true)}
            className={`font-bold py-2 px-4 rounded-full border-none flex items-center gap-2 text-base ${touchOptimized ? "touch-optimized" : ""}`}
            style={{
              background: "var(--button-gradient)",
              color: "var(--button-text)",
              boxShadow: "0 0 20px var(--theme-shadow)",
              minHeight: touchOptimized ? "44px" : undefined,
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset All Games</span>
          </Button>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          style={{
            backgroundColor: "var(--card-background)",
            borderColor: "var(--menu-border)",
            color: "var(--text-color)",
            backdropFilter: "blur(8px)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "var(--header-color)" }}>Reset All Games?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: `var(--text-color)cc` }}>
              This action will reset all your progress in all games. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                backgroundColor: "var(--card-background)",
                borderColor: "var(--menu-border)",
                color: "var(--text-color)",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              style={{
                background: "var(--button-gradient)",
                color: "var(--button-text)",
                borderColor: "var(--accent-color)",
              }}
            >
              Reset All Games
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style jsx global>{`
        /* Υπάρχον CSS */
  
        /* Βελτιστοποιήσεις για κύλιση */
        .scroll-container {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: auto; /* Changed from scrollBehavior to always use "auto" */
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scroll-container::-webkit-scrollbar {
          display: none;
        }

        .scroll-item {
          scroll-snap-align: center;
          scroll-snap-stop: always;
        }

        /* Βελτιστοποιήσεις απόδοσης για κάρτες */
        .game-card-container {
          will-change: transform;
          transform: translate3d(0,0,0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000;
          -webkit-perspective: 1000;
        }

        .game-card {
          will-change: transform, box-shadow;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
          transition: none; /* Removed transition animations */
        }

        /* Βελτιστοποιήσεις για κινητές συσκευές */
        @media (max-width: 768px) {
          .game-card {
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
          }

          .scroll-container {
            touch-action: pan-x;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Βελτιστοποιήσεις για χειρισμό αφής */
        .touch-optimized {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          cursor: pointer;
        }

        /* Αύξηση του μεγέθους των στοιχείων αφής για κινητές συσκευές */
        @media (max-width: 768px) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          button, 
          [role="button"],
          a.button,
          input[type="button"],
          input[type="submit"] {
            min-height: 44px;
            min-width: 44px;
            padding: 12px;
          }
        }

        /* Απενεργοποίηση της επιλογής κειμένου κατά την κύλιση */
        .scroll-container * {
          user-select: none;
          -webkit-user-select: none;
        }

        /* Βελτίωση της απόδοσης κύλισης */
        .scroll-container {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          touch-action: pan-x;
        }

        .game-card {
          position: relative;
          z-index: 1;
        }

        .game-card:hover {
          transform: none;
          box-shadow: 0 0 30px var(--game-color) !important;
        }

        [data-game-id]:hover {
          --game-color: rgba(255, 255, 255, 0.5);
        }

        [data-game-id="clicker"]:hover { --game-color: rgba(76, 29, 149, 0.7); }
        [data-game-id="youtube-clicker"]:hover { --game-color: rgba(220, 38, 38, 0.7); }
        [data-game-id="lotr-clicker"]:hover { --game-color: rgba(180, 83, 9, 0.7); }
        [data-game-id="sweet-clicker"]:hover { --game-color: rgba(219, 39, 119, 0.7); }
        [data-game-id="western-clicker"]:hover { --game-color: rgba(180, 83, 9, 0.7); }
        [data-game-id="football-clicker"]:hover { --game-color: rgba(22, 163, 74, 0.7); }
        [data-game-id="capitalism-clicker"]:hover { --game-color: rgba(37, 99, 235, 0.7); }
        [data-game-id="emotions-clicker"]:hover { --game-color: rgba(219, 39, 119, 0.7); }
        [data-game-id="real-estate-clicker"]:hover { --game-color: rgba(37, 99, 235, 0.7); }
        [data-game-id="animal-clicker"]:hover { --game-color: rgba(21, 128, 61, 0.7); }
        [data-game-id="space-clicker"]:hover { --game-color: rgba(49, 46, 129, 0.7); }
        [data-game-id="fight-club-clicker"]:hover { --game-color: rgba(17, 24, 39, 0.7); }
        [data-game-id="school-clicker"]:hover { --game-color: rgba(37, 99, 235, 0.7); }
        [data-game-id="godfather-clicker"]:hover { --game-color: rgba(127, 29, 29, 0.7); }
        [data-game-id="monster-clicker"]:hover { --game-color: rgba(126, 34, 206, 0.7); }
        [data-game-id="vehicle-clicker"]:hover { --game-color: rgba(30, 58, 138, 0.7); }
        [data-game-id="weather-clicker"]:hover { --game-color: rgba(2, 132, 199, 0.7); }
        [data-game-id="alien-clicker"]:hover { --game-color: rgba(21, 128, 61, 0.7); }
        [data-game-id="troy-clicker"]:hover { --game-color: rgba(146, 64, 14, 0.7); }
        [data-game-id="city-clicker"]:hover { --game-color: rgba(30, 64, 175, 0.7); }
        [data-game-id="rockstar-clicker"]:hover { --game-color: rgba(126, 34, 206, 0.7); }
        [data-game-id="budapest-clicker"]:hover { --game-color: rgba(219, 39, 119, 0.7); }
        [data-game-id="pirate-clicker"]:hover { --game-color: rgba(30, 64, 175, 0.7); }
        [data-game-id="music-producer-clicker"]:hover { --game-color: rgba(126, 34, 206, 0.7); }
        [data-game-id="greek-mythology-clicker"]:hover { --game-color: rgba(37, 99, 235, 0.7); }
        [data-game-id="holiday-clicker"]:hover { --game-color: rgba(14, 165, 233, 0.7); }
        [data-game-id="breaking-bad-clicker"]:hover { --game-color: rgba(21, 128, 61, 0.7); }
        [data-game-id="saltburn-clicker"]:hover { --game-color: rgba(251, 191, 36, 0.7); }
        [data-game-id="mountain-clicker"]:hover { --game-color: rgba(8, 145, 178, 0.7); }
        [data-game-id="strategy"]:hover { --game-color: rgba(30, 58, 138, 0.7); }
        [data-game-id="norse-clicker"]:hover { --game-color: rgba(15, 23, 42, 0.7); }
        [data-game-id="aviation-clicker"]:hover { --game-color: rgba(2, 132, 199, 0.7); }
        [data-game-id="supermarket-clicker"]:hover { --game-color: rgba(22, 163, 74, 0.7); }
        [data-game-id="clothing-clicker"]:hover { --game-color: rgba(124, 58, 237, 0.7); }
        [data-game-id="cookie-clicker"]:hover { --game-color: rgba(217, 119, 6, 0.7); }
        [data-game-id="dinosaur-clicker"]:hover { --game-color: rgba(22, 101, 52, 0.7); }
        [data-game-id="zombie-clicker"]:hover { --game-color: rgba(22, 101, 52, 0.7); }
        [data-game-id="restaurant-clicker"]:hover { --game-color: rgba(194, 65, 12, 0.7); }
        [data-game-id="detective-clicker"]:hover { --game-color: rgba(30, 58, 138, 0.7); }
        [data-game-id="galaxy-clicker"]:hover { --game-color: rgba(76, 29, 149, 0.7); }
        [data-game-id="wizard-clicker"]:hover { --game-color: rgba(76, 29, 149, 0.7); }
        }

        @keyframes pulse-border {
          0% {
            box-shadow: 0 0 0 0 var(--game-color);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        .game-card {
          animation: pulse-border 2s infinite;
        }

        /* Προσθέστε CSS μεταβλητές για τα χρώματα των παιχνιδιών */
        :root {
          --game-color-clicker: rgba(76, 29, 149, 1);
          --game-color-youtube-clicker: rgba(220, 38, 38, 1);
          --game-color-lotr-clicker: rgba(180, 83, 9, 1);
          --game-color-sweet-clicker: rgba(219, 39, 119, 1);
          --game-color-western-clicker: rgba(180, 83, 9, 1);
          --game-color-football-clicker: rgba(22, 163, 74, 1);
          --game-color-capitalism-clicker: rgba(37, 99, 235, 1);
          --game-color-emotions-clicker: rgba(219, 39, 119, 1);
          --game-color-real-estate-clicker: rgba(37, 99, 235, 1);
          --game-color-animal-clicker: rgba(21, 128, 61, 1);
          --game-color-space-clicker: rgba(49, 46, 129, 1);
          --game-color-fight-club-clicker: rgba(17, 24, 39, 1);
          --game-color-school-clicker: rgba(37, 99, 235, 1);
          --game-color-godfather-clicker: rgba(127, 29, 29, 1);
          --game-color-monster-clicker: rgba(126, 34, 206, 1);
          --game-color-vehicle-clicker: rgba(30, 58, 138, 1);
          --game-color-weather-clicker: rgba(2, 132, 199, 1);
          --game-color-alien-clicker: rgba(21, 128, 61, 1);
          --game-color-troy-clicker: rgba(146, 64, 14, 1);
          --game-color-city-clicker: rgba(30, 64, 175, 1);
          --game-color-rockstar-clicker: rgba(126, 34, 206, 1);
          --game-color-budapest-clicker: rgba(219, 39, 119, 1);
          --game-color-pirate-clicker: rgba(30, 64, 175, 1);
          --game-color-music-producer-clicker: rgba(126, 34, 206, 1);
          --game-color-greek-mythology-clicker: rgba(37, 99, 235, 1);
          --game-color-holiday-clicker: rgba(14, 165, 233, 1);
          --game-color-breaking-bad-clicker: rgba(21, 128, 61, 1);
          --game-color-saltburn-clicker: rgba(251, 191, 36, 1);
          --game-color-mountain-clicker: rgba(8, 145, 178, 1);
          --game-color-strategy: rgba(30, 58, 138, 1);
          --game-color-norse-clicker: rgba(15, 23, 42, 1);
          --game-color-aviation-clicker: rgba(2, 132, 199, 1);
          --game-color-supermarket-clicker: rgba(22, 163, 74, 1);
          --game-color-clothing-clicker: rgba(124, 58, 237, 1);
          --game-color-cookie-clicker: rgba(217, 119, 6, 1);
          --game-color-dinosaur-clicker: rgba(22, 101, 52, 1);
          --game-color-zombie-clicker: rgba(22, 101, 52, 1);
          --game-color-restaurant-clicker: rgba(194, 65, 12, 1);
          --game-color-detective-clicker: rgba(30, 58, 138, 1);
          --game-color-galaxy-clicker: rgba(76, 29, 149, 1);
          --game-color-wizard-clicker: rgba(76, 29, 149, 1);
        }

        .game-card-container {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }

        .game-card {
          will-change: transform, box-shadow;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Magnetic Border Effect */
        .magnetic-border-card {
          --border-width: 3px;
          --border-radius: 8px;
          --mouse-x: 50%;
          --mouse-y: 50%;
          --distance-x: 0;
          --distance-y: 0;
        }

        .magnetic-border-card::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: calc(var(--border-radius) + 2px);
          background: transparent;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          z-index: 0;
          opacity: 0;
          pointer-events: none;
        }

        .magnetic-border-card::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: calc(var(--border-radius) + 2px);
          background: transparent;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          z-index: 0;
          opacity: 0;
          pointer-events: none;
        }

        .magnetic-border-card.magnetic-active::before {
          opacity: 1;
          border-color: var(--game-color);
          transform: perspective(800px) 
            rotateY(calc(var(--distance-x) * 15deg)) 
            rotateX(calc(var(--distance-y) * -15deg)) 
            translateX(calc(var(--distance-x) * 10px)) 
            translateY(calc(var(--distance-y) * 10px));
          box-shadow: 
            0 0 20px var(--game-color),
            0 0 30px var(--game-color),
            inset 0 0 30px rgba(255,255,255,0.05);
        }

        .magnetic-border-card::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: calc(var(--border-radius) + 2px);
          background: transparent;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          z-index: 0;
          opacity: 0;
          pointer-events: none;
        }

        .magnetic-border-card.magnetic-active::after {
          opacity: 0.3;
          border-color: var(--game-color);
          transform: perspective(800px) 
            rotateY(calc(var(--distance-x) * 10deg)) 
            rotateX(calc(var(--distance-y) * -10deg)) 
            translateX(calc(var(--distance-x) * 5px)) 
            translateY(calc(var(--distance-y) * 5px));
          filter: blur(10px);
          box-shadow: 0 0 10px var(--game-color);
        }

        .magnetic-border-card.magnetic-active {
          transform: none !important;
        }

        @media (max-width: 768px) {
          .magnetic-border-card::before,
          .magnetic-border-card::after,
          .magnetic-border-card.magnetic-active::before,
          .magnetic-border-card.magnetic-active::after {
            display: none;
          }
          
          .magnetic-border-card.magnetic-active {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
