"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp } from "lucide-react"
import type { ChessPiece } from "@/app/page"

interface MoveAnalysisProps {
  suggestedMove: {
    from: string
    to: string
    piece: ChessPiece
  }
}

const PIECE_VALUES = {
  king: 50,
  queen: 9,
  rook: 5,
  bishop: 3,
  knight: 3,
  pawn: 1,
}

const PIECE_NAMES = {
  king: "King",
  queen: "Queen",
  rook: "Rook",
  bishop: "Bishop",
  knight: "Knight",
  pawn: "Pawn",
}

export default function MoveAnalysis({ suggestedMove }: MoveAnalysisProps) {
  const { from, to, piece } = suggestedMove

  return (
    <Card className="border-2 border-blue-400 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">AI Recommendation</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Best Move
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Move {PIECE_NAMES[piece.type]} from {from.toUpperCase()} to {to.toUpperCase()}
            </span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{PIECE_VALUES[piece.type]} pts potential</span>
            </div>
          </div>

          <p className="text-xs text-blue-600">
            This move maximizes your point capture potential. Tap the highlighted squares to execute!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
