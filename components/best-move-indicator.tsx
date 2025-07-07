"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Crown, TrendingUp } from "lucide-react"

interface BestMoveIndicatorProps {
  bestMove: {
    from: string
    to: string
    piece: { type: string }
    captureValue?: number
    reason: string
  }
  isAnalyzing: boolean
}

export default function BestMoveIndicator({ bestMove, isAnalyzing }: BestMoveIndicatorProps) {
  if (isAnalyzing) {
    return (
      <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600" />
          <div>
            <h4 className="text-orange-800 font-semibold">AI Chess Engine Analyzing…</h4>
            <p className="text-orange-600 text-sm">Calculating best move with real chess rules</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-blue-800 text-lg">AI Best Move</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Engine
          </Badge>
        </div>

        {/* Move notation */}
        <div className="text-center">
          <span className="text-2xl font-bold text-blue-900">
            {bestMove.from.toUpperCase()} → {bestMove.to.toUpperCase()}
          </span>
        </div>

        {/* Reason / capture value */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700">{bestMove.reason}</span>

          {bestMove.captureValue && bestMove.captureValue > 0 && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <TrendingUp className="h-4 w-4" />+{bestMove.captureValue} pts
            </span>
          )}
        </div>

        <p className="text-xs text-blue-600">Follow the highlighted squares on the board to execute this move!</p>
      </CardContent>
    </Card>
  )
}
