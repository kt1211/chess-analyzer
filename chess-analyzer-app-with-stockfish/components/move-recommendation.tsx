"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Zap, Crown } from "lucide-react"
import type { BestMove } from "@/app/page"

interface MoveRecommendationProps {
  bestMove: BestMove
  winningChances: number
}

export default function MoveRecommendation({ bestMove, winningChances }: MoveRecommendationProps) {
  const getWinChanceColor = (percentage: number) => {
    if (percentage >= 70) return "from-green-500 to-emerald-600"
    if (percentage >= 50) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getWinChanceText = (percentage: number) => {
    if (percentage >= 80) return "Excellent!"
    if (percentage >= 65) return "Very Good"
    if (percentage >= 50) return "Good Chance"
    return "Challenging"
  }

  return (
    <Card className={`bg-gradient-to-br ${getWinChanceColor(winningChances)} border-0 text-white`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-6 w-6 text-yellow-300" />
          <h3 className="text-xl font-bold">Best Winning Move</h3>
          <Badge className="bg-white/20 text-white">
            <Zap className="h-3 w-3 mr-1" />
            AI Recommended
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Move Details */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {bestMove.from.toUpperCase()} → {bestMove.to.toUpperCase()}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{winningChances}%</div>
                <div className="text-sm opacity-90">{getWinChanceText(winningChances)}</div>
              </div>
            </div>

            <p className="text-lg mb-2">
              Move your <strong>{bestMove.piece.type}</strong> from <strong>{bestMove.from.toUpperCase()}</strong> to{" "}
              <strong>{bestMove.to.toUpperCase()}</strong>
            </p>

            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              <span>{bestMove.reason}</span>
            </div>
          </div>

          {/* Win Probability Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Win Probability</span>
              <span className="font-bold">{winningChances}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-1000"
                style={{ width: `${winningChances}%` }}
              />
            </div>
          </div>

          {/* Follow-up Strategy */}
          {bestMove.followUpMoves.length > 0 && (
            <div className="bg-white/10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Next Steps:
              </h4>
              <ul className="space-y-1 text-sm">
                {bestMove.followUpMoves.map((move, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {move}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
