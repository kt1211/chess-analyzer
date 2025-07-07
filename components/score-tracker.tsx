"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import type { GameState } from "@/app/page"

interface ScoreTrackerProps {
  gameState: GameState
}

export default function ScoreTracker({ gameState }: ScoreTrackerProps) {
  const isWinning = gameState.userScore > gameState.opponentScore

  return (
    <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Score Tracker</span>
          </div>
          <span className={`font-medium ${isWinning ? "text-green-600" : "text-red-600"}`}>
            {isWinning ? "Winning" : "Losing"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Your Score</p>
            <p className="text-2xl font-semibold text-gray-800">{gameState.userScore}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Opponent Score</p>
            <p className="text-2xl font-semibold text-gray-800">{gameState.opponentScore}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
