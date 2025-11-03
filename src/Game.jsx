// src/Game.jsx
import { useState } from "react";

function Square({ value, onClick }) {
  return (
    <button
      className="square"
      onClick={onClick}
      style={{ width: 60, height: 60, fontSize: 18, marginRight: 6, marginBottom: 6 }}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value ?? ""}
    </button>
  );
}

function Board({ squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const next = squares.slice();
    next[i] = nextTurn(next); // "Aaryan" or "Pradeep"
    onPlay(next);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${nextTurn(squares)}`;

  return (
    <div>
      <div style={{ marginBottom: 10 }}>{status}</div>
      {[0, 3, 6].map((r) => (
        <div key={r} style={{ display: "flex" }}>
          <Square value={squares[r]}   onClick={() => handleClick(r)} />
          <Square value={squares[r+1]} onClick={() => handleClick(r+1)} />
          <Square value={squares[r+2]} onClick={() => handleClick(r+2)} />
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move} style={{ marginBottom: 6 }}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div>
        <h1 style={{ marginTop: 0 }}>Lewis-Tac-Azure</h1>
        <Board squares={currentSquares} onPlay={handlePlay} />
        <button onClick={reset} style={{ marginTop: 8 }}>Reset</button>
      </div>
      <ol>{moves}</ol>
    </div>
  );
}

// "Aaryan" vs "Pradeep" turn logic
function nextTurn(arr) {
  const aCount = arr.filter((v) => v === "Aaryan").length;
  const pCount = arr.filter((v) => v === "Pradeep").length;
  return aCount === pCount ? "Aaryan" : "Pradeep";
}

function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
  }
  return null;
}
