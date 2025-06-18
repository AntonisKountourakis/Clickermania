"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

// Τύποι για τα δεδομένα του παιχνιδιού
interface GameData {
  id: string
  name: string
  description: string
  emoji: string
  color: string
}

/**
 * ΣΗΜΕΙΩΣΗ: Αυτό το component δεν χρησιμοποιείται πλέον καθώς τα προσαρμοσμένα παιχνίδια
 * έχουν ενσωματωθεί στην κύρια λίστα παιχνιδιών. Διατηρείται για μελλοντική αναφορά.
 */
export function CustomGamesSection() {
  const [games, setGames] = useState<GameData[]>([])

  // Φόρτωση παιχνιδιών από το localStorage
  useEffect(() => {
    try {
      const savedGamesStr = localStorage.getItem("custom-clicker-games")
      if (savedGamesStr) {
        const savedGames = JSON.parse(savedGamesStr)
        setGames(savedGames)
      }
    } catch (error) {
      console.error("Error loading games:", error)
    }
  }, [])

  if (games.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Τα Παιχνίδια Μου</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {games.map((game) => (
          <Link key={game.id} href={`/games/custom/${game.id}`} className="block">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="aspect-video w-full overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${game.color.replace("from-", "").replace("to-", "")})`,
                }}
              >
                <span className="text-9xl">{game.emoji}</span>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{game.name}</CardTitle>
                <CardDescription className="text-base mt-1">{game.description}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <div className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md text-center shadow-lg text-lg">
                  Παίξε Τώρα
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}

        <Link href="/admin" className="block">
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-dashed border-2">
            <div className="aspect-video w-full overflow-hidden flex items-center justify-center bg-gray-100">
              <PlusCircle className="h-20 w-20 text-gray-400" />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-xl">Δημιουργία Νέου Παιχνιδιού</CardTitle>
              <CardDescription className="text-base mt-1">
                Φτιάξτε το δικό σας clicker game με προσαρμοσμένο θέμα
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <div className="w-full py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-md text-center shadow-lg text-lg">
                Δημιουργία
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
