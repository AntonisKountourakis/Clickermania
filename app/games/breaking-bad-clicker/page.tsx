import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BreakingBadClickerGame from "@/components/breaking-bad-clicker-game"

export default function BreakingBadClickerPage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-green-900/30 text-white hover:bg-black/30 hover:text-white"
        >
          <Link href="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <BreakingBadClickerGame />
    </>
  )
}
