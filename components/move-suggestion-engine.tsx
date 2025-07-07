"use client"

import { useEffect, useCallback } from "react"
import type { ChessPiece, GameState } from "@/app/page"

interface MoveSuggestionEngineProps {
  gameState: GameState
  onSuggestionReady: (suggestion: { from: string; to: string; piece: ChessPiece; reason: string } | null) => void
}

const PIECE_VALUES = {
  king: 50,
  queen: 9,
  rook: 5,
  bishop: 3,
  knight: 3,
  pawn: 1,
}

export default function MoveSuggestionEngine({ gameState, onSuggestionReady }: MoveSuggestionEngineProps) {
  const calculateBestMove = useCallback(() => {
    if (gameState.currentPlayer !== gameState.userColor || gameState.gamePhase !== "playing") {
      onSuggestionReady(null)
      return
    }

    const userPieces = gameState.pieces.filter((p) => p.color === gameState.userColor && !p.captured)

    // Priority 1: Find capturing moves
    const captureMoves = findCaptureMoves(userPieces, gameState)
    if (captureMoves.length > 0) {
      const bestCapture = captureMoves.reduce((best, current) => (current.value > best.value ? current : best))
      onSuggestionReady({
        from: bestCapture.from,
        to: bestCapture.to,
        piece: bestCapture.piece,
        reason: `Capture ${bestCapture.targetType} for ${bestCapture.value} points!`,
      })
      return
    }

    // Priority 2: Find attacking moves (threatening opponent pieces)
    const attackMoves = findAttackingMoves(userPieces, gameState)
    if (attackMoves.length > 0) {
      const bestAttack = attackMoves[0]

    // Priority 3: If no safe or beneficial moves, suggest skipping
    const defensiveMoves = userPieces.filter(piece => {
      // Naive safety check: skip pieces with no available moves or likely to be captured
      return piece.possibleMoves && piece.possibleMoves.length > 0;
    });

    if (defensiveMoves.length === 0) {
      onSuggestionReady({
        from: "",
        to: "",
        piece: null as any,
        reason: "No safe or beneficial moves detected. Skipping move to avoid losing material.",
      });
      return;
    }

      onSuggestionReady({
        from: bestAttack.from,
        to: bestAttack.to,
        piece: bestAttack.piece,
        reason: `Threaten opponent's ${bestAttack.targetType}!`,
      })
      return
    }

    // Priority 3: Find strategic moves
    const strategicMoves = findStrategicMoves(userPieces, gameState)
    if (strategicMoves.length > 0) {
      const bestStrategic = strategicMoves[0]
      onSuggestionReady({
        from: bestStrategic.from,
        to: bestStrategic.to,
        piece: bestStrategic.piece,
        reason: bestStrategic.reason,
      })
      return
    }

    onSuggestionReady(null)
  }, [gameState, onSuggestionReady])

  const findCaptureMoves = (userPieces: ChessPiece[], gameState: GameState) => {
    const captureMoves: any[] = []

    for (const piece of userPieces) {
      const possibleMoves = getPossibleMoves(piece, gameState)

      for (const move of possibleMoves) {
        const targetPiece = gameState.pieces.find((p) => p.position === move && !p.captured)
        if (targetPiece && targetPiece.color !== gameState.userColor) {
          captureMoves.push({
            from: piece.position,
            to: move,
            piece: piece,
            value: PIECE_VALUES[targetPiece.type],
            targetType: targetPiece.type,
          })
        }
      }
    }

    return captureMoves.sort((a, b) => b.value - a.value)
  }

  const findAttackingMoves = (userPieces: ChessPiece[], gameState: GameState) => {
    const attackMoves: any[] = []

    for (const piece of userPieces) {
      const possibleMoves = getPossibleMoves(piece, gameState)

      for (const move of possibleMoves) {
        // Check if this move would threaten opponent pieces
        const threatenedPieces = getThreatenedPieces(piece, move, gameState)
        if (threatenedPieces.length > 0) {
          const highestValueThreat = threatenedPieces.reduce((max, current) =>
            PIECE_VALUES[current.type] > PIECE_VALUES[max.type] ? current : max,
          )

          attackMoves.push({
            from: piece.position,
            to: move,
            piece: piece,
            targetType: highestValueThreat.type,
            threatValue: PIECE_VALUES[highestValueThreat.type],
          })
        }
      }
    }

    return attackMoves.sort((a, b) => b.threatValue - a.threatValue)
  }

  const findStrategicMoves = (userPieces: ChessPiece[], gameState: GameState) => {
    const strategicMoves: any[] = []

    for (const piece of userPieces) {
      const possibleMoves = getPossibleMoves(piece, gameState)

      for (const move of possibleMoves) {
        const [file, rank] = move.split("")
        const fileIndex = file.charCodeAt(0) - 97
        const rankIndex = Number.parseInt(rank) - 1

        // Center control
        if (fileIndex >= 3 && fileIndex <= 4 && rankIndex >= 3 && rankIndex <= 4) {
          strategicMoves.push({
            from: piece.position,
            to: move,
            piece: piece,
            reason: "Control the center of the board",
          })
        }

        // Piece development
        if (piece.type !== "pawn" && isStartingPosition(piece)) {
          strategicMoves.push({
            from: piece.position,
            to: move,
            piece: piece,
            reason: "Develop your pieces",
          })
        }

        // Pawn advancement
        if (piece.type === "pawn") {
          const advancement = gameState.userColor === "white" ? rankIndex - 1 : 6 - rankIndex
          if (advancement > 0) {
            strategicMoves.push({
              from: piece.position,
              to: move,
              piece: piece,
              reason: "Advance pawn for better position",
            })
          }
        }
      }
    }

    return strategicMoves
  }

  const getPossibleMoves = (piece: ChessPiece, gameState: GameState): string[] => {
    // Same logic as in the main component
    const moves: string[] = []
    const [file, rank] = piece.position.split("")
    const fileIndex = file.charCodeAt(0) - 97
    const rankIndex = Number.parseInt(rank) - 1

    const isSquareOccupied = (pos: string) => {
      return gameState.pieces.some((p) => p.position === pos && !p.captured)
    }

    const isSquareOccupiedByOwnPiece = (pos: string) => {
      const occupyingPiece = gameState.pieces.find((p) => p.position === pos && !p.captured)
      return occupyingPiece && occupyingPiece.color === piece.color
    }

    const addMoveIfValid = (newFile: number, newRank: number) => {
      if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
        const newPos = String.fromCharCode(97 + newFile) + (newRank + 1)
        if (!isSquareOccupiedByOwnPiece(newPos)) {
          moves.push(newPos)
          return !isSquareOccupied(newPos)
        }
      }
      return false
    }

    // Add piece-specific movement logic here (same as main component)
    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? 1 : -1
        const startRank = piece.color === "white" ? 1 : 6
        const oneSquareForward = rankIndex + direction

        if (oneSquareForward >= 0 && oneSquareForward < 8) {
          const forwardPos = file + (oneSquareForward + 1)
          if (!isSquareOccupied(forwardPos)) {
            moves.push(forwardPos)
            if (rankIndex === startRank) {
              const twoSquareForward = rankIndex + 2 * direction
              if (twoSquareForward >= 0 && twoSquareForward < 8) {
                const twoForwardPos = file + (twoSquareForward + 1)
                if (!isSquareOccupied(twoForwardPos)) {
                  moves.push(twoForwardPos)
                }
              }
            }
          }
        }

        // Diagonal captures
        for (const df of [-1, 1]) {
          const newFile = fileIndex + df
          const newRank = oneSquareForward
          if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
            const capturePos = String.fromCharCode(97 + newFile) + (newRank + 1)
            const targetPiece = gameState.pieces.find((p) => p.position === capturePos && !p.captured)
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push(capturePos)
            }
          }
        }
        break

      case "rook":
        const rookDirections = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]
        for (const [df, dr] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            if (!addMoveIfValid(fileIndex + df * i, rankIndex + dr * i)) {
              break
            }
          }
        }
        break

      case "bishop":
        const bishopDirections = [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [df, dr] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            if (!addMoveIfValid(fileIndex + df * i, rankIndex + dr * i)) {
              break
            }
          }
        }
        break

      case "queen":
        const queenDirections = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [df, dr] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            if (!addMoveIfValid(fileIndex + df * i, rankIndex + dr * i)) {
              break
            }
          }
        }
        break

      case "king":
        const kingMoves = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]
        for (const [df, dr] of kingMoves) {
          addMoveIfValid(fileIndex + df, rankIndex + dr)
        }
        break

      case "knight":
        const knightMoves = [
          [2, 1],
          [2, -1],
          [-2, 1],
          [-2, -1],
          [1, 2],
          [1, -2],
          [-1, 2],
          [-1, -2],
        ]
        for (const [df, dr] of knightMoves) {
          addMoveIfValid(fileIndex + df, rankIndex + dr)
        }
        break
    }

    return moves
  }

  const getThreatenedPieces = (piece: ChessPiece, newPosition: string, gameState: GameState): ChessPiece[] => {
    // Create a temporary piece at the new position to check what it would threaten
    const tempPiece = { ...piece, position: newPosition }
    const possibleAttacks = getPossibleMoves(tempPiece, gameState)

    const threatenedPieces: ChessPiece[] = []
    for (const attackPos of possibleAttacks) {
      const targetPiece = gameState.pieces.find((p) => p.position === attackPos && !p.captured)
      if (targetPiece && targetPiece.color !== gameState.userColor) {
        threatenedPieces.push(targetPiece)
      }
    }

    return threatenedPieces
  }

  const isStartingPosition = (piece: ChessPiece): boolean => {
    const [file, rank] = piece.position.split("")
    const rankNum = Number.parseInt(rank)

    if (piece.color === "white") {
      return rankNum === 1 || rankNum === 2
    } else {
      return rankNum === 7 || rankNum === 8
    }
  }

  useEffect(() => {
    calculateBestMove()
  }, [calculateBestMove])

  return null
}
