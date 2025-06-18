"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

// Τύποι για τα δεδομένα του παιχνιδιού
interface Upgrade {
  id: string
  name: string
  description: string
  basePrice: number
  priceMultiplier: number
  effect: number
  maxLevel: number
  icon: string
  unlockRequirement?: { id: string; level: number }
}

interface Rank {
  name: string
  threshold: number
  icon: string
}

interface GameData {
  id: string
  name: string
  description: string
  storageKey: string
  mainStatName: string
  mainStatIcon: string
  secondaryStatName: string
  secondaryStatIcon: string
  clickButtonText: string
  clickButtonIcon: string
  backgroundClass: string
  headerGradientClass: string
  buttonGradientClass: string
  textColorClass: string
  accentColorClass: string
  clickMessages: string[]
  ranks: Rank[]
  upgrades: Upgrade[]
  advancedUpgrades: Upgrade[]
  emoji: string
  color: string
  imageUrl?: string // Optional image URL
}

interface GamesListProps {
  onEditGame: (game: GameData) => void
}

export function GamesList({ onEditGame }: GamesListProps) {
  const [games, setGames] = useState<GameData[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Φόρτωση παιχνιδιών από το localStorage
  useEffect(() => {
    // Αντί να φορτώνουμε τα παιχνίδια από το localStorage ή API,
    // εμφανίζουμε ένα μήνυμα που εξηγεί ότι τα παιχνίδια προστίθενται απευθείας στον κώδικα
    setGames([])
    toast({
      title: "Πληροφορία",
      description: "Τα παιχνίδια προστίθενται απευθείας στον κώδικα στο αρχείο app/page.tsx στον πίνακα clickerGames.",
    })
  }, [])

  // Διαγραφή παιχνιδιού
  const deleteGame = (id: string) => {
    try {
      const updatedGames = games.filter((game) => game.id !== id)
      localStorage.setItem("custom-clicker-games", JSON.stringify(updatedGames))
      setGames(updatedGames)

      // Διαγραφή και των δεδομένων προόδου του παιχνιδιού
      const gameToRemove = games.find((game) => game.id === id)
      if (gameToRemove && gameToRemove.storageKey) {
        localStorage.removeItem(gameToRemove.storageKey)
      }

      toast({
        title: "Επιτυχία",
        description: "Το παιχνίδι διαγράφηκε επιτυχώς!",
      })
    } catch (error) {
      console.error("Error deleting game:", error)
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά τη διαγραφή του παιχνιδιού.",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setGameToDelete(null)
  }

  // Επεξεργασία παιχνιδιού
  const handleEditGame = (game: GameData) => {
    onEditGame(game)
  }

  // Άνοιγμα διαλόγου διαγραφής
  const openDeleteDialog = (id: string) => {
    setGameToDelete(id)
    setDeleteDialogOpen(true)
  }

  const GamePreview = ({
    id,
    name,
    description,
    imageUrl,
  }: { id: string; name: string; description: string; imageUrl?: string }) => (
    <Card key={id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {imageUrl ? (
              <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="text-3xl">{games.find((g) => g.id === id)?.emoji}</div>
            )}
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => handleEditGame(games.find((g) => g.id === id)!)}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Επεξεργασία
            </Button>

            <Button
              onClick={() => openDeleteDialog(id)}
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" /> Διαγραφή
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {games.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Προσθήκη παιχνιδιών στον κώδικα</AlertTitle>
          <AlertDescription>
            Τα παιχνίδια προστίθενται απευθείας στον κώδικα της σελίδας. Ανοίξτε το αρχείο app/page.tsx και προσθέστε το
            παιχνίδι σας στον πίνακα clickerGames.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <GamePreview
              key={game.id}
              id={game.id}
              name={game.name}
              description={game.description}
              imageUrl={game.imageUrl}
            />
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
            <AlertDialogDescription>
              Αυτή η ενέργεια θα διαγράψει οριστικά το παιχνίδι και όλα τα δεδομένα προόδου του. Η ενέργεια αυτή δεν
              μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction onClick={() => gameToDelete && deleteGame(gameToDelete)}>Διαγραφή</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
