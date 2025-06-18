"use client"

import {
  Utensils,
  Coffee,
  ChefHat,
  Users,
  DollarSign,
  Award,
  TrendingUp,
  Store,
  ShoppingBag,
  Truck,
  Globe,
} from "lucide-react"
import YouTubeStyleClickerTemplate from "./youtube-style-clicker-template"

export function YouTubeStyleRestaurantClicker() {
  // Define basic upgrades
  const basicUpgrades = [
    {
      id: "better_ingredients",
      name: "Better Ingredients",
      description: "Higher quality ingredients attract more customers",
      basePrice: 10,
      priceMultiplier: 1.5,
      effect: 1,
      maxLevel: 20,
      count: 0,
      icon: <ShoppingBag className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "kitchen_tools",
      name: "Kitchen Tools",
      description: "Better tools make cooking faster and more efficient",
      basePrice: 50,
      priceMultiplier: 1.6,
      effect: 2,
      maxLevel: 15,
      count: 0,
      icon: <Utensils className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "barista_training",
      name: "Barista Training",
      description: "Skilled baristas make better coffee, increasing tips",
      basePrice: 200,
      priceMultiplier: 1.7,
      effect: 5,
      maxLevel: 10,
      count: 0,
      icon: <Coffee className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "chef_hire",
      name: "Hire Chef",
      description: "Professional chefs create signature dishes",
      basePrice: 500,
      priceMultiplier: 1.8,
      effect: 10,
      maxLevel: 8,
      count: 0,
      icon: <ChefHat className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "waitstaff",
      name: "Waitstaff",
      description: "More servers means faster service and more customers",
      basePrice: 1000,
      priceMultiplier: 1.9,
      effect: 15,
      maxLevel: 10,
      count: 0,
      icon: <Users className="h-4 w-4 text-purple-400" />,
    },
  ]

  // Define advanced upgrades
  const advancedUpgrades = [
    {
      id: "michelin_star",
      name: "Michelin Star",
      description: "Prestigious award doubles your click value",
      basePrice: 5000,
      priceMultiplier: 2.5,
      effect: 0.5, // 50% increase
      maxLevel: 3,
      count: 0,
      icon: <Award className="h-4 w-4 text-yellow-500" />,
      unlockRequirement: {
        id: "chef_hire",
        level: 5,
      },
    },
    {
      id: "franchise_expansion",
      name: "Franchise Expansion",
      description: "Open new locations to multiply passive income",
      basePrice: 10000,
      priceMultiplier: 3,
      effect: 0.75, // 75% increase
      maxLevel: 5,
      count: 0,
      icon: <Store className="h-4 w-4 text-yellow-500" />,
      unlockRequirement: {
        id: "waitstaff",
        level: 7,
      },
    },
    {
      id: "celebrity_endorsement",
      name: "Celebrity Endorsement",
      description: "Famous people promote your restaurant",
      basePrice: 25000,
      priceMultiplier: 3.5,
      effect: 1, // 100% increase
      maxLevel: 2,
      count: 0,
      icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
      unlockRequirement: {
        id: "michelin_star",
        level: 1,
      },
    },
    {
      id: "food_delivery",
      name: "Food Delivery Service",
      description: "Expand your reach with home delivery",
      basePrice: 50000,
      priceMultiplier: 4,
      effect: 1.5, // 150% increase
      maxLevel: 3,
      count: 0,
      icon: <Truck className="h-4 w-4 text-yellow-500" />,
      unlockRequirement: {
        id: "franchise_expansion",
        level: 2,
      },
    },
    {
      id: "global_chain",
      name: "Global Restaurant Chain",
      description: "Expand your empire worldwide",
      basePrice: 100000,
      priceMultiplier: 5,
      effect: 2, // 200% increase
      maxLevel: 1,
      count: 0,
      icon: <Globe className="h-4 w-4 text-yellow-500" />,
      unlockRequirement: {
        id: "food_delivery",
        level: 2,
      },
    },
  ]

  // Define milestones
  const milestones = [
    {
      name: "Food Cart",
      threshold: 0,
      icon: "🛒",
    },
    {
      name: "Small Café",
      threshold: 1000,
      icon: "☕",
    },
    {
      name: "Family Diner",
      threshold: 10000,
      icon: "🍽️",
    },
    {
      name: "Upscale Restaurant",
      threshold: 50000,
      icon: "🍷",
    },
    {
      name: "Local Chain",
      threshold: 200000,
      icon: "🏪",
    },
    {
      name: "Regional Franchise",
      threshold: 500000,
      icon: "🏢",
    },
    {
      name: "National Brand",
      threshold: 1000000,
      icon: "🏙️",
    },
    {
      name: "Global Empire",
      threshold: 5000000,
      icon: "🌎",
    },
    {
      name: "Culinary Legend",
      threshold: 10000000,
      icon: "👑",
    },
  ]

  // Define click messages
  const clickMessages = [
    "Delicious!",
    "Tasty!",
    "Yum!",
    "Five stars!",
    "Compliments to the chef!",
    "Bon appétit!",
    "Order up!",
    "Fresh and hot!",
    "Chef's special!",
    "Gourmet quality!",
    "Mouth-watering!",
    "Perfect seasoning!",
    "Great service!",
    "Coming right up!",
  ]

  return (
    <YouTubeStyleClickerTemplate
      gameId="restaurant-clicker"
      gameTitle="Gourmet Restaurant Tycoon"
      gameDescription="Cook delicious meals and build your culinary empire"
      mainStatName="Money"
      mainStatIcon={<DollarSign className="h-5 w-5 mr-1 text-green-500" />}
      backgroundClassName="bg-gradient-to-b from-purple-50 to-purple-100"
      headerGradientClassName="bg-gradient-to-r from-purple-800 to-indigo-900"
      buttonGradientClassName="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
      textColorClassName="text-purple-900"
      accentColorClassName="text-purple-600"
      basicUpgrades={basicUpgrades}
      advancedUpgrades={advancedUpgrades}
      milestones={milestones}
      clickMessages={clickMessages}
    />
  )
}
