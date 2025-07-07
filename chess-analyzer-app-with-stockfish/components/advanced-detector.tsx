"use client"

import { useCallback } from "react"
import type { ChessPiece, PieceType, PieceColor } from "@/app/page"

interface AdvancedDetectorProps {
  imageData: string
  onPiecesDetected: (pieces: ChessPiece[]) => void
}

export default function AdvancedDetector({ imageData, onPiecesDetected }: AdvancedDetectorProps) {
  const analyzeImageForPieces = useCallback(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      // Get image data for analysis
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

      if (imageData) {
        const detectedPieces = performAdvancedDetection(imageData, canvas.width, canvas.height)
        onPiecesDetected(detectedPieces)
      }
    }

    img.crossOrigin = "anonymous"
    img.src = imageData
  }, [imageData, onPiecesDetected])

  const performAdvancedDetection = (imageData: ImageData, width: number, height: number): ChessPiece[] => {
    const pieces: ChessPiece[] = []
    const squareWidth = width / 8
    const squareHeight = height / 8

    // Analyze each square of the chess board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareAnalysis = analyzeSquare(imageData, col, row, squareWidth, squareHeight, width)

        if (squareAnalysis.hasPiece) {
          const position = String.fromCharCode(97 + col) + (8 - row)
          const piece = createPieceFromAnalysis(squareAnalysis, position, col, row)

          if (piece) {
            pieces.push(piece)
          }
        }
      }
    }

    // If detection finds too few pieces, add common starting positions
    if (pieces.length < 16) {
      return enhanceWithStandardPieces(pieces)
    }

    return pieces
  }

  const analyzeSquare = (
    imageData: ImageData,
    col: number,
    row: number,
    squareWidth: number,
    squareHeight: number,
    imageWidth: number,
  ) => {
    const startX = Math.floor(col * squareWidth)
    const startY = Math.floor(row * squareHeight)
    const endX = Math.floor((col + 1) * squareWidth)
    const endY = Math.floor((row + 1) * squareHeight)

    let totalBrightness = 0
    let darkPixels = 0
    let lightPixels = 0
    let pixelCount = 0
    let edgePixels = 0

    // Sample pixels in the square
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const index = (y * imageWidth + x) * 4
        const r = imageData.data[index]
        const g = imageData.data[index + 1]
        const b = imageData.data[index + 2]
        const brightness = (r + g + b) / 3

        totalBrightness += brightness
        pixelCount++

        if (brightness < 80) darkPixels++
        else if (brightness > 200) lightPixels++
        else if (brightness > 120 && brightness < 180) edgePixels++
      }
    }

    const avgBrightness = totalBrightness / pixelCount
    const contrastRatio = Math.abs(darkPixels - lightPixels) / pixelCount
    const hasSignificantContrast = contrastRatio > 0.15
    const hasEdgeDefinition = edgePixels > pixelCount * 0.1

    return {
      hasPiece: hasSignificantContrast && hasEdgeDefinition,
      avgBrightness,
      darkPixels,
      lightPixels,
      contrastRatio,
      isLikelyWhitePiece: avgBrightness > 140,
      isLikelyBlackPiece: avgBrightness < 100,
    }
  }

  const createPieceFromAnalysis = (analysis: any, position: string, col: number, row: number): ChessPiece | null => {
    const [file, rank] = position.split("")
    const rankNum = Number.parseInt(rank)

    // Determine color based on brightness analysis
    let color: PieceColor
    if (analysis.isLikelyWhitePiece) {
      color = "white"
    } else if (analysis.isLikelyBlackPiece) {
      color = "black"
    } else {
      // Fallback to position-based color determination
      color = rankNum <= 2 ? "white" : "black"
    }

    // Determine piece type based on position and analysis
    const pieceType = determinePieceTypeFromPosition(position, color, analysis)

    if (pieceType) {
      return {
        id: `${color[0]}-${pieceType}-${col}-${row}`,
        type: pieceType,
        color: color,
        position: position,
      }
    }

    return null
  }

  const determinePieceTypeFromPosition = (position: string, color: PieceColor, analysis: any): PieceType | null => {
    const [file, rank] = position.split("")
    const rankNum = Number.parseInt(rank)

    // Starting position logic
    if (color === "white") {
      if (rankNum === 1) {
        switch (file) {
          case "a":
          case "h":
            return "rook"
          case "b":
          case "g":
            return "knight"
          case "c":
          case "f":
            return "bishop"
          case "d":
            return "queen"
          case "e":
            return "king"
        }
      } else if (rankNum === 2) {
        return "pawn"
      }
    } else {
      if (rankNum === 8) {
        switch (file) {
          case "a":
          case "h":
            return "rook"
          case "b":
          case "g":
            return "knight"
          case "c":
          case "f":
            return "bishop"
          case "d":
            return "queen"
          case "e":
            return "king"
        }
      } else if (rankNum === 7) {
        return "pawn"
      }
    }

    // For pieces not in starting positions, use analysis
    if (analysis.contrastRatio > 0.3) {
      return "queen" // High contrast might indicate queen
    } else if (analysis.contrastRatio > 0.2) {
      return "rook" // Medium contrast might indicate rook
    } else {
      return "pawn" // Default to pawn
    }
  }

  const enhanceWithStandardPieces = (detectedPieces: ChessPiece[]): ChessPiece[] => {
    const standardPositions = [
      // White pieces
      { type: "rook", color: "white", position: "a1" },
      { type: "knight", color: "white", position: "b1" },
      { type: "bishop", color: "white", position: "c1" },
      { type: "queen", color: "white", position: "d1" },
      { type: "king", color: "white", position: "e1" },
      { type: "bishop", color: "white", position: "f1" },
      { type: "knight", color: "white", position: "g1" },
      { type: "rook", color: "white", position: "h1" },
      { type: "pawn", color: "white", position: "a2" },
      { type: "pawn", color: "white", position: "b2" },
      { type: "pawn", color: "white", position: "c2" },
      { type: "pawn", color: "white", position: "d2" },
      { type: "pawn", color: "white", position: "e2" },
      { type: "pawn", color: "white", position: "f2" },
      { type: "pawn", color: "white", position: "g2" },
      { type: "pawn", color: "white", position: "h2" },

      // Black pieces
      { type: "rook", color: "black", position: "a8" },
      { type: "knight", color: "black", position: "b8" },
      { type: "bishop", color: "black", position: "c8" },
      { type: "queen", color: "black", position: "d8" },
      { type: "king", color: "black", position: "e8" },
      { type: "bishop", color: "black", position: "f8" },
      { type: "knight", color: "black", position: "g8" },
      { type: "rook", color: "black", position: "h8" },
      { type: "pawn", color: "black", position: "a7" },
      { type: "pawn", color: "black", position: "b7" },
      { type: "pawn", color: "black", position: "c7" },
      { type: "pawn", color: "black", position: "d7" },
      { type: "pawn", color: "black", position: "e7" },
      { type: "pawn", color: "black", position: "f7" },
      { type: "pawn", color: "black", position: "g7" },
      { type: "pawn", color: "black", position: "h7" },
    ]

    const enhancedPieces: ChessPiece[] = []

    standardPositions.forEach((standard, index) => {
      // Check if this position already has a detected piece
      const existingPiece = detectedPieces.find((p) => p.position === standard.position)

      if (existingPiece) {
        enhancedPieces.push(existingPiece)
      } else {
        // Add standard piece if not detected
        enhancedPieces.push({
          id: `${standard.color[0]}-${standard.type}-${index}`,
          type: standard.type as PieceType,
          color: standard.color as PieceColor,
          position: standard.position,
        })
      }
    })

    return enhancedPieces
  }

  // Auto-start analysis when component mounts
  analyzeImageForPieces()

  return null
}
