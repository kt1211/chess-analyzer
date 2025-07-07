"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BoardPosition, BestMove } from "@/app/page"

interface ChessAnalyzerProps {
  position: BoardPosition
  bestMove: BestMove | null
}

const PIECE_SYMBOLS = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
}

export default function ChessAnalyzer({ position, bestMove }: ChessAnalyzerProps) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  const getPieceAtPosition = (pos: string) => {
    return position.pieces.find((piece) => piece.position === pos)
  }

  const isHighlightedSquare = (pos: string) => {
    if (!bestMove) return false
    return pos === bestMove.from || pos === bestMove.to
  }

  const getSquareHighlightClass = (pos: string) => {
    if (!bestMove) return ""
    if (pos === bestMove.from) return "ring-4 ring-yellow-400 ring-inset bg-yellow-400/30"
    if (pos === bestMove.to) return "ring-4 ring-green-400 ring-inset bg-green-400/30"
    return ""
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Board Analysis</span>
          <Badge className={`${position.currentPlayer === "white" ? "bg-white text-black" : "bg-gray-800 text-white"}`}>
            {position.currentPlayer === "white" ? "White to Move" : "Black to Move"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-100 rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-8 gap-0 border-2 border-amber-800 rounded-lg overflow-hidden">
            {ranks.map((rank) =>
              files.map((file) => {
                const position = `${file}${rank}`
                const piece = getPieceAtPosition(position)
                const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0
                const isHighlighted = isHighlightedSquare(position)

                return (
                  <div
                    key={position}
                    className={`
                      aspect-square flex items-center justify-center text-2xl font-bold
                      relative transition-all duration-300
                      ${isLight ? "bg-amber-100" : "bg-amber-800"}
                      ${getSquareHighlightClass(position)}
                    `}
                  >
                    {piece && (
                      <div
                        className={`
                          select-none transition-transform duration-200
                          ${piece.color === "white" ? "text-white drop-shadow-lg" : "text-black"}
                          ${isHighlighted ? "scale-110" : ""}
                        `}
                      >
                        {PIECE_SYMBOLS[piece.color][piece.type]}
                      </div>
                    )}

                    {/* Move indicators */}
                    {bestMove && position === bestMove.from && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded">FROM</div>
                    )}
                    {bestMove && position === bestMove.to && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">TO</div>
                    )}

                    {/* Square coordinates */}
                    <div className="absolute bottom-0 left-0 text-xs opacity-50 text-amber-600">{position}</div>
                  </div>
                )
              }),
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-amber-700">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-400 rounded border border-yellow-600"></div>
              <span>Move From</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400 rounded border border-green-600"></div>
              <span>Move To</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
