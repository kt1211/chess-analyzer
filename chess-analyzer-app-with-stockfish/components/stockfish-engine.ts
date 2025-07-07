
// stockfish-engine.ts
import Stockfish from "@stockfish/stockfish.wasm";

export const getBestMove = async (fen: string, depth: number = 12): Promise<string> => {
  return new Promise((resolve) => {
    const engine = Stockfish();
    let bestMove = "";

    engine.onmessage = (event: any) => {
      if (typeof event === "string") {
        if (event.includes("bestmove")) {
          const parts = event.split(" ");
          bestMove = parts[1];
          resolve(bestMove);
        }
      }
    };

    engine.postMessage("uci");
    setTimeout(() => {
      engine.postMessage("position fen " + fen);
      engine.postMessage("go depth " + depth);
    }, 500);
  });
};
