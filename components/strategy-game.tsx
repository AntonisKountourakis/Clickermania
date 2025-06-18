"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GameBackButton } from "./game-back-button"
import {
  BuildingIcon,
  Users,
  Coins,
  Shield,
  Sword,
  Crown,
  Flag,
  RotateCcw,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

// Game constants
const STORAGE_KEY = "strategy-game-progress"

// Resource types
type Resource = "gold" | "population" | "military" | "territory"

// Building interface
interface Building {
  id: string
  name: string
  description: string
  cost: Record<Resource, number>
  production: Record<Resource, number>
  count: number
  icon: JSX.Element
  unlockRequirement?: {
    building: string
    count: number
  }
}

// Event interface
interface GameEvent {
  id: string
  title: string
  description: string
  choices: {
    text: string
    effect: Record<Resource, number>
    unlockBuilding?: string
  }[]
  triggered: boolean
  requirementFn: (resources: Record<Resource, number>, buildings: Building[]) => boolean
}

// Achievement interface
interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: JSX.Element
  checkFn: (resources: Record<Resource, number>, buildings: Building[]) => boolean
}

export default function StrategyGame() {
  // Game state
  const [resources, setResources] = useState<Record<Resource, number>>({
    gold: 50,
    population: 10,
    military: 0,
    territory: 1,
  })

  // Buildings
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: "house",
      name: "House",
      description: "Provides shelter for your population",
      cost: { gold: 20, population: 0, military: 0, territory: 0 },
      production: { gold: 0, population: 1, military: 0, territory: 0 },
      count: 0,
      icon: <BuildingIcon className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "farm",
      name: "Farm",
      description: "Produces food to support more population",
      cost: { gold: 40, population: 5, military: 0, territory: 0 },
      production: { gold: 0, population: 3, military: 0, territory: 0 },
      count: 0,
      icon: <Users className="h-5 w-5 text-green-500" />,
    },
    {
      id: "mine",
      name: "Gold Mine",
      description: "Extracts gold from the earth",
      cost: { gold: 100, population: 10, military: 0, territory: 0 },
      production: { gold: 20, population: 0, military: 0, territory: 0 },
      count: 0,
      icon: <Coins className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: "barracks",
      name: "Barracks",
      description: "Trains soldiers for your army",
      cost: { gold: 150, population: 15, military: 0, territory: 0 },
      production: { gold: -5, population: -1, military: 2, territory: 0 },
      count: 0,
      icon: <Sword className="h-5 w-5 text-red-500" />,
      unlockRequirement: {
        building: "house",
        count: 3,
      },
    },
    {
      id: "wall",
      name: "City Wall",
      description: "Protects your city from invasions",
      cost: { gold: 200, population: 0, military: 5, territory: 0 },
      production: { gold: 0, population: 0, military: 0, territory: 0 },
      count: 0,
      icon: <Shield className="h-5 w-5 text-gray-500" />,
      unlockRequirement: {
        building: "barracks",
        count: 1,
      },
    },
    {
      id: "castle",
      name: "Castle",
      description: "Symbol of your power and authority",
      cost: { gold: 1000, population: 50, military: 20, territory: 0 },
      production: { gold: 50, population: 10, military: 5, territory: 0 },
      count: 0,
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      unlockRequirement: {
        building: "wall",
        count: 2,
      },
    },
  ])

  // Events
  const [events, setEvents] = useState<GameEvent[]>([
    {
      id: "nomads",
      title: "Nomadic Tribe",
      description: "A nomadic tribe has arrived at your borders seeking refuge.",
      choices: [
        {
          text: "Welcome them",
          effect: { gold: -10, population: 15, military: 0, territory: 0 },
        },
        {
          text: "Turn them away",
          effect: { gold: 0, population: 0, military: 0, territory: 0 },
        },
      ],
      triggered: false,
      requirementFn: (resources) => resources.population >= 20,
    },
    {
      id: "merchant",
      title: "Traveling Merchant",
      description: "A merchant offers to trade with your settlement.",
      choices: [
        {
          text: "Buy goods (spend gold)",
          effect: { gold: -50, population: 5, military: 0, territory: 0 },
        },
        {
          text: "Sell goods (gain gold)",
          effect: { gold: 100, population: -5, military: 0, territory: 0 },
        },
      ],
      triggered: false,
      requirementFn: (resources) => resources.gold >= 100,
    },
    {
      id: "expedition",
      title: "Exploration Opportunity",
      description: "Your scouts have found unexplored lands nearby.",
      choices: [
        {
          text: "Send an expedition",
          effect: { gold: -100, population: -10, military: -5, territory: 1 },
        },
        {
          text: "Stay within current borders",
          effect: { gold: 0, population: 0, military: 0, territory: 0 },
        },
      ],
      triggered: false,
      requirementFn: (resources, buildings) => {
        const hasBarracks = buildings.find((b) => b.id === "barracks" && b.count > 0)
        return hasBarracks !== undefined && resources.military >= 10
      },
    },
    {
      id: "invasion",
      title: "Enemy Invasion",
      description: "A rival settlement is attacking your borders!",
      choices: [
        {
          text: "Fight back",
          effect: { gold: -50, population: -10, military: -15, territory: 0 },
        },
        {
          text: "Surrender territory",
          effect: { gold: -200, population: -5, military: 0, territory: -1 },
        },
      ],
      triggered: false,
      requirementFn: (resources, buildings) => {
        const hasBarracks = buildings.find((b) => b.id === "barracks" && b.count > 0)
        return hasBarracks !== undefined && resources.territory >= 2
      },
    },
    {
      id: "alliance",
      title: "Alliance Proposal",
      description: "A neighboring kingdom offers an alliance.",
      choices: [
        {
          text: "Accept alliance",
          effect: { gold: 0, population: 0, military: 10, territory: 0 },
          unlockBuilding: "castle",
        },
        {
          text: "Reject alliance",
          effect: { gold: 0, population: 0, military: 0, territory: 0 },
        },
      ],
      triggered: false,
      requirementFn: (resources, buildings) => {
        const hasWall = buildings.find((b) => b.id === "wall" && b.count > 0)
        return hasWall !== undefined && resources.military >= 20
      },
    },
  ])

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "village",
      name: "Village Founder",
      description: "Reach 50 population",
      unlocked: false,
      icon: <Users className="h-5 w-5" />,
      checkFn: (resources) => resources.population >= 50,
    },
    {
      id: "wealthy",
      name: "Wealthy Settlement",
      description: "Accumulate 1000 gold",
      unlocked: false,
      icon: <Coins className="h-5 w-5" />,
      checkFn: (resources) => resources.gold >= 1000,
    },
    {
      id: "military",
      name: "Military Power",
      description: "Train 50 military units",
      unlocked: false,
      icon: <Sword className="h-5 w-5" />,
      checkFn: (resources) => resources.military >= 50,
    },
    {
      id: "empire",
      name: "Expanding Empire",
      description: "Control 5 territories",
      unlocked: false,
      icon: <Flag className="h-5 w-5" />,
      checkFn: (resources) => resources.territory >= 5,
    },
    {
      id: "kingdom",
      name: "Kingdom Established",
      description: "Build a castle",
      unlocked: false,
      icon: <Crown className="h-5 w-5" />,
      checkFn: (_, buildings) => buildings.find((b) => b.id === "castle")?.count ?? 0 > 0,
    },
  ])

  // UI state
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [gameSpeed, setGameSpeed] = useState<number>(1) // 1 = normal, 2 = fast, 0.5 = slow
  const [expandedSection, setExpandedSection] = useState<string | null>("buildings")

  // Game loop
  useEffect(() => {
    // Load saved game
    const savedGame = localStorage.getItem(STORAGE_KEY)
    if (savedGame) {
      try {
        const { resources: savedResources, buildings: savedBuildings } = JSON.parse(savedGame)
        setResources(savedResources)

        // Merge saved buildings with current buildings to ensure new buildings are included
        const mergedBuildings = buildings.map((building) => {
          const savedBuilding = savedBuildings.find((b) => b.id === building.id)
          return savedBuilding ? { ...building, count: savedBuilding.count } : building
        })

        setBuildings(mergedBuildings)
      } catch (error) {
        console.error("Error loading saved game:", error)
      }
    }

    // Set up game loop
    const gameLoop = setInterval(() => {
      // Update resources based on production
      setResources((prev) => {
        const newResources = { ...prev }

        // Calculate production from buildings
        buildings.forEach((building) => {
          if (building.count > 0) {
            Object.keys(building.production).forEach((resource) => {
              const resourceKey = resource as Resource
              newResources[resourceKey] += building.production[resourceKey] * building.count
            })
          }
        })

        // Ensure resources don't go below 0 (except gold which can go negative)
        Object.keys(newResources).forEach((resource) => {
          const resourceKey = resource as Resource
          if (resourceKey !== "gold") {
            newResources[resourceKey] = Math.max(0, newResources[resourceKey])
          }
        })

        return newResources
      })

      // Check for events
      const availableEvents = events.filter((event) => !event.triggered && event.requirementFn(resources, buildings))

      if (availableEvents.length > 0 && !activeEvent) {
        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)]
        setActiveEvent(randomEvent)

        // Mark event as triggered
        setEvents((prev) => prev.map((event) => (event.id === randomEvent.id ? { ...event, triggered: true } : event)))
      }

      // Check achievements
      setAchievements((prev) =>
        prev.map((achievement) => {
          if (!achievement.unlocked && achievement.checkFn(resources, buildings)) {
            // Show notification
            setNotification(`Achievement Unlocked: ${achievement.name}`)
            setTimeout(() => setNotification(null), 3000)

            return { ...achievement, unlocked: true }
          }
          return achievement
        }),
      )
    }, 1000 / gameSpeed)

    return () => clearInterval(gameLoop)
  }, [resources, buildings, events, activeEvent, gameSpeed])

  // Save game
  useEffect(() => {
    if (resources.gold !== 50 || resources.population !== 10) {
      // Only save if game has started
      // Create a clean version of buildings without React elements
      const buildingsToSave = buildings.map((building) => ({
        id: building.id,
        count: building.count,
      }))

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          resources,
          buildings: buildingsToSave,
        }),
      )
    }
  }, [resources, buildings])

  // Handle building purchase
  const handleBuildingPurchase = (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return

    // Check if building is unlocked
    if (building.unlockRequirement) {
      const requiredBuilding = buildings.find((b) => b.id === building.unlockRequirement?.building)
      if (!requiredBuilding || requiredBuilding.count < building.unlockRequirement.count) {
        return
      }
    }

    // Check if player has enough resources
    const canAfford = Object.keys(building.cost).every((resource) => {
      const resourceKey = resource as Resource
      return resources[resourceKey] >= building.cost[resourceKey]
    })

    if (canAfford) {
      // Deduct resources
      setResources((prev) => {
        const newResources = { ...prev }
        Object.keys(building.cost).forEach((resource) => {
          const resourceKey = resource as Resource
          newResources[resourceKey] -= building.cost[resourceKey]
        })
        return newResources
      })

      // Add building
      setBuildings((prev) => prev.map((b) => (b.id === buildingId ? { ...b, count: b.count + 1 } : b)))
    }
  }

  // Handle event choice
  const handleEventChoice = (choiceIndex: number) => {
    if (!activeEvent) return

    const choice = activeEvent.choices[choiceIndex]

    // Apply effects
    setResources((prev) => {
      const newResources = { ...prev }
      Object.keys(choice.effect).forEach((resource) => {
        const resourceKey = resource as Resource
        newResources[resourceKey] += choice.effect[resourceKey]

        // Ensure resources don't go below 0 (except gold which can go negative)
        if (resourceKey !== "gold") {
          newResources[resourceKey] = Math.max(0, newResources[resourceKey])
        }
      })
      return newResources
    })

    // Unlock building if specified
    if (choice.unlockBuilding) {
      setBuildings((prev) =>
        prev.map((building) =>
          building.id === choice.unlockBuilding ? { ...building, unlockRequirement: undefined } : building,
        ),
      )
    }

    // Clear active event
    setActiveEvent(null)
  }

  // Reset game
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setResources({
        gold: 50,
        population: 10,
        military: 0,
        territory: 1,
      })

      setBuildings((prev) => prev.map((building) => ({ ...building, count: 0 })))

      setEvents((prev) => prev.map((event) => ({ ...event, triggered: false })))

      setAchievements((prev) => prev.map((achievement) => ({ ...achievement, unlocked: false })))

      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return Math.floor(num).toLocaleString()
  }

  // Get resource color
  const getResourceColor = (resource: Resource) => {
    switch (resource) {
      case "gold":
        return "text-yellow-500"
      case "population":
        return "text-green-500"
      case "military":
        return "text-red-500"
      case "territory":
        return "text-blue-500"
      default:
        return "text-white"
    }
  }

  // Check if building is unlocked
  const isBuildingUnlocked = (building: Building) => {
    if (!building.unlockRequirement) return true

    const requiredBuilding = buildings.find((b) => b.id === building.unlockRequirement?.building)
    return requiredBuilding && requiredBuilding.count >= building.unlockRequirement.count
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <GameBackButton />
          <h1 className="text-3xl font-bold text-center">Kingdom Builder</h1>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Resources */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Gold</span>
                </div>
                <div className="text-xl font-bold text-yellow-500">{formatNumber(resources.gold)}</div>
              </div>

              <div className="bg-gray-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Population</span>
                </div>
                <div className="text-xl font-bold text-green-500">{formatNumber(resources.population)}</div>
              </div>

              <div className="bg-gray-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sword className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">Military</span>
                </div>
                <div className="text-xl font-bold text-red-500">{formatNumber(resources.military)}</div>
              </div>

              <div className="bg-gray-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Territory</span>
                </div>
                <div className="text-xl font-bold text-blue-500">{formatNumber(resources.territory)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buildings Section */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleSection("buildings")}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Buildings</CardTitle>
              {expandedSection === "buildings" ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>

          {expandedSection === "buildings" && (
            <CardContent>
              <div className="space-y-3">
                {buildings.map((building) => {
                  const isUnlocked = isBuildingUnlocked(building)

                  // Check if player can afford
                  const canAfford = Object.keys(building.cost).every((resource) => {
                    const resourceKey = resource as Resource
                    return resources[resourceKey] >= building.cost[resourceKey]
                  })

                  return (
                    <div
                      key={building.id}
                      className={`p-3 rounded-lg border ${
                        isUnlocked
                          ? canAfford
                            ? "bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600"
                            : "bg-gray-700 border-gray-600 opacity-70"
                          : "bg-gray-800 border-gray-700 opacity-50"
                      }`}
                      onClick={() => isUnlocked && canAfford && handleBuildingPurchase(building.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            {building.icon}
                            <span className="font-semibold">
                              {building.name} {building.count > 0 && `(${building.count})`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{building.description}</p>

                          {!isUnlocked && building.unlockRequirement && (
                            <p className="text-sm text-yellow-500 mt-1">
                              Requires {buildings.find((b) => b.id === building.unlockRequirement?.building)?.name} x
                              {building.unlockRequirement.count}
                            </p>
                          )}

                          {building.count > 0 && (
                            <div className="mt-1 text-sm">
                              <span className="text-gray-400">Production:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.keys(building.production).map((resource) => {
                                  const resourceKey = resource as Resource
                                  const value = building.production[resourceKey] * building.count
                                  if (value === 0) return null

                                  return (
                                    <span
                                      key={resource}
                                      className={`${getResourceColor(resourceKey)} ${
                                        value < 0 ? "text-opacity-80" : ""
                                      }`}
                                    >
                                      {value > 0 ? "+" : ""}
                                      {value} {resourceKey}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            {Object.keys(building.cost).map((resource) => {
                              const resourceKey = resource as Resource
                              const cost = building.cost[resourceKey]
                              if (cost === 0) return null

                              const hasEnough = resources[resourceKey] >= cost

                              return (
                                <span
                                  key={resource}
                                  className={`text-sm ${hasEnough ? getResourceColor(resourceKey) : "text-red-400"}`}
                                >
                                  {formatNumber(cost)} {resourceKey}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Achievements Section */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleSection("achievements")}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Achievements</CardTitle>
              {expandedSection === "achievements" ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>

          {expandedSection === "achievements" && (
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked ? "bg-gray-700 border-gray-600" : "bg-gray-800 border-gray-700 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-yellow-500/20" : "bg-gray-700"}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {achievement.name}
                          {achievement.unlocked && <span className="ml-2 text-xs text-yellow-500">✓ Unlocked</span>}
                        </div>
                        <p className="text-sm text-gray-300">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Game Speed Controls */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Game Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={gameSpeed === 0.5 ? "default" : "outline"}
                onClick={() => setGameSpeed(0.5)}
                className={gameSpeed === 0.5 ? "bg-blue-600" : ""}
              >
                Slow
              </Button>
              <Button
                variant={gameSpeed === 1 ? "default" : "outline"}
                onClick={() => setGameSpeed(1)}
                className={gameSpeed === 1 ? "bg-blue-600" : ""}
              >
                Normal
              </Button>
              <Button
                variant={gameSpeed === 2 ? "default" : "outline"}
                onClick={() => setGameSpeed(2)}
                className={gameSpeed === 2 ? "bg-blue-600" : ""}
              >
                Fast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Dialog */}
        {activeEvent && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>{activeEvent.title}</CardTitle>
                <CardDescription className="text-gray-300">{activeEvent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeEvent.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 text-left"
                      onClick={() => handleEventChoice(index)}
                    >
                      <div>
                        <div>{choice.text}</div>
                        <div className="text-sm mt-1 flex flex-wrap gap-2">
                          {Object.keys(choice.effect).map((resource) => {
                            const resourceKey = resource as Resource
                            const value = choice.effect[resourceKey]
                            if (value === 0) return null

                            return (
                              <span
                                key={resource}
                                className={`${getResourceColor(resourceKey)} ${value < 0 ? "text-opacity-80" : ""}`}
                              >
                                {value > 0 ? "+" : ""}
                                {value} {resourceKey}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    </div>
  )
}
