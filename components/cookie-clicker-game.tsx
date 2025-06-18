"use client"

import { Cookie, ChefHat, Factory, Truck, Award, Sparkles, Zap, Star } from "lucide-react"
import { UnifiedClickerTemplate } from "./unified-clicker-template"
import "../app/games/cookie-clicker/cookie-clicker.css"

const UPGRADES = [
  {
    id: "click_power",
    name: "Clicking Power",
    description: "Bake more cookies per click",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <Cookie className="h-4 w-4 mr-1" />,
  },
  {
    id: "auto_bakers",
    name: "Auto Bakers",
    description: "Hire bakers to make cookies automatically",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <ChefHat className="h-4 w-4 mr-1" />,
  },
  {
    id: "cookie_quality",
    name: "Cookie Quality",
    description: "Improve your cookie recipe",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Star className="h-4 w-4 mr-1" />,
  },
  {
    id: "cookie_variety",
    name: "Cookie Variety",
    description: "Add more types of cookies to your bakery",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Sparkles className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "master_baker",
    name: "Master Baker",
    description: "Become a master of cookie baking",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο click_power
    maxLevel: 10,
    icon: <ChefHat className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "click_power", level: 10 },
  },
  {
    id: "cookie_factory",
    name: "Cookie Factory",
    description: "Build a factory for mass cookie production",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο auto_bakers
    maxLevel: 5,
    icon: <Factory className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "auto_bakers", level: 15 },
  },
  {
    id: "secret_recipe",
    name: "Secret Recipe",
    description: "Discover a secret family recipe",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο cookie_quality
    maxLevel: 3,
    icon: <Zap className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "cookie_quality", level: 15 },
  },
  {
    id: "cookie_delivery",
    name: "Cookie Delivery",
    description: "Start a cookie delivery service",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο cookie_variety
    maxLevel: 3,
    icon: <Truck className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "cookie_variety", level: 10 },
  },
  {
    id: "cookie_empire",
    name: "Cookie Empire",
    description: "Build a worldwide cookie empire",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Award className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "cookie_quality", level: 20 },
  },
]

// Μηνύματα για τα cookies
const COOKIE_MESSAGES = [
  "Delicious!",
  "Yummy!",
  "Tasty!",
  "Sweet!",
  "Crunchy!",
  "Chocolatey!",
  "Scrumptious!",
  "Mouthwatering!",
  "Heavenly!",
  "Divine!",
]

// Επίπεδα ψησίματος
const BAKING_RANKS = [
  { name: "Beginner", threshold: 0 },
  { name: "Amateur", threshold: 100 },
  { name: "Home Baker", threshold: 500 },
  { name: "Professional", threshold: 2000 },
  { name: "Master Baker", threshold: 5000 },
  { name: "Cookie Wizard", threshold: 10000 },
  { name: "Cookie Mogul", threshold: 25000 },
  { name: "Cookie Tycoon", threshold: 50000 },
  { name: "Cookie Legend", threshold: 100000 },
  { name: "Cookie God", threshold: 250000 },
]

export default function CookieClickerUnified() {
  return (
    <UnifiedClickerTemplate
      settings={{
        name: "Cookie Clicker",
        description: "Bake delicious cookies and build your cookie empire!",
        storageKey: "cookie-clicker-progress",
        mainStatName: "Cookies",
        mainStatIcon: Cookie,
        secondaryStatName: "Baking Power",
        clickButtonText: "BAKE COOKIES!",
        clickButtonIcon: <Cookie className="h-8 w-8 mr-4" />,
        backgroundClass: "cookie-bg",
        headerGradientClass: "bg-gradient-to-r from-amber-700 to-amber-900",
        buttonGradientClass: "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900",
        textColorClass: "text-amber-300",
        accentColorClass: "text-amber-500",
        clickMessages: COOKIE_MESSAGES,
        ranks: BAKING_RANKS,
        upgrades: UPGRADES,
        advancedUpgrades: ADVANCED_UPGRADES,
      }}
      initialStats={{
        mainStat: 0,
        clickPower: 1,
        autoGeneration: 0,
        multiplier1: 1,
        multiplier2: 1,
        upgrades: {},
        streak: 0,
        achievements: [],
      }}
      renderCustomCollection={(stats) => <div className="flex justify-center items-center mb-4"></div>}
    />
  )
}
