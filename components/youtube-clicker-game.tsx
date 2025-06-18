"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Video,
  Upload,
  Camera,
  Monitor,
  Users,
  Award,
  TrendingUp,
  Star,
  Share2,
  Youtube,
  Play,
  ThumbsUp,
  Bell,
} from "lucide-react"

const UPGRADES = [
  {
    id: "content_quality",
    name: "Content Quality",
    description: "Improve your videos with better content",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Video className="h-4 w-4 mr-1" />,
  },
  {
    id: "upload_schedule",
    name: "Upload Schedule",
    description: "Generate views automatically with consistent uploads",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <Upload className="h-4 w-4 mr-1" />,
  },
  {
    id: "equipment",
    name: "Equipment",
    description: "Upgrade your camera, microphone, and lighting",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Camera className="h-4 w-4 mr-1" />,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Promote your videos across social media",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Share2 className="h-4 w-4 mr-1" />,
  },
]

// Advanced upgrades
const ADVANCED_UPGRADES = [
  {
    id: "studio_setup",
    name: "Professional Studio",
    description: "Create a dedicated space for high-quality production",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% increase to content quality
    maxLevel: 10,
    icon: <Monitor className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "equipment", level: 10 } as const,
  },
  {
    id: "viral_video",
    name: "Viral Video Strategy",
    description: "Learn techniques to create viral content",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% increase to upload schedule
    maxLevel: 5,
    icon: <TrendingUp className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "marketing", level: 15 } as const,
  },
  {
    id: "collaboration",
    name: "Creator Collaborations",
    description: "Partner with other successful creators",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% increase to marketing
    maxLevel: 3,
    icon: <Users className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "content_quality", level: 15 } as const,
  },
  {
    id: "algorithm_boost",
    name: "Algorithm Optimization",
    description: "Master YouTube's recommendation algorithm",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% boost to all metrics
    maxLevel: 3,
    icon: <Star className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "upload_schedule", level: 20 } as const,
  },
  {
    id: "media_company",
    name: "Media Company",
    description: "Expand from a single creator to a full media organization",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Double all values
    maxLevel: 1,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "marketing", level: 15 } as const,
  },
]

// Channel milestones
const CHANNEL_MILESTONES = [
  { name: "New Creator", threshold: 0, icon: "🎬" },
  { name: "Rising Star", threshold: 100, icon: "⭐" },
  { name: "Content Creator", threshold: 500, icon: "📱" },
  { name: "Trending Creator", threshold: 2000, icon: "📈" },
  { name: "Silver Play Button", threshold: 10000, icon: "🥈" },
  { name: "Gold Play Button", threshold: 50000, icon: "🥇" },
  { name: "Diamond Play Button", threshold: 200000, icon: "💎" },
  { name: "YouTube Celebrity", threshold: 1000000, icon: "🌟" },
  { name: "Internet Phenomenon", threshold: 10000000, icon: "🚀" },
  { name: "YouTube Legend", threshold: 100000000, icon: "👑" },
]

// Content types for click effects
const CONTENT_TYPES = [
  "Gaming Video",
  "Tutorial",
  "Vlog",
  "Review",
  "Unboxing",
  "Reaction",
  "Commentary",
  "Podcast",
  "Music Cover",
  "Short Film",
]

