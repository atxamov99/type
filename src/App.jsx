import React, { useState, useRef, useEffect } from "react";

const wordList = [
  "little", "know", "down", "point", "all", "get", "end",
  "between", "then", "life", "make", "number", "word", "time",
  "good", "long", "small", "place", "again", "after", "man",
  "work", "day", "hand", "new", "first", "house", "right",
  "look", "back", "give", "think", "eye", "head", "world",
  "school", "group", "story", "family", "night", "child",
  "water", "woman", "light", "city", "country", "problem", "part"
];

const App = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [mode, setMode] = useState(10); // so'z soni: 10, 25, 50
  const [timeLeft, setTimeLeft] = useState(30); // 30 sekund
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Boshlang‘ich sozlama
  useEffect(() => {
    restartGame();
  }, [mode]);

  // Taymer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setIsActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const handleKeyDown = (e) => {
    if (!isActive || isFinished) return;

    if (e.key === " ") {
      e.preventDefault();
      const isCorrect = currentInput.trim() === words[currentWordIndex];
      if (isCorrect) setCorrectCount((prev) => prev + 1);

      setCurrentWordIndex((prev) => prev + 1);
      setCurrentInput("");
    } else if (e.key === "Backspace") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setCurrentInput((prev) => prev + e.key);
    }
  };

  const startGame = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(30);
    setCorrectCount(0);
    setCurrentWordIndex(0);
    setCurrentInput("");
    if (containerRef.current) containerRef.current.focus();
  };

  const restartGame = () => {
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    setWords(shuffled.slice(0, mode));
    setTimeLeft(30);
    setIsFinished(false);
    setIsActive(false);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCorrectCount(0);
  };

  return (
    <div
      ref={containerRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-purple-400 p-8 font-mono text-2xl focus:outline-none"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-300">Typing Trainer</h1>

      {/* Rejim tanlash */}
      <div className="mb-4 flex gap-4">
        {[10, 25, 50].map((n) => (
          <button
            key={n}
            onClick={() => setMode(n)}
            className={`px-4 py-2 rounded-lg ${
              mode === n ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {n} so‘z
          </button>
        ))}
      </div>

      {/* Taymer */}
      <div className="mb-4 text-lg">
        ⏱ {timeLeft}s
      </div>

      {/* So'zlar */}
      {!isFinished ? (
        <>
          <p className="mb-2 text-lg">
            {currentWordIndex + 1}/{words.length}
          </p>
          <div className="flex flex-wrap gap-4 max-w-5xl leading-relaxed text-left">
            {words.map((word, wordIndex) => {
              const letters = word.split("");
              const isCurrentWord = wordIndex === currentWordIndex;

              return (
                <span key={wordIndex}>
                  {letters.map((char, charIndex) => {
                    let color = "text-purple-400";

                    if (isCurrentWord) {
                      if (charIndex < currentInput.length) {
                        color =
                          currentInput[charIndex] === char
                            ? "text-green-400"
                            : "text-red-500";
                      } else if (charIndex === currentInput.length) {
                        color = "bg-purple-600 text-white rounded-sm";
                      }
                    } else if (wordIndex < currentWordIndex) {
                      color = "text-gray-500";
                    }

                    return (
                      <span key={charIndex} className={`${color}`}>
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        </>
      ) : (
        // Natija
        <div className="text-center">
          <p className="text-2xl mb-4">⏹ Mashq tugadi!</p>
          <p className="text-green-400 text-xl mb-2">
            To‘g‘ri yozilgan so‘zlar: <span className="font-bold">{correctCount}</span>
          </p>
          <p className="text-purple-400 text-xl">
            Umumiy so‘zlar: {words.length}
          </p>
        </div>
      )}

      {/* Tugmalar */}
      <div className="mt-8 flex gap-4">
        {!isActive && !isFinished && (
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            ▶ Start
          </button>
        )}
        <button
          onClick={restartGame}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          🔁 Restart
        </button>
      </div>
    </div>
  );
};

export default App;