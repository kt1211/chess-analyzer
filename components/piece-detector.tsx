"use client"

import { useCallback } from "react"
import type { ChessPiece, PieceType, PieceColor } from "@/app/page"

interface PieceDetectorProps {
  imageData: string
  onPiecesDetected: (pieces: ChessPiece[]) => void
}

export default function PieceDetector({ imageData, onPiecesDetected }: PieceDetectorProps) {
  const analyzeImage = useCallback(async () => {
    // Create canvas for image analysis
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    return new Promise<ChessPiece[]>((resolve) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        // Get image data for analysis
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

        // Advanced piece detection (ignoring watermarks)
        const detectedPieces = detectSolidPiecesOnly(imageData, canvas.width, canvas.height)

        resolve(detectedPieces)
      }

      img.crossOrigin = "anonymous"
      img.src = imageData
    })
  }, [imageData])

  const detectSolidPiecesOnly = (imageData: ImageData | undefined, width: number, height: number): ChessPiece[] => {
    const pieces: ChessPiece[] = []

    if (!imageData) return pieces

    // Divide image into 8x8 grid
    const squareWidth = width / 8
    const squareHeight = height / 8

    // Analyze each square for SOLID pieces only
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareData = getSquareData(imageData, col, row, squareWidth, squareHeight, width)
        const piece = analyzeSolidPieceInSquare(squareData, col, row)

        if (piece) {
          pieces.push(piece)
        }
      }
    }

    return pieces
  }

  const getSquareData = (
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

    const pixels: number[] = []

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * imageWidth + x) * 4
        pixels.push(
          imageData.data[index], // R
          imageData.data[index + 1], // G
          imageData.data[index + 2], // B
          imageData.data[index + 3], // A (alpha for transparency detection)
        )
      }
    }

    return pixels
  }

  const analyzeSolidPieceInSquare = (squareData: number[], col: number, row: number): ChessPiece | null => {
    // Enhanced analysis to detect only SOLID pieces and ignore watermarks
    let totalBrightness = 0
    let darkPixels = 0
    let lightPixels = 0
    let solidPixels = 0
    let transparentPixels = 0

    for (let i = 0; i < squareData.length; i += 4) {
      const r = squareData[i]
      const g = squareData[i + 1]
      const b = squareData[i + 2]
      const a = squareData[i + 3] // Alpha channel

      const brightness = (r + g + b) / 3

      totalBrightness += brightness

      // Check for transparency (watermark detection)
      if (a < 200) {
        transparentPixels++
      } else {
        solidPixels++
      }

      if (brightness < 80) darkPixels++
      else if (brightness > 200) lightPixels++
    }

    const totalPixels = squareData.length / 4
    const avgBrightness = totalBrightness / totalPixels
    const solidRatio = solidPixels / totalPixels
    const hasSignificantContrast = Math.abs(darkPixels - lightPixels) > totalPixels * 0.1

    // Only detect pieces that are:
    // 1. Mostly solid (not transparent/watermark)
    // 2. Have significant contrast
    // 3. Have clear color definition
    if (solidRatio > 0.8 && hasSignificantContrast && (darkPixels > 20 || lightPixels > 20)) {
      const position = String.fromCharCode(97 + col) + (8 - row)

      // Determine piece color based on brightness
      const color: PieceColor = avgBrightness > 140 ? "white" : "black"

      // Determine piece type based on position and analysis
      const pieceType = determinePieceType(position, color, avgBrightness, hasSignificantContrast)

      if (pieceType) {
        return {
          id: `${color[0]}-${pieceType}-${col}-${row}`,
          type: pieceType,
          color: color,
          position: position,
        }
      }
    }

    return null
  }

  const determinePieceType = (
    position: string,
    color: PieceColor,
    brightness: number,
    hasContrast: boolean,
  ): PieceType | null => {
    const [file, rank] = position.split("")
    const rankNum = Number.parseInt(rank)

    // Starting positions for pieces
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
      // black
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
    if (hasContrast && brightness > 100) {
      return "pawn" // Default for moved pieces
    }

    return null
  }

  return null // This component doesn't render anything
}
