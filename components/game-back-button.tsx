"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useCallback } from "react"

interface GameBackButtonProps {
  className?: string
}

export function GameBackButton({ className }: GameBackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Αποθηκεύουμε το τρέχον παιχνίδι όταν φορτώνει το κουμπί
  useEffect(() => {
    if (pathname && pathname.includes("/games/")) {
      const gameId = pathname.split("/").pop() || ""
      if (gameId) {
        localStorage.setItem("last-played-game", gameId)
      }
    }
  }, [pathname])

  // Βελτιωμένη συνάρτηση για το κουμπί πίσω
  const handleBack = useCallback(() => {
    // Αποθήκευση της τρέχουσας θέσης παιχνιδιού πριν την επιστροφή
    const gameId = window.location.pathname.split("/").pop()
    if (gameId) {
      localStorage.setItem("last-played-game", gameId)
    }

    // Διατήρηση της θέσης στην αρχική σελίδα
    localStorage.setItem("skip-homepage-scroll", "false")

    // Επιστροφή στην αρχική σελίδα
    router.push("/")
  }, [router])

  return (
    <div className={cn("fixed top-0 left-0 z-50 m-0 p-0", className)}>
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none hover:from-amber-500 hover:to-amber-700 hover:text-white shadow-lg rounded-none rounded-br-md"
        style={{
          touchAction: "manipulation", // Βελτιώνει την ανταπόκριση σε οθόνες αφής
          WebkitTapHighlightColor: "transparent", // Αφαιρεί το highlight στο tap σε iOS
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  )
}

export default GameBackButton
