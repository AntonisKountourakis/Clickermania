import BudapestClickerGame from "@/components/budapest-clicker-game"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Grand Budapest Hotel | ClickerMania",
  description: "Manage the famous hotel and collect rare artifacts",
}

export default function BudapestClickerPage() {
  return <BudapestClickerGame />
}
