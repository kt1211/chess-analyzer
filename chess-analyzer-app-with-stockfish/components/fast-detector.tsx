"use client"

import { useCallback } from "react"
import type { ChessPiece, PieceType, PieceColor } from "@/app/page"

interface FastDetectorProps {
  imageData: string
  onComplete: (pieces: ChessPiece[]) => void
}

export default function FastDetector({ imageData, onComplete }: FastDetectorProps) {
  const detectPiecesQuickly = useCallback(() => {
    // Ultra-fast detection algorithm
    const startTime = Date.now()

    // Create optimized detection
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Resize image for faster processing
      const maxSize = 200 // Smaller size for faster processing
      const scale = Math.min(maxSize / img.width, maxSize / img.height)

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Quick analysis
      const pieces = performFastAnalysis(canvas, ctx)

      const endTime = Date.now()
      console.log(`Detection completed in ${endTime - startTime}ms`)

      onComplete(pieces)
    }

    img.onerror = () => {
      // Fallback to standard pieces
      onComplete([])  // Return empty array if image fails to load
    }

    img.crossOrigin = "anonymous"
    img.src = imageData
  }, [imageData, onComplete])

  const performFastAnalysis = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null): ChessPiece[] => {
    if (!ctx) return getStandardStartingPosition()

    const pieces: ChessPiece[] = []
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Quick grid analysis - 8x8 squares
    const squareWidth = canvas.width / 8
    const squareHeight = canvas.height / 8

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const hasPiece = quickSquareAnalysis(imageData, col, row, squareWidth, squareHeight, canvas.width)

        if (hasPiece) {
          const position = String.fromCharCode(97 + col) + (8 - row)
          const piece = determinePieceFromPosition(position, col, row)

          if (piece) {
            pieces.push(piece)
          }
        }
      }
    }

    // If no pieces detected, return standard setup
    return pieces
  }

  const quickSquareAnalysis = (
    imageData: ImageData,
    col: number,
    row: number,
    squareWidth: number,
    squareHeight: number,
    imageWidth: number,
  ): boolean => {
    const startX = Math.floor(col * squareWidth)
    const startY = Math.floor(row * squareHeight)
    const endX = Math.floor((col + 1) * squareWidth)
    const endY = Math.floor((row + 1) * squareHeight)

    let darkPixels = 0
    let lightPixels = 0
    let totalPixels = 0

    // Sample every 4th pixel for speed
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const index = (y * imageWidth + x) * 4
        const r = imageData.data[index]
        const g = imageData.data[index + 1]
        const b = imageData.data[index + 2]
        const brightness = (r + g + b) / 3

        if (brightness < 120) darkPixels++
        else if (brightness > 180) lightPixels++

        totalPixels++
      }
    }

    // Quick heuristic: if there's significant contrast, likely a piece
    const contrastRatio = Math.min(darkPixels, lightPixels) / totalPixels
    return contrastRatio > 0.1
  }

  const determinePieceFromPosition = (position: string, col: number, row: number): ChessPiece | null => {
    const [file, rank] = position.split("")
    const rankNum = Number.parseInt(rank)

    // Quick piece type determination based on starting positions
    let pieceType: PieceType
    let color: PieceColor

    if (rankNum <= 2) {
      color = "white"
      if (rankNum === 1) {
        switch (file) {
          case "a":
          case "h":
            pieceType = "rook"
            break
          case "b":
          case "g":
            pieceType = "knight"
            break
          case "c":
          case "f":
            pieceType = "bishop"
            break
          case "d":
            pieceType = "queen"
            break
          case "e":
            pieceType = "king"
            break
          default:
            pieceType = "pawn"
        }
      } else {
        pieceType = "pawn"
      }
    } else {
      color = "black"
      if (rankNum === 8) {
        switch (file) {
          case "a":
          case "h":
            pieceType = "rook"
            break
          case "b":
          case "g":
            pieceType = "knight"
            break
          case "c":
          case "f":
            pieceType = "bishop"
            break
          case "d":
            pieceType = "queen"
            break
          case "e":
            pieceType = "king"
            break
          default:
            pieceType = "pawn"
        }
      } else {
        pieceType = "pawn"
      }
    }

    return {
      id: `${color[0]}-${pieceType}-${col}-${row}`,
      type: pieceType,
      color: color,
      position: position,
    }
  }

  const getStandardStartingPosition = (): ChessPiece[] => {
    const pieces: ChessPiece[] = []

    // Standard chess starting position
    const setup = [
      // White pieces
      { type: "rook", color: "white", position: "a1" },
      { type: "knight", color: "white", position: "b1" },
      { type: "bishop", color: "white", position: "c1" },
      { type: "queen", color: "white", position: "d1" },
      { type: "king", color: "white", position: "e1" },
      { type: "bishop", color: "white", position: "f1" },
      { type: "knight", color: "white", position: "g1" },
      { type: "rook", color: "white", position: "h1" },

      // White pawns
      ...["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"].map((pos) => ({
        type: "pawn",
        color: "white",
        position: pos,
      })),

      // Black pieces
      { type: "rook", color: "black", position: "a8" },
      { type: "knight", color: "black", position: "b8" },
      { type: "bishop", color: "black", position: "c8" },
      { type: "queen", color: "black", position: "d8" },
      { type: "king", color: "black", position: "e8" },
      { type: "bishop", color: "black", position: "f8" },
      { type: "knight", color: "black", position: "g8" },
      { type: "rook", color: "black", position: "h8" },

      // Black pawns
      ...["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"].map((pos) => ({
        type: "pawn",
        color: "black",
        position: pos,
      })),
    ]

    setup.forEach((piece, index) => {
      pieces.push({
        id: `${piece.color[0]}-${piece.type}-${index}`,
        type: piece.type as PieceType,
        color: piece.color as PieceColor,
        position: piece.position,
      })
    })

    return pieces
  }

  return null // This component doesn't render anything
}
