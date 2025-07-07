"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock } from "lucide-react"
import type { GameState } from "@/app/page"

interface ScoreBoardProps {
  gameState: GameState
}

export default function ScoreBoard({ gameState }: ScoreBoardProps) {
  const userScore = gameState.userColor === "white" ? gameState.whiteScore : gameState.blackScore
  const opponentScore = gameState.userColor === "white" ? gameState.blackScore : gameState.whiteScore
  const isWinning = userScore > opponentScore

  return (
    <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Score</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-700">{Math.floor(gameState.moveCount / 2) + 1}/6 moves</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-800">{userScore}</div>
            <div className="text-sm text-amber-600">You</div>
            <Badge variant={isWinning ? "default" : "secondary"} className={isWinning ? "bg-green-600" : ""}>
              {gameState.userColor === "white" ? "♔" : "♚"}
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-amber-800">{opponentScore}</div>
            <div className="text-sm text-amber-600">Opponent</div>
            <Badge variant="secondary">{gameState.aiColor === "white" ? "♔" : "♚"}</Badge>
          </div>
        </div>

        {gameState.capturedPieces.length > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="text-xs text-amber-600 mb-1">Captured pieces:</div>
            <div className="flex flex-wrap gap-1">
              {gameState.capturedPieces.map((piece, index) => (
                <span
                  key={index}
                  className={`text-sm ${piece.color === gameState.userColor ? "text-red-600" : "text-green-600"}`}
                >
                  {piece.color === "white"
                    ? "♔♕♖♗♘♙"[["king", "queen", "rook", "bishop", "knight", "pawn"].indexOf(piece.type)]
                    : "♚♛♜♝♞♟"[["king", "queen", "rook", "bishop", "knight", "pawn"].indexOf(piece.type)]}
                </span>
              ))}
            </div>
          </div>
        )}

        {gameState.skippedMoves.white > 0 || gameState.skippedMoves.black > 0 ? (
          <div className="mt-2 text-xs text-amber-600">
            Skipped moves: White {gameState.skippedMoves.white}, Black {gameState.skippedMoves.black}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