const formatNumber = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const YouTubeClicker = () => {
  const [views, setViews] = useState(0)
  const [contentQuality, setContentQuality] = useState(1)
  const [uploadSchedule, setUploadSchedule] = useState(0)
  const [equipment, setEquipment] = useState(1)
  const [marketing, setMarketing] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; isViral: boolean }>
  >([])
  const [uploadStreak, setUploadStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [subscribers, setSubscribers] = useState(0)
  const [contentCreated, setContentCreated] = useState<Record<string, number>>({})
  const [achievements, setAchievements] = useState<string[]>([])
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 for Basic, 2 for Advanced
  const [likeAnimation, setLikeAnimation] = useState(false)
  const MAX_CLICK_EFFECTS = 10

  // Load progress from localStorage and calculate offline progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("youtube-clicker-progress")
    if (savedProgress) {
      try {
        const {
          views: savedViews,
          contentQuality: savedContentQuality,
          uploadSchedule: savedUploadSchedule,
          equipment: savedEquipment,
          marketing: savedMarketing,
          upgrades: savedUpgrades,
          subscribers: savedSubscribers,
          contentCreated: savedContentCreated,
          achievements: savedAchievements,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setContentQuality(savedContentQuality || 1)
        setUploadSchedule(savedUploadSchedule || 0)
        setEquipment(savedEquipment || 1)
        setMarketing(savedMarketing || 1)
        setUpgrades(savedUpgrades || {})
        setSubscribers(savedSubscribers || 0)
        setContentCreated(savedContentCreated || {})
        setAchievements(savedAchievements || [])

        // Calculate offline progress
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedUploadSchedule > 0) {
          // Calculate views earned while offline (in seconds)
          const offlineViews = (timeDiff / 1000) * (savedUploadSchedule * 0.5 * savedEquipment * savedMarketing)
          setViews((savedViews || 0) + offlineViews)

          // Show welcome back message with offline earnings
          if (offlineViews > 0) {
            setOfflineMessage({
              message: `Welcome back, Creator! Your channel earned`,
              amount: offlineViews,
            })
          }
        } else {
          setViews(savedViews || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Save progress to localStorage when relevant states change
  useEffect(() => {
    const progress = {
      views,
      contentQuality,
      uploadSchedule,
      equipment,
      marketing,
      upgrades,
      subscribers,
      contentCreated,
      achievements,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("youtube-clicker-progress", JSON.stringify(progress))
  }, [views, contentQuality, uploadSchedule, equipment, marketing, upgrades, subscribers, contentCreated, achievements])

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = []

      if (views >= 1000 && !achievements.includes("Reach 1,000 views")) {
        newAchievements.push("Reach 1,000 views")
      }
      if (views >= 10000 && !achievements.includes("Reach 10,000 views")) {
        newAchievements.push("Reach 10,000 views")
      }
      if (views >= 100000 && !achievements.includes("Reach 100,000 views")) {
        newAchievements.push("Reach 100,000 views")
      }
      if (subscribers >= 100 && !achievements.includes("100 Subscribers")) {
        newAchievements.push("100 Subscribers")
      }
      if (subscribers >= 1000 && !achievements.includes("1,000 Subscribers")) {
        newAchievements.push("1,000 Subscribers")
      }
      if (uploadStreak >= 5 && !achievements.includes("5-day Upload Streak")) {
        newAchievements.push("5-day Upload Streak")
      }
      if (Object.keys(contentCreated).length >= 5 && !achievements.includes("5 Content Types Created")) {
        newAchievements.push("5 Content Types Created")
      }

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
        // Display the latest achievement
        alert(`Achievement Unlocked: ${newAchievements[newAchievements.length - 1]}`)
      }
    }

    checkAchievements()
  }, [views, subscribers, uploadStreak, contentCreated, achievements])

  // Update subscribers based on views (approximately 1 subscriber per 10 views)
  useEffect(() => {
    setSubscribers(Math.floor(views / 10))
  }, [views])

  const handleClick = useCallback(() => {
    const now = Date.now()

    // Check for streak (clicks within 1 second)
    if (now - lastClickTime < 1000) {
      setUploadStreak((prev) => Math.min(prev + 1, 10))
    } else {
      setUploadStreak(1)
    }
    setLastClickTime(now)

    // Calculate views based on upgrades and streak
    const streakMultiplier = 1 + uploadStreak * 0.1 // 10% bonus per streak level
    const baseValue = contentQuality * equipment * marketing
    const totalValue = baseValue * streakMultiplier

    // 5% chance for viral video (triple views)
    const isViral = Math.random() < 0.05
    const finalValue = isViral ? totalValue * 3 : totalValue

    setViews((prevViews) => prevViews + finalValue)

    // Animate like button on click
    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 500)

    // Select random content type
    const contentType = CONTENT_TYPES[Math.floor(Math.random() * CONTENT_TYPES.length)]

    // Track created content
    setContentCreated((prev) => ({
      ...prev,
      [contentType]: (prev[contentType] || 0) + 1,
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Customize message based on type
    const message = isViral ? "VIRAL VIDEO! 🔥" : uploadStreak > 1 ? `${uploadStreak}x STREAK!` : `New ${contentType}!`

    setClickEffects((prev) => {
      // If we already have too many effects, remove the oldest one
      if (prev.length >= MAX_CLICK_EFFECTS) {
        return [...prev.slice(1), { id, x, y, text: message, isViral }]
      }
      return [...prev, { id, x, y, text: message, isViral }]
    })

    // Remove effect after animation completes
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [contentQuality, equipment, marketing, uploadStreak, lastClickTime])

  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Check if the upgrade is unlocked (only for advanced)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as (typeof ADVANCED_UPGRADES)[0]
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Not unlocked yet
          }
        }
      }

      if (views >= cost) {
        setViews((prevViews) => prevViews - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Apply effects of basic upgrades
        if (!isAdvanced) {
          if (upgradeId === "content_quality") {
            setContentQuality((prev) => prev + upgrade.effect)
          } else if (upgradeId === "upload_schedule") {
            setUploadSchedule((prev) => prev + upgrade.effect)
          } else if (upgradeId === "equipment") {
            setEquipment((prev) => prev + upgrade.effect)
          } else if (upgradeId === "marketing") {
            setMarketing((prev) => prev + upgrade.effect)
          }
        }
        // Apply effects of advanced upgrades
        else {
          if (upgradeId === "studio_setup") {
            setContentQuality((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "viral_video") {
            setUploadSchedule((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "collaboration") {
            setMarketing((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "algorithm_boost") {
            // Increase all parameters
            setContentQuality((prev) => prev * (1 + upgrade.effect * 0.25))
            setEquipment((prev) => prev * (1 + upgrade.effect * 0.25))
            setMarketing((prev) => prev * (1 + upgrade.effect * 0.25))
            setUploadSchedule((prev) => prev * (1 + upgrade.effect * 0.25))
          } else if (upgradeId === "media_company") {
            // Double all values
            setContentQuality((prev) => prev * 2)
            setEquipment((prev) => prev * 2)
            setMarketing((prev) => prev * 2)
            setUploadSchedule((prev) => prev * 2)
          }
        }
      }
    },
    [views, upgrades],
  )

  // Auto-generate views based on upload schedule
  useEffect(() => {
    const interval = setInterval(() => {
      if (uploadSchedule > 0) {
        const autoValue = uploadSchedule * 0.5 * equipment * marketing
        setViews((prevViews) => prevViews + autoValue)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [uploadSchedule, equipment, marketing])

  // Calculate current milestone based on subscribers
  const getCurrentMilestone = () => {
    for (let i = CHANNEL_MILESTONES.length - 1; i >= 0; i--) {
      if (subscribers >= CHANNEL_MILESTONES[i].threshold) {
        return CHANNEL_MILESTONES[i]
      }
    }
    return CHANNEL_MILESTONES[0]
  }

  // Calculate progress to next milestone
  const getNextMilestoneProgress = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = CHANNEL_MILESTONES.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === CHANNEL_MILESTONES.length - 1) {
      return 100 // Already at max milestone
    }

    const currentThreshold = CHANNEL_MILESTONES[currentIndex].threshold
    const nextThreshold = CHANNEL_MILESTONES[currentIndex + 1].threshold
    const progress = ((subscribers - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Get the next milestone
  const getNextMilestone = () => {
    const currentMilestone = getCurrentMilestone()
    const currentIndex = CHANNEL_MILESTONES.findIndex((m) => m.name === currentMilestone.name)

    if (currentIndex === CHANNEL_MILESTONES.length - 1) {
      return null // Already at max milestone
    }

    return CHANNEL_MILESTONES[currentIndex + 1]
  }

  return (
    <div className="min-h-screen flex items-center justify-center youtube-bg py-12 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="play-button-overlay"></div>

      <div className="notification-particles">
        {Array.from({ length: 10 }).map((_, index) => {
          const size = Math.random() * 30 + 10
          const left = Math.random() * 100
          const delay = Math.random() * 15
          const duration = Math.random() * 10 + 10

          return (
            <div
              key={index}
              className="notification-particle"
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

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-red-900/50 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-red-900 to-red-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Youtube className="mr-2 h-6 w-6" /> YouTube Creator
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              Create content, gain views, and grow your channel!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                  color: effect.isViral ? "#ff0000" : "#ffffff",
                  fontSize: effect.isViral ? "1.5rem" : "1.2rem",
                  textShadow: effect.isViral ? "0 0 10px rgba(255, 0, 0, 0.7)" : "0 0 5px rgba(255, 255, 255, 0.7)",
                }}
              >
                {effect.text}
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-red-500" />
                <p className="text-lg font-bold text-white">Views: {formatNumber(views)}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Bell className="h-4 w-4 mr-1 text-red-400" />
                <p className="text-sm text-gray-300">Subs: {formatNumber(subscribers)}</p>
              </div>
            </div>

            {/* Channel milestone with icon */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">{getCurrentMilestone().icon}</span>
                <span className="text-sm text-gray-300">{getCurrentMilestone().name}</span>
              </div>
              {getNextMilestone() && (
                <span className="text-xs text-gray-400">
                  Next: {getNextMilestone()?.icon} {getNextMilestone()?.name}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="video-progress">
              <div className="video-progress-fill" style={{ width: `${getNextMilestoneProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Content Quality</p>
                <p className="text-sm font-medium text-red-300">{contentQuality.toFixed(1)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Upload Schedule</p>
                <p className="text-sm font-medium text-red-300">
                  +{formatNumber(uploadSchedule * 0.5 * equipment * marketing)}/s
                </p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Equipment</p>
                <p className="text-sm font-medium text-red-300">Level {Math.floor(equipment)}</p>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Marketing</p>
                <p className="text-sm font-medium text-red-300">Level {Math.floor(marketing)}</p>
              </div>
            </div>

            {/* Content grid */}
            <div className="content-grid mb-4">
              {Object.entries(contentCreated)
                .slice(0, 8)
                .map(([type, count], index) => (
                  <div key={index} className="content-item">
                    <div className="content-icon">{count > 10 ? "🔥" : "📹"}</div>
                    <div className="text-xs truncate">{type}</div>
                    <div className="content-count">{count}</div>
                  </div>
                ))}
            </div>

            {/* Upload streak indicator */}
            <div className="h-8 mb-4 flex items-center justify-center">
              {uploadStreak > 1 ? (
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-800">
                  <p className="text-sm font-bold text-white flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {uploadStreak}x Upload Streak! +{uploadStreak * 10}%
                  </p>
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="h-5 w-5 mr-2" /> Upload Video
              <span className="ml-2">
                <ThumbsUp className={`h-4 w-4 ${likeAnimation ? "like-animation" : ""}`} />
              </span>
            </Button>

            {/* Milestone section */}
            {achievements.length > 0 && (
              <div className="mt-4 p-2 rounded-lg bg-gray-800/50">
                <p className="text-sm font-medium text-white mb-1">Recent Achievements:</p>
                <div className="text-xs text-gray-300 max-h-20 overflow-y-auto">
                  {achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center py-1">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscriber milestone */}
            {subscribers >= 100 && subscribers < 10000 && (
              <div className="subscriber-milestone mt-2">
                "{subscribers >= 1000 ? "Thank you for 1K subscribers!" : "Road to 1,000 subscribers!"}"
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md bg-gray-900/80 backdrop-blur-lg border border-red-900/50">
          <CardHeader className="bg-gradient-to-r from-red-900 to-red-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Channel Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-red-600 font-bold" : "bg-red-800 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-red-600 font-bold" : "bg-red-800 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your YouTube channel" : "Professional creator upgrades"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Page 1: Basic upgrades
              <>
                {UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => views >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-red-900/30 transition-all ${
                        views >= cost && !isMaxLevel
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
                          views >= cost && !isMaxLevel ? "bg-gradient-to-r from-red-600 to-red-800" : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Page 2: Advanced upgrades
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

                  // Check if upgrade is unlocked
                  const reqId = upgrade.unlockRequirement.id
                  const reqLevel = upgrade.unlockRequirement.level
                  const currentReqLevel = upgrades[reqId] || 0
                  const isUnlocked = currentReqLevel >= reqLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => isUnlocked && views >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-red-900/30 transition-all ${
                        isUnlocked
                          ? views >= cost && !isMaxLevel
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
                          isUnlocked && views >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-red-600 to-red-800"
                            : "bg-gray-700"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatNumber(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>

        {/* Offline Progress Message */}
        {offlineMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
            <div className="relative bg-gradient-to-r from-red-600 via-red-800 to-red-600 p-1 rounded-xl animate-pulse max-w-md w-full">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-red-400">
                  Channel Update!
                </h3>
                <p className="text-center mb-4 text-gray-300">{offlineMessage.message}</p>
                <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-red-400">
                  {formatNumber(offlineMessage.amount)} views
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setOfflineMessage(null)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all"
                  >
                    Collect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeClicker
