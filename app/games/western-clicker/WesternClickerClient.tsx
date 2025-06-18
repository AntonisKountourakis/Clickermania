"use client"

import dynamic from "next/dynamic"
import ResetButton from "@/components/reset-button"

// Use dynamic import with ssr: false in this client component
const WesternClickerGame = dynamic(() => import("@/components/western-clicker-game"), { ssr: false })

export default function WesternClickerClient() {
  return (
    <div className="western-clicker-container">
      <WesternClickerGame />
      <ResetButton />
    </div>
  )
}
