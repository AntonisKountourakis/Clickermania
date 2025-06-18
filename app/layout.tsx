import type React from "react"
import "./globals.css"
import "./themes.css"
import "./mobile-optimizations.css" // Add mobile optimizations
import type { Metadata } from "next"
import { SettingsProvider } from "@/contexts/settings-context"
import { MobileMenu } from "@/components/mobile-menu"
import { SoundButton } from "@/components/sound-button"
import { DirectAudioPlayer } from "@/components/direct-audio-player"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { FluidBorder } from "@/components/fluid-border"

export const metadata: Metadata = {
  title: "ClickerMania - The Ultimate Clicker Game Collection",
  description: "Explore a variety of clicker games in one place. Click, upgrade, and watch your empire grow!",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover", // Add viewport-fit for notched devices
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="m-0 p-0 overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rye&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="overflow-x-hidden min-h-screen m-0 p-0 pt-0 mt-0 bg-transparent">
        {/* Ρευστό περίγραμμα που αντιδρά στον κέρσορα/δάχτυλο */}
        <FluidBorder />

        <SettingsProvider>
          <div className="app-container m-0 p-0 pt-0 mt-0">
            {false && <MobileMenu />}
            {/* Αύξηση του padding και μετακίνηση των κουμπιών πιο μέσα από τα όρια */}
            <div className="flex justify-center items-center fixed bottom-20 left-0 right-0 z-30 p-6 sm:p-8 md:p-10">
              <SoundButton />
            </div>
            <DirectAudioPlayer />
            <main className="m-0 p-0 pt-0 mt-0">{children}</main>
          </div>
        </SettingsProvider>
        <PerformanceMonitor />
      </body>
    </html>
  )
}
