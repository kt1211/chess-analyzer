"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import type { PieceColor, ChessPiece } from "@/app/page"

interface GameSetupProps {
  onStartGame: (userColor: PieceColor, firstPlayer: PieceColor) => void
  detectedPieces: number
  pieces: ChessPiece[]
}

export default function GameSetup({ onStartGame, detectedPieces, pieces }: GameSetupProps) {
  const [userColor, setUserColor] = useState<PieceColor>("white")
  const [firstPlayer, setFirstPlayer] = useState<PieceColor>("white")

  const whitePieces = pieces.filter((p) => p.color === "white").length
  const blackPieces = pieces.filter((p) => p.color === "black").length

  // Count piece types
  const pieceCount = {
    white: {
      king: pieces.filter((p) => p.color === "white" && p.type === "king").length,
      queen: pieces.filter((p) => p.color === "white" && p.type === "queen").length,
      rook: pieces.filter((p) => p.color === "white" && p.type === "rook").length,
      bishop: pieces.filter((p) => p.color === "white" && p.type === "bishop").length,
      knight: pieces.filter((p) => p.color === "white" && p.type === "knight").length,
      pawn: pieces.filter((p) => p.color === "white" && p.type === "pawn").length,
    },
    black: {
      king: pieces.filter((p) => p.color === "black" && p.type === "king").length,
      queen: pieces.filter((p) => p.color === "black" && p.type === "queen").length,
      rook: pieces.filter((p) => p.color === "black" && p.type === "rook").length,
      bishop: pieces.filter((p) => p.color === "black" && p.type === "bishop").length,
      knight: pieces.filter((p) => p.color === "black" && p.type === "knight").length,
      pawn: pieces.filter((p) => p.color === "black" && p.type === "pawn").length,
    },
  }

  return (
    <Card className="border-2 border-green-400 bg-green-50">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-green-800 flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Board Detected Successfully!
        </CardTitle>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-green-100">
            Total: {detectedPieces}
          </Badge>
          <Badge variant="secondary" className="bg-white">
            ♔ White: {whitePieces}
          </Badge>
          <Badge variant="secondary" className="bg-gray-800 text-white">
            ♚ Black: {blackPieces}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Piece Detection Summary */}
        <div className="bg-white p-3 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2 text-center">Detected Pieces</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold text-gray-700 mb-1">White Pieces:</div>
              <div className="space-y-1">
                <div>♔ King: {pieceCount.white.king}</div>
                <div>♕ Queen: {pieceCount.white.queen}</div>
                <div>♖ Rook: {pieceCount.white.rook}</div>
                <div>♗ Bishop: {pieceCount.white.bishop}</div>
                <div>♘ Knight: {pieceCount.white.knight}</div>
                <div>♙ Pawn: {pieceCount.white.pawn}</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Black Pieces:</div>
              <div className="space-y-1">
                <div>♚ King: {pieceCount.black.king}</div>
                <div>♛ Queen: {pieceCount.black.queen}</div>
                <div>♜ Rook: {pieceCount.black.rook}</div>
                <div>♝ Bishop: {pieceCount.black.bishop}</div>
                <div>♞ Knight: {pieceCount.black.knight}</div>
                <div>♟ Pawn: {pieceCount.black.pawn}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-800 mb-2">Choose your color:</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={userColor === "white" ? "default" : "outline"}
              onClick={() => setUserColor("white")}
              className={userColor === "white" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600"}
            >
              ♔ Play as White
            </Button>
            <Button
              variant={userColor === "black" ? "default" : "outline"}
              onClick={() => setUserColor("black")}
              className={userColor === "black" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600"}
            >
              ♚ Play as Black
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-800 mb-2">Who plays first:</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={firstPlayer === "white" ? "default" : "outline"}
              onClick={() => setFirstPlayer("white")}
              className={
                firstPlayer === "white" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600"
              }
            >
              White Moves First
            </Button>
            <Button
              variant={firstPlayer === "black" ? "default" : "outline"}
              onClick={() => setFirstPlayer("black")}
              className={
                firstPlayer === "black" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600"
              }
            >
              Black Moves First
            </Button>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Scoring System:</h4>
          <div className="text-xs text-amber-700 grid grid-cols-2 gap-1">
            <div>♔ King: 50 pts</div>
            <div>♕ Queen: 9 pts</div>
            <div>♖ Rook: 5 pts</div>
            <div>♗ Bishop: 3 pts</div>
            <div>♘ Knight: 3 pts</div>
            <div>♙ Pawn: 1 pt</div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Game Rules:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• Real chess movement rules applied</div>
            <div>• 6 moves per player (12 total moves)</div>
            <div>• Winner determined by captured material points</div>
            <div>• Skip moves allowed (extra move compensation)</div>
            <div>• AI suggests best moves for maximum points</div>
          </div>
        </div>

        <Button
          onClick={() => onStartGame(userColor, firstPlayer)}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
        >
          🚀 Start Game - AI Will Help You Win!
        </Button>
      </CardContent>
    </Card>
  )
}
