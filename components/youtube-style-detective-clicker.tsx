"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  FileText,
  Briefcase,
  Users,
  Building,
  Award,
  Clock,
  Fingerprint,
  Camera,
  Map,
  Brain,
  Database,
  Shield,
} from "lucide-react"
import { formatNumber } from "@/utils/format-number"

type YouTubeStyleDetectiveClickerProps = {}

export function YouTubeStyleDetectiveClicker({}: YouTubeStyleDetectiveClickerProps) {
  const [clues, setClues] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-clues")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  const [cps, setCps] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-cps")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  const [upgrades, setUpgrades] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-upgrades")
      return saved ? JSON.parse(saved) : initialUpgrades
    }
    return initialUpgrades
  })

  const [advancedUpgrades, setAdvancedUpgrades] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-advanced-upgrades")
      return saved ? JSON.parse(saved) : initialAdvancedUpgrades
    }
    return initialAdvancedUpgrades
  })

  const [milestone, setMilestone] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-milestone")
      return saved ? Number.parseInt(saved) : 0
    }
    return 0
  })

  const [clickValue, setClickValue] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("detective-clicker-click-value")
      return saved ? Number.parseFloat(saved) : 1
    }
    return 1
  })

  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementText, setAchievementText] = useState("")
  const clickAreaRef = useRef<HTMLDivElement>(null)

  const milestones = [
    { name: "Amateur Detective", threshold: 0, multiplier: 1, icon: "🔍" },
    { name: "Private Eye", threshold: 500, multiplier: 1.5, icon: "🕵️" },
    { name: "Police Consultant", threshold: 5000, multiplier: 2, icon: "👮" },
    { name: "Lead Investigator", threshold: 50000, multiplier: 3, icon: "📋" },
    { name: "Master Detective", threshold: 500000, multiplier: 4, icon: "🧠" },
    { name: "Legendary Sleuth", threshold: 5000000, multiplier: 5, icon: "🏆" },
    { name: "Sherlock Holmes Level", threshold: 50000000, multiplier: 10, icon: "🎩" },
  ]

  const clickMessages = [
    "Clue found!",
    "Evidence!",
    "Aha!",
    "Interesting...",
    "Suspicious!",
    "Case lead!",
    "Mystery deepens!",
    "Elementary!",
    "Breakthrough!",
    "Witness located!",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setClues((prev) => prev + cps / 10)
    }, 100)

    return () => clearInterval(interval)
  }, [cps])

  useEffect(() => {
    localStorage.setItem("detective-clicker-clues", clues.toString())
    localStorage.setItem("detective-clicker-cps", cps.toString())
    localStorage.setItem("detective-clicker-upgrades", JSON.stringify(upgrades))
    localStorage.setItem("detective-clicker-advanced-upgrades", JSON.stringify(advancedUpgrades))
    localStorage.setItem("detective-clicker-milestone", milestone.toString())
    localStorage.setItem("detective-clicker-click-value", clickValue.toString())

    // Check for milestone achievements
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (clues >= milestones[i].threshold && milestone < i) {
        setMilestone(i)
        setAchievementText(`Rank Up: ${milestones[i].name}!`)
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 3000)
        break
      }
    }
  }, [clues, cps, upgrades, advancedUpgrades, milestone, clickValue, milestones])

  const handleClick = () => {
    setClues((prev) => prev + clickValue)

    if (clickAreaRef.current) {
      const clickEffect = document.createElement("div")
      clickEffect.className = "youtube-click-effect"
      clickEffect.textContent = clickMessages[Math.floor(Math.random() * clickMessages.length)]

      const rect = clickAreaRef.current.getBoundingClientRect()
      const x = Math.random() * (rect.width - 100)
      const y = Math.random() * (rect.height - 40)

      clickEffect.style.left = `${x}px`
      clickEffect.style.top = `${y}px`

      clickAreaRef.current.appendChild(clickEffect)

      setTimeout(() => {
        clickEffect.remove()
      }, 1500)
    }
  }

  const buyUpgrade = (index: number) => {
    const upgrade = upgrades[index]

    if (clues >= upgrade.cost) {
      setClues((prev) => prev - upgrade.cost)

      const newUpgrades = [...upgrades]
      newUpgrades[index] = {
        ...upgrade,
        owned: upgrade.owned + 1,
        cost: Math.floor(upgrade.cost * 1.15),
      }

      setUpgrades(newUpgrades)

      const newCps = calculateCps(newUpgrades, advancedUpgrades)
      setCps(newCps)

      // Update click value based on certain upgrades
      if (upgrade.id === "magnifying-glass") {
        setClickValue((prev) => prev * 1.1)
      }
    }
  }

  const buyAdvancedUpgrade = (index: number) => {
    const upgrade = advancedUpgrades[index]

    if (clues >= upgrade.cost && !upgrade.owned && meetsRequirements(upgrade.requirements)) {
      setClues((prev) => prev - upgrade.cost)

      const newAdvancedUpgrades = [...advancedUpgrades]
      newAdvancedUpgrades[index] = {
        ...upgrade,
        owned: true,
      }

      setAdvancedUpgrades(newAdvancedUpgrades)

      const newCps = calculateCps(upgrades, newAdvancedUpgrades)
      setCps(newCps)

      // Special effects for advanced upgrades
      if (upgrade.id === "deduction-mastery") {
        setClickValue((prev) => prev * 2)
      }

      setAchievementText(`Advanced Upgrade: ${upgrade.name}!`)
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }
  }

  const meetsRequirements = (requirements: { upgradeId: string; count: number }[]) => {
    return requirements.every((req) => {
      const upgrade = upgrades.find((u) => u.id === req.upgradeId)
      return upgrade && upgrade.owned >= req.count
    })
  }

  const calculateCps = (currentUpgrades: any[], currentAdvancedUpgrades: any[]) => {
    let total = 0

    // Calculate base CPS from regular upgrades
    currentUpgrades.forEach((upgrade) => {
      total += upgrade.cps * upgrade.owned
    })

    // Apply multipliers from advanced upgrades
    currentAdvancedUpgrades.forEach((upgrade) => {
      if (upgrade.owned && upgrade.cpsMultiplier) {
        total *= upgrade.cpsMultiplier
      }
    })

    // Apply milestone multiplier
    total *= milestones[milestone].multiplier

    return total
  }

  const currentMilestone = milestones[milestone]
  const nextMilestone = milestone < milestones.length - 1 ? milestones[milestone + 1] : null
  const milestoneProgress = nextMilestone ? Math.min(100, (clues / nextMilestone.threshold) * 100) : 100

  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5 text-blue-400" }

    switch (iconName) {
      case "Search":
        return <Search {...iconProps} />
      case "FileText":
        return <FileText {...iconProps} />
      case "Briefcase":
        return <Briefcase {...iconProps} />
      case "Users":
        return <Users {...iconProps} />
      case "Building":
        return <Building {...iconProps} />
      case "Award":
        return <Award {...iconProps} />
      case "Fingerprint":
        return <Fingerprint {...iconProps} />
      case "Camera":
        return <Camera {...iconProps} />
      case "Clock":
        return <Clock {...iconProps} />
      case "Map":
        return <Map {...iconProps} />
      case "Brain":
        return <Brain {...iconProps} />
      case "Database":
        return <Database {...iconProps} />
      case "Shield":
        return <Shield {...iconProps} />
      default:
        return <div className="h-5 w-5 bg-blue-400 rounded-full"></div>
    }
  }

  return (
    <div className="youtube-clicker-container detective-clicker-container min-h-screen">
      <header className="youtube-clicker-header detective-clicker-header p-4 text-center">
        <h1 className="youtube-clicker-title detective-clicker-title text-3xl font-bold">Mystery Detective Agency</h1>
        <p className="youtube-clicker-subtitle detective-clicker-subtitle">
          Solve cases, gather clues, and become the greatest detective
        </p>
      </header>

      <div className="youtube-game-area detective-game-area p-4 md:p-6">
        <div className="youtube-stats-section">
          <div className="youtube-milestone-section mb-4">
            <div className="youtube-milestone-title text-lg font-semibold mb-2">
              Current Rank: {currentMilestone.name}
            </div>

            {nextMilestone && (
              <>
                <div className="youtube-milestone-progress-container bg-slate-700 h-4 rounded-full overflow-hidden">
                  <div
                    className="youtube-milestone-progress-bar bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full transition-all duration-300"
                    style={{ width: `${milestoneProgress}%` }}
                  ></div>
                </div>
                <div className="youtube-milestone-labels flex justify-between text-sm mt-1">
                  <span>{formatNumber(currentMilestone.threshold)}</span>
                  <span>
                    Next: {nextMilestone.name} ({formatNumber(nextMilestone.threshold)})
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="youtube-main-stats flex items-center justify-center mb-6">
            <div className="youtube-stat-icon mr-3">
              <Search className="h-8 w-8 text-blue-400" />
            </div>
            <div className="youtube-stat-value text-3xl font-bold">{formatNumber(clues)}</div>
            <div className="youtube-stat-name ml-2 text-xl">Clues</div>
          </div>

          <div className="youtube-cps-display text-center mb-6">
            <div className="text-sm opacity-80">{formatNumber(cps)} clues per second</div>
          </div>

          <div
            ref={clickAreaRef}
            className="youtube-click-area detective-click-area relative bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer mb-6 overflow-hidden border border-blue-900 shadow-lg"
            onClick={handleClick}
          >
            <div className="detective-magnifier mb-4 transition-transform hover:scale-110 active:scale-95">
              <div className="detective-magnifier-glass"></div>
              <div className="detective-magnifier-handle"></div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">Click to investigate</div>
              <div className="text-sm opacity-80">{formatNumber(clickValue)} clues per click</div>
            </div>
          </div>
        </div>

        <div className="youtube-upgrades-section">
          <div className="youtube-upgrades-container">
            <h2 className="youtube-section-title text-xl font-bold mb-4">Detective Tools</h2>

            <div className="youtube-upgrades-list space-y-3">
              {upgrades.map((upgrade, index) => (
                <div
                  key={upgrade.id}
                  className={`youtube-upgrade-item detective-upgrade-item flex items-center justify-between p-3 rounded-lg border border-blue-900 transition-all ${clues >= upgrade.cost ? "bg-slate-800 cursor-pointer hover:bg-slate-700" : "bg-slate-900 opacity-70 cursor-not-allowed"}`}
                  onClick={() => buyUpgrade(index)}
                >
                  <div className="youtube-upgrade-info flex items-center">
                    <div className="youtube-upgrade-icon mr-3">{renderIcon(upgrade.iconName)}</div>
                    <div>
                      <div className="youtube-upgrade-name font-semibold">{upgrade.name}</div>
                      <div className="youtube-upgrade-description text-xs opacity-80">{upgrade.description}</div>
                      <div className="youtube-upgrade-owned text-xs mt-1">Owned: {upgrade.owned}</div>
                    </div>
                  </div>
                  <div className="youtube-upgrade-cost px-3 py-1 rounded-full bg-slate-700 text-sm">
                    {formatNumber(upgrade.cost)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="youtube-advanced-upgrades-container mt-6">
            <h2 className="youtube-section-title text-xl font-bold mb-4">Advanced Techniques</h2>

            <div className="youtube-advanced-upgrades-list space-y-3">
              {advancedUpgrades.map((upgrade, index) => {
                const canBuy = clues >= upgrade.cost && !upgrade.owned && meetsRequirements(upgrade.requirements)
                const requirementsMet = meetsRequirements(upgrade.requirements)

                return (
                  <div
                    key={upgrade.id}
                    className={`youtube-advanced-upgrade-item detective-upgrade-item flex items-center justify-between p-3 rounded-lg border border-blue-900 transition-all ${
                      upgrade.owned
                        ? "bg-blue-900 opacity-70 cursor-not-allowed"
                        : canBuy
                          ? "bg-slate-800 cursor-pointer hover:bg-slate-700"
                          : "bg-slate-900 opacity-70 cursor-not-allowed"
                    }`}
                    onClick={() => buyAdvancedUpgrade(index)}
                  >
                    <div className="youtube-upgrade-info flex items-center">
                      <div className="youtube-upgrade-icon mr-3">{renderIcon(upgrade.iconName)}</div>
                      <div>
                        <div className="youtube-upgrade-name font-semibold">{upgrade.name}</div>
                        <div className="youtube-upgrade-description text-xs opacity-80">{upgrade.description}</div>
                        {!requirementsMet && !upgrade.owned && (
                          <div className="youtube-upgrade-requirements text-xs mt-1 text-red-400">
                            Requirements not met
                          </div>
                        )}
                        {upgrade.owned && (
                          <div className="youtube-upgrade-owned text-xs mt-1 text-green-400">Purchased</div>
                        )}
                      </div>
                    </div>
                    <div className="youtube-upgrade-cost px-3 py-1 rounded-full bg-slate-700 text-sm">
                      {formatNumber(upgrade.cost)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showAchievement && (
        <div className="youtube-achievement detective-achievement fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {achievementText}
        </div>
      )}
    </div>
  )
}

const initialUpgrades = [
  {
    id: "magnifying-glass",
    name: "Magnifying Glass",
    description: "A basic tool for any detective. Increases click value by 10%.",
    iconName: "Search",
    cost: 15,
    cps: 0.1,
    owned: 0,
  },
  {
    id: "notebook",
    name: "Detective Notebook",
    description: "Record your findings and organize clues.",
    iconName: "FileText",
    cost: 100,
    cps: 1,
    owned: 0,
  },
  {
    id: "briefcase",
    name: "Investigation Kit",
    description: "Essential tools for gathering evidence.",
    iconName: "Briefcase",
    cost: 500,
    cps: 5,
    owned: 0,
  },
  {
    id: "assistant",
    name: "Assistant Detective",
    description: "Helps with basic investigation tasks.",
    iconName: "Users",
    cost: 3000,
    cps: 20,
    owned: 0,
  },
  {
    id: "office",
    name: "Detective Office",
    description: "A proper place to work on your cases.",
    iconName: "Building",
    cost: 10000,
    cps: 80,
    owned: 0,
  },
  {
    id: "license",
    name: "Private Investigator License",
    description: "Official credentials to take on bigger cases.",
    iconName: "Award",
    cost: 50000,
    cps: 400,
    owned: 0,
  },
  {
    id: "forensics",
    name: "Forensic Equipment",
    description: "Advanced tools for analyzing evidence.",
    iconName: "Fingerprint",
    cost: 200000,
    cps: 2000,
    owned: 0,
  },
  {
    id: "surveillance",
    name: "Surveillance System",
    description: "Monitor suspects and gather intelligence.",
    iconName: "Camera",
    cost: 1000000,
    cps: 10000,
    owned: 0,
  },
]

const initialAdvancedUpgrades = [
  {
    id: "cold-case-specialist",
    name: "Cold Case Specialist",
    description: "Doubles the effectiveness of your Notebook.",
    iconName: "Clock",
    cost: 5000,
    cpsMultiplier: 1.2,
    requirements: [{ upgradeId: "notebook", count: 10 }],
    owned: false,
  },
  {
    id: "forensic-expert",
    name: "Forensic Expert",
    description: "Triples the effectiveness of your Forensic Equipment.",
    iconName: "Fingerprint",
    cost: 500000,
    cpsMultiplier: 1.5,
    requirements: [{ upgradeId: "forensics", count: 5 }],
    owned: false,
  },
  {
    id: "investigation-network",
    name: "Investigation Network",
    description: "Your assistants share information, increasing efficiency by 50%.",
    iconName: "Users",
    cost: 50000,
    cpsMultiplier: 1.3,
    requirements: [{ upgradeId: "assistant", count: 15 }],
    owned: false,
  },
  {
    id: "crime-map",
    name: "Crime Pattern Analysis",
    description: "Identify patterns in criminal behavior, increasing all CPS by 40%.",
    iconName: "Map",
    cost: 2000000,
    cpsMultiplier: 1.4,
    requirements: [
      { upgradeId: "office", count: 10 },
      { upgradeId: "surveillance", count: 5 },
    ],
    owned: false,
  },
  {
    id: "deduction-mastery",
    name: "Deduction Mastery",
    description: "Your legendary deductive skills double your click value.",
    iconName: "Brain",
    cost: 10000000,
    cpsMultiplier: 1.2,
    requirements: [
      { upgradeId: "magnifying-glass", count: 50 },
      { upgradeId: "notebook", count: 50 },
    ],
    owned: false,
  },
  {
    id: "criminal-database",
    name: "Criminal Database",
    description: "Access to comprehensive criminal records increases all CPS by 75%.",
    iconName: "Database",
    cost: 50000000,
    cpsMultiplier: 1.75,
    requirements: [
      { upgradeId: "license", count: 25 },
      { upgradeId: "forensics", count: 25 },
    ],
    owned: false,
  },
  {
    id: "international-agency",
    name: "International Detective Agency",
    description: "Your reputation spans the globe, doubling all CPS.",
    iconName: "Shield",
    cost: 500000000,
    cpsMultiplier: 2,
    requirements: [
      { upgradeId: "office", count: 50 },
      { upgradeId: "surveillance", count: 50 },
    ],
    owned: false,
  },
]
