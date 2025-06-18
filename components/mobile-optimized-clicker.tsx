"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import { ResponsiveGameLayout } from "@/components/responsive-game-layout"
import { getTouchTargetSize } from "@/utils/mobile-optimization"

interface ClickerGameProps {
  gameId: string
  title: string
  description: string
  backgroundClass: string
  headerClass: string
  buttonClass: string
  icon: React.ReactNode
  formatNumber?: (num: number) => string
}

export function MobileOptimizedClicker({
  gameId,
  title,
  description,
  backgroundClass,
  headerClass,
  buttonClass,
  icon,
  formatNumber = (num: number) => num.toString(),
}: ClickerGameProps) {
  const { isMobile, reducedAnimations, touchOptimized, preserveDesktopStyle } = useMobileOptimization()

  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)

  // Determine optimal touch target size
  const touchTargetSize = getTouchTargetSize()

  // Responsive styles that maintain desktop appearance
  const buttonStyle = {
    minHeight: isMobile ? `${touchTargetSize}px` : undefined,
    fontSize: isMobile ? (preserveDesktopStyle ? "1.25rem" : "1rem") : undefined,
    padding: isMobile ? (preserveDesktopStyle ? "1rem 1.5rem" : "0.75rem 1rem") : undefined,
  }

  const handleClick = useCallback(() => {
    setScore((prev) => prev + clickPower)
  }, [clickPower])

  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setScore((prev) => prev + autoClickers)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickers])

  return (
    <ResponsiveGameLayout
      backgroundClass={backgroundClass}
      preserveDesktopStyle={preserveDesktopStyle}
      className={reducedAnimations ? "reduce-animations" : ""}
    >
      <div className="w-full max-w-md mx-auto space-y-4 p-4">
        <Card className={`shadow-md backdrop-blur-lg ${isMobile ? "mobile-card" : ""}`}>
          <CardHeader className={headerClass}>
            <CardTitle className="text-2xl font-bold text-center text-white">{title}</CardTitle>
            <CardDescription className="text-center text-white/80">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {icon}
                <p className="text-lg font-bold ml-2">Score: {formatNumber(score)}</p>
              </div>
            </div>

            <Button
              onClick={handleClick}
              className={`w-full ${buttonClass} ${touchOptimized ? "touch-optimized" : ""}`}
              style={buttonStyle}
            >
              Click Me!
            </Button>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                onClick={() => setClickPower((prev) => prev + 1)}
                disabled={score < 10}
                className={touchOptimized ? "touch-optimized" : ""}
                style={{ minHeight: isMobile ? `${touchTargetSize}px` : undefined }}
              >
                Upgrade Click (+1)
              </Button>
              <Button
                onClick={() => setAutoClickers((prev) => prev + 1)}
                disabled={score < 25}
                className={touchOptimized ? "touch-optimized" : ""}
                style={{ minHeight: isMobile ? `${touchTargetSize}px` : undefined }}
              >
                Auto Clicker (+1)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveGameLayout>
  )
}
