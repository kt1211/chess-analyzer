"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { ChessPiece, GameState } from "@/app/page"

interface ChessBoardProps {
  gameState: GameState
  onMovePiece: (pieceId: string, newPosition: string) => void
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

export default function ChessBoard({ gameState, onMovePiece }: ChessBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null)
  const [draggedPiece, setDraggedPiece] = useState<ChessPiece | null>(null)

  // 8x8 chess board coordinates
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  const getPieceAtPosition = useCallback(
    (position: string) => {
      return gameState.pieces.find((piece) => piece.position === position && !piece.captured)
    },
    [gameState.pieces],
  )

  const isSquareHighlighted = useCallback(
    (position: string) => {
      if (!gameState.bestMove) return false
      return gameState.bestMove.from === position || gameState.bestMove.to === position
    },
    [gameState.bestMove],
  )

  const isSquareSelected = useCallback(
    (position: string) => {
      return selectedPiece?.position === position
    },
    [selectedPiece],
  )

  const handleSquareClick = useCallback(
    (position: string) => {
      const piece = getPieceAtPosition(position)

      if (selectedPiece) {
        if (selectedPiece.position === position) {
          setSelectedPiece(null)
        } else {
          onMovePiece(selectedPiece.id, position)
          setSelectedPiece(null)
        }
      } else if (piece) {
        setSelectedPiece(piece)
      }
    },
    [selectedPiece, getPieceAtPosition, onMovePiece],
  )

  const handleDragStart = useCallback((e: React.DragEvent, piece: ChessPiece) => {
    setDraggedPiece(piece)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", piece.id)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, position: string) => {
      e.preventDefault()
      if (draggedPiece) {
        onMovePiece(draggedPiece.id, position)
        setDraggedPiece(null)
      }
    },
    [draggedPiece, onMovePiece],
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Board coordinates labels */}
      <div className="flex justify-between items-center mb-2 px-2">
        {files.map((file) => (
          <div key={file} className="text-xs font-bold text-amber-700 w-8 text-center">
            {file.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="relative">
        {/* Rank labels */}
        <div className="absolute -left-6 top-0 h-full flex flex-col justify-around">
          {ranks.map((rank) => (
            <div key={rank} className="text-xs font-bold text-amber-700 h-8 flex items-center">
              {rank}
            </div>
          ))}
        </div>

        {/* 8x8 Chess Board */}
        <div className="grid grid-cols-8 gap-0 border-2 border-amber-800 rounded-lg overflow-hidden aspect-square">
          {ranks.map((rank) =>
            files.map((file) => {
              const position = `${file}${rank}`
              const piece = getPieceAtPosition(position)
              const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0
              const isHighlighted = isSquareHighlighted(position)
              const isSelected = isSquareSelected(position)

              return (
                <div
                  key={position}
                  className={`
                    aspect-square flex items-center justify-center text-2xl font-bold cursor-pointer
                    transition-all duration-200 relative
                    ${isLight ? "bg-amber-100" : "bg-amber-800"}
                    ${isHighlighted ? "ring-4 ring-green-400 ring-inset animate-pulse shadow-lg" : ""}
                    ${isSelected ? "ring-4 ring-blue-400 ring-inset shadow-lg" : ""}
                    hover:brightness-110 active:scale-95
                  `}
                  onClick={() => handleSquareClick(position)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, position)}
                >
                  {piece && (
                    <div
                      className={`
                        select-none transition-all duration-200 cursor-grab active:cursor-grabbing
                        ${piece.color === "white" ? "text-white drop-shadow-lg" : "text-black drop-shadow-sm"}
                        ${draggedPiece?.id === piece.id ? "opacity-50 scale-110" : ""}
                        ${isSelected ? "scale-110 animate-bounce" : ""}
                        hover:scale-105
                      `}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, piece)}
                    >
                      {PIECE_SYMBOLS[piece.color][piece.type]}
                    </div>
                  )}

                  {/* Best move indicators */}
                  {isHighlighted && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <div
                        className={`
                        text-white text-xs px-1 py-0.5 rounded-bl font-bold animate-bounce
                        ${gameState.bestMove?.from === position ? "bg-yellow-500" : "bg-green-500"}
                      `}
                      >
                        {gameState.bestMove?.from === position ? "FROM" : "TO"}
                      </div>
                    </div>
                  )}

                  {/* Square coordinates */}
                  <div className="absolute bottom-0 left-0 text-xs opacity-30 text-amber-600 font-mono">{position}</div>

                  {/* Move hint dots */}
                  {isHighlighted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className={`
                        w-4 h-4 rounded-full opacity-60
                        ${gameState.bestMove?.from === position ? "bg-yellow-400" : "bg-green-400"}
                      `}
                      />
                    </div>
                  )}
                </div>
              )
            }),
          )}
        </div>

        {/* Rank labels on right */}
        <div className="absolute -right-6 top-0 h-full flex flex-col justify-around">
          {ranks.map((rank) => (
            <div key={rank} className="text-xs font-bold text-amber-700 h-8 flex items-center">
              {rank}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom file labels */}
      <div className="flex justify-between items-center mt-2 px-2">
        {files.map((file) => (
          <div key={file} className="text-xs font-bold text-amber-700 w-8 text-center">
            {file.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Legend and Instructions */}
      <div className="mt-4 text-xs text-amber-600 space-y-2">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded animate-pulse" />
            <span>AI Best Move</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded" />
            <span>From Square</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold">Real Chess Rules Applied!</p>
          <p>Tap to select pieces • Drag to move • Follow green highlights for best moves</p>
          <p>Invalid moves will be rejected automatically</p>
        </div>
      </div>
    </div>
  )
}
