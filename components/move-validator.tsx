"use client"

import type { ChessPiece, GameState } from "@/app/page"

export class MoveValidator {
  static isValidMove(piece: ChessPiece, targetPosition: string, gameState: GameState): boolean {
    const possibleMoves = this.getPossibleMoves(piece, gameState)
    return possibleMoves.includes(targetPosition)
  }

  static getPossibleMoves(piece: ChessPiece, gameState: GameState): string[] {
    const moves: string[] = []
    const [file, rank] = piece.position.split("")
    const fileIndex = file.charCodeAt(0) - 97
    const rankIndex = Number.parseInt(rank) - 1

    const isSquareOccupied = (pos: string) => {
      return gameState.pieces.some((p) => p.position === pos && !p.captured)
    }

    const isSquareOccupiedByOpponent = (pos: string) => {
      const occupyingPiece = gameState.pieces.find((p) => p.position === pos && !p.captured)
      return occupyingPiece && occupyingPiece.color !== piece.color
    }

    const isSquareOccupiedByOwnPiece = (pos: string) => {
      const occupyingPiece = gameState.pieces.find((p) => p.position === pos && !p.captured)
      return occupyingPiece && occupyingPiece.color === piece.color
    }

    const addMoveIfValid = (newFile: number, newRank: number): boolean => {
      if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
        const newPos = String.fromCharCode(97 + newFile) + (newRank + 1)
        if (!isSquareOccupiedByOwnPiece(newPos)) {
          moves.push(newPos)
          return !isSquareOccupied(newPos)
        }
      }
      return false
    }

    switch (piece.type) {
      case "pawn":
        this.addPawnMoves(piece, fileIndex, rankIndex, addMoveIfValid, isSquareOccupied, isSquareOccupiedByOpponent)
        break
      case "rook":
        this.addRookMoves(fileIndex, rankIndex, addMoveIfValid)
        break
      case "bishop":
        this.addBishopMoves(fileIndex, rankIndex, addMoveIfValid)
        break
      case "queen":
        this.addQueenMoves(fileIndex, rankIndex, addMoveIfValid)
        break
      case "king":
        this.addKingMoves(fileIndex, rankIndex, addMoveIfValid)
        break
      case "knight":
        this.addKnightMoves(fileIndex, rankIndex, addMoveIfValid)
        break
    }

    return moves
  }

  private static addPawnMoves(
    piece: ChessPiece,
    fileIndex: number,
    rankIndex: number,
    addMoveIfValid: (f: number, r: number) => boolean,
    isSquareOccupied: (pos: string) => boolean,
    isSquareOccupiedByOpponent: (pos: string) => boolean,
  ) {
    const direction = piece.color === "white" ? 1 : -1
    const startRank = piece.color === "white" ? 1 : 6
    const file = String.fromCharCode(97 + fileIndex)

    // Forward move
    const oneSquareForward = rankIndex + direction
    if (oneSquareForward >= 0 && oneSquareForward < 8) {
      const forwardPos = file + (oneSquareForward + 1)
      if (!isSquareOccupied(forwardPos)) {
        addMoveIfValid(fileIndex, oneSquareForward)

        // Two squares forward from starting position
        if (rankIndex === startRank) {
          const twoSquareForward = rankIndex + 2 * direction
          if (twoSquareForward >= 0 && twoSquareForward < 8) {
            addMoveIfValid(fileIndex, twoSquareForward)
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
        if (isSquareOccupiedByOpponent(capturePos)) {
          addMoveIfValid(newFile, newRank)
        }
      }
    }
  }

  private static addRookMoves(fileIndex: number, rankIndex: number, addMoveIfValid: (f: number, r: number) => boolean) {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    for (const [df, dr] of directions) {
      for (let i = 1; i < 8; i++) {
        if (!addMoveIfValid(fileIndex + df * i, rankIndex + dr * i)) {
          break
        }
      }
    }
  }

  private static addBishopMoves(
    fileIndex: number,
    rankIndex: number,
    addMoveIfValid: (f: number, r: number) => boolean,
  ) {
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]
    for (const [df, dr] of directions) {
      for (let i = 1; i < 8; i++) {
        if (!addMoveIfValid(fileIndex + df * i, rankIndex + dr * i)) {
          break
        }
      }
    }
  }

  private static addQueenMoves(
    fileIndex: number,
    rankIndex: number,
    addMoveIfValid: (f: number, r: number) => boolean,
  ) {
    // Combination of rook and bishop moves
    this.addRookMoves(fileIndex, rankIndex, addMoveIfValid)
    this.addBishopMoves(fileIndex, rankIndex, addMoveIfValid)
  }

  private static addKingMoves(fileIndex: number, rankIndex: number, addMoveIfValid: (f: number, r: number) => boolean) {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]
    for (const [df, dr] of directions) {
      addMoveIfValid(fileIndex + df, rankIndex + dr)
    }
  }

  private static addKnightMoves(
    fileIndex: number,
    rankIndex: number,
    addMoveIfValid: (f: number, r: number) => boolean,
  ) {
    const moves = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ]
    for (const [df, dr] of moves) {
      addMoveIfValid(fileIndex + df, rankIndex + dr)
    }
  }
}
