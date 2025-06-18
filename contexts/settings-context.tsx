"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Settings {
  soundEnabled: boolean
  musicEnabled: boolean
  enableAnimations: boolean
  highPerformanceMode: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  enableAnimations: true,
  highPerformanceMode: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("clickerManiaSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...parsedSettings,
        }))
      } catch (error) {
        console.error("Failed to parse settings:", error)
      }
    }

    // Auto-disable animations on low-end mobile devices
    const checkLowEndDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

      if (isMobile) {
        // Check for hardware concurrency (CPU cores)
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2

        // Check for device memory (if available)
        const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2

        if (lowCores || lowMemory) {
          setSettings((prev) => ({
            ...prev,
            enableAnimations: false,
            highPerformanceMode: true,
          }))
        }
      }
    }

    checkLowEndDevice()
    setIsInitialized(true)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("clickerManiaSettings", JSON.stringify(settings))
    }
  }, [settings, isInitialized])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
