"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Target, TrendingUp, Shield } from "lucide-react"
import type { BestMove } from "@/app/page"

interface WinningStrategyProps {
  bestMove: BestMove
  gamePhase: "opening" | "middlegame" | "endgame"
}

const STRATEGY_TIPS = {
  opening: [
    "Control the center with pawns (e4, d4)",
    "Develop knights before bishops",
    "Castle early for king safety",
    "Don't move the same piece twice",
    "Don't bring queen out too early",
  ],
  middlegame: [
    "Look for tactical combinations",
    "Improve piece positions",
    "Create weaknesses in opponent's position",
    "Control key squares and files",
    "Plan pawn breaks",
  ],
  endgame: [
    "Activate your king",
    "Push passed pawns",
    "Centralize your pieces",
    "Create threats on both sides",
    "Calculate precisely",
  ],
}

export default function WinningStrategy({ bestMove, gamePhase }: WinningStrategyProps) {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "opening":
        return "from-blue-500 to-cyan-600"
      case "middlegame":
        return "from-purple-500 to-pink-600"
      case "endgame":
        return "from-orange-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "opening":
        return <Shield className="h-5 w-5" />
      case "middlegame":
        return <Target className="h-5 w-5" />
      case "endgame":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Game Phase Strategy */}
      <Card className={`bg-gradient-to-br ${getPhaseColor(gamePhase)} border-0 text-white`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPhaseIcon(gamePhase)}
            {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)} Strategy
            <Badge className="bg-white/20 text-white">Current Phase</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {STRATEGY_TIPS[gamePhase].map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-700 border-0 text-white">
        <CardContent className="p-4">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for Winzo Chess
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-white/10 rounded p-2">
              <strong>Time Management:</strong> Think on opponent's time, move quickly in familiar positions
            </div>
            <div className="bg-white/10 rounded p-2">
              <strong>Pattern Recognition:</strong> Look for forks, pins, skewers, and discovered attacks
            </div>
            <div className="bg-white/10 rounded p-2">
              <strong>Calculation:</strong> Always check for opponent's threats before making your move
            </div>
            <div className="bg-white/10 rounded p-2">
              <strong>Psychology:</strong> Stay calm under pressure, don't rush in winning positions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
