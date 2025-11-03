import { useState } from "react";

const P1 = "Aaryan";
const P2 = "Pradeep";

function Square({ value, onClick, disabled, highlight }) {
  const baseStyle =
    value === P1
      ? { backgroundColor: "#d0e8ff", color: "#004c99" }
      : value === P2
      ? { backgroundColor: "#ffe0e0", color: "#990000" }
      : { backgroundColor: "white", color: "black" };

  const style = {
    width: 75,
    height: 60,
    fontSize: 14,
    marginRight: 6,
    marginBottom: 6,
    whiteSpace: "nowrap",
    border: "1px solid #999",
    borderRadius: 6,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: highlight ? "0 0 10px 3px gold" : "none", // highlight winning boxes
    ...baseStyle,
  };

  return (
    <button
      className="square"
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, isFrozen }) {
  function handleClick(i) {
    if (isFrozen || squares[i] || calculateWinner(squares)) return;
    const next = squares.slice();
    next[i] = nextTurn(next);
    onPlay(next);
  }

  const { winner, line } = calculateWinner(squares);
  const full = squares.every(Boolean);

  const status = winner
    ? `🏆 Winner: ${winner}`
    : full
    ? "It's a Draw!"
    : `Next player: ${nextTurn(squares)}`;

  return (
    <div>
      <div style={{ marginBottom: 10, fontSize: 18, fontWeight: "bold" }}>{status}</div>
      {[0, 3, 6].map((r) => (
        <div key={r} style={{ display: "flex" }}>
          <Square value={squares[r]} onClick={() => handleClick(r)} disabled={isFrozen} highlight={line?.includes(r)} />
          <Square value={squares[r + 1]} onClick={() => handleClick(r + 1)} disabled={isFrozen} highlight={line?.includes(r + 1)} />
          <Square value={squares[r + 2]} onClick={() => handleClick(r + 2)} disabled={isFrozen} highlight={line?.includes(r + 2)} />
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  const { winner } = calculateWinner(currentSquares);
  const draw = !winner && currentSquares.every(Boolean);
  const frozen = Boolean(winner || draw);

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
        <Board squares={currentSquares} onPlay={handlePlay} isFrozen={frozen} />
        <button onClick={reset} style={{ marginTop: 8, padding: "6px 12px", borderRadius: 4 }}>
          Reset
        </button>
      </div>
      <ol>{moves}</ol>
    </div>
  );
}

function nextTurn(arr) {
  const aCount = arr.filter((v) => v === P1).length;
  const pCount = arr.filter((v) => v === P2).length;
  return aCount === pCount ? P1 : P2;
}

function calculateWinner(sq) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c])
      return { winner: sq[a], line: [a, b, c] };
  }
  return { winner: null, line: null };
}
