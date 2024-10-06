import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generate } from 'random-words';
import { RefreshCw } from 'lucide-react';
import styles from './TypingScreen.module.css';


/*
    

*/
const WORDS_PER_LINE = 15;
const INITIAL_TIME = 15;

const useTimer = (initialTime, isRunning, onReset) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const intervalRef = useRef(null);
  
    useEffect(() => {
      if (!isRunning) {
        return;
      }
  
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isRunning]);
  
    const resetTimer = useCallback(() => {
      setTimeLeft(initialTime);
      if (onReset) onReset();
    }, [initialTime, onReset]);
  
    return [timeLeft, resetTimer];
};
    
const TypingScreen = () => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [letterStates, setLetterStates] = useState([]);
    const [wordStates, setWordStates] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [wordsPerLine, setWordsPerLine] = useState(10);
    const [typedWords, setTypedWords] = useState([])
    const [gameOver, setGameOver] = useState(false);
    const [gameStats, setGameStats] = useState({
        wpm: 0,
        accuracy: 0,
        totalWords: 0,
        correctWords: 0,
        incorrectWords: 0
      });
    const typingScreenRef = useRef(null);
    const cursorRef = useRef(null);
    const containerRef = useRef(null);

    const resetGame = useCallback(() => {
        setGameStarted(false);
        setCurrentWordIndex(0);
        setCurrentLetterIndex(0);
        setCurrentLineIndex(0);
        setUserInput('');
        setTypedWords([]);
        loadWords();
    }, []);

    

    const [timeLeft, resetTimer] = useTimer(INITIAL_TIME, gameStarted, resetGame);

    const loadWords = useCallback(() => {
        const generatedWords = generate(600);
        setWords(generatedWords);
        setLetterStates(generatedWords.map(word => Array(word.length).fill('default')));
        setWordStates(generatedWords.map(() => 'default'));
    }, []);

    useEffect(() => {
        loadWords();
    }, [loadWords]);

    useEffect(() => {
        if (timeLeft === 0) {
          setGameStarted(false);
          setGameOver(true);
          calculateGameStats();
        }
      }, [timeLeft]);
    
    const calculateWordsPerLine = useCallback(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const wordWidth = 100; // Approximate width of a word in pixels
            const newWordsPerLine = Math.floor(containerWidth / wordWidth);
            setWordsPerLine(Math.max(newWordsPerLine, 1)); // Ensure at least 1 word per line
        }
    }, []);

    useEffect(() => {
        calculateWordsPerLine();
        window.addEventListener('resize', calculateWordsPerLine);
        return () => window.removeEventListener('resize', calculateWordsPerLine);
    }, [calculateWordsPerLine]);

    const calculateGameStats = () => {
        const totalWords = typedWords.length;
        const correctWords = typedWords.filter(word => word.correct).length;
        const incorrectWords = totalWords - correctWords;
        const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;
        const wpm = (totalWords / (INITIAL_TIME / 60))
    
        setGameStats({
          wpm: Math.round(wpm),
          accuracy: accuracy.toFixed(2),
          totalWords,
          correctWords,
          incorrectWords
        });
      };

    const moveCursor = useCallback(() => {
        const currentWord = words[currentWordIndex];
        if (!currentWord || !isFocused) return;

        const wordElement = document.querySelector(`.${styles['active-word']}`);
        const cursor = cursorRef.current;
        
        if (wordElement && cursor && typingScreenRef.current) {
            const letters = wordElement.querySelectorAll(`.${styles.letter}`);
            const letterElement = letters[currentLetterIndex] || letters[letters.length - 1];
            const rect = letterElement.getBoundingClientRect();
            const containerRect = typingScreenRef.current.getBoundingClientRect();
            
            cursor.style.left = `${rect.left - containerRect.left + (currentLetterIndex >= currentWord.length ? rect.width : 0)}px`;
            cursor.style.top = `${rect.top - containerRect.top}px`;
        }
    }, [currentWordIndex, currentLetterIndex, words, isFocused]);

    useEffect(() => {
        if (isFocused) {
            moveCursor();
        }
    }, [isFocused, moveCursor]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (typingScreenRef.current) {
                typingScreenRef.current.blur();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!gameStarted && userInput.length > 0) {
            setGameStarted(true);
        }
    }, [gameStarted, userInput]);
    const handleKeyDown = useCallback((event) => {

        if (!gameStarted) {
            setGameStarted(true);
          }
                  
        const currentWord = words[currentWordIndex];
        
        if (event.key === 'Backspace' && currentLetterIndex > 0) {
            setCurrentLetterIndex(prevIndex => prevIndex - 1);
            setUserInput(prevInput => prevInput.slice(0, -1));
            setLetterStates(prevStates => {
                const newStates = [...prevStates];
                newStates[currentWordIndex][currentLetterIndex - 1] = 'default';
                return newStates;
            });
            // Reset word state to default when backspacing
            setWordStates(prevStates => {
                const newStates = [...prevStates];
                newStates[currentWordIndex] = 'default';
                return newStates;
            });
        } else if (event.key === ' ') {
            if (currentLetterIndex > 0) {
                const isWordCorrect = userInput === currentWord;
                setWordStates(prevStates => {
                    const newStates = [...prevStates];
                    newStates[currentWordIndex] = isWordCorrect ? 'correct-word' : 'incorrect-word';
                    return newStates;
                });

                setTypedWords(prevTypedWords => [...prevTypedWords, {
                    word: userInput,
                    correct: isWordCorrect
                }]);
                console.log(`Word ${currentWordIndex} completed. Correct: ${isWordCorrect}`);

                const nextWordIndex = currentWordIndex + 1;
                setCurrentWordIndex(nextWordIndex);
                setCurrentLetterIndex(0);
                setUserInput('');
                
                if (nextWordIndex % WORDS_PER_LINE === 0 && nextWordIndex < words.length) {
                    setCurrentLineIndex(prevLineIndex => prevLineIndex + 1);
                }
            }
        } else if (event.key.length === 1) { 
            if (currentLetterIndex < currentWord.length) {
                const isCorrect = event.key === currentWord[currentLetterIndex];
                setLetterStates(prevStates => {
                    const newStates = [...prevStates];
                    newStates[currentWordIndex][currentLetterIndex] = isCorrect ? 'correct-letter' : 'incorrect-letter';
                    return newStates;
                });
                setCurrentLetterIndex(prevIndex => prevIndex + 1);
                setUserInput(prevInput => prevInput + event.key);

                if (!isCorrect) {
                    setWordStates(prevStates => {
                        const newStates = [...prevStates];
                        newStates[currentWordIndex] = 'incorrect-word';
                        return newStates;
                    });
                }
            }
        }
    }, [gameStarted, currentWordIndex, currentLetterIndex, words, userInput, WORDS_PER_LINE]);

    useEffect(() => {
        if (isFocused) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFocused, handleKeyDown]);

    const renderWords = useCallback(() => {
        const lines = [];
        for (let i = 0; i < words.length; i += wordsPerLine) {
            const lineWords = words.slice(i, i + wordsPerLine);
            const lineIndex = i / wordsPerLine;
            const isLastLine = i + wordsPerLine >= words.length;
            
            lines.push(
                <div key={lineIndex} className={`${styles.line} ${isLastLine ? styles.lastLine : ''}`}>
                    {lineWords.map((word, wordIndex) => {
                        const globalWordIndex = i + wordIndex;
                        const wordState = wordStates[globalWordIndex];
                        return (
                            <span
                                key={globalWordIndex}
                                className={`${styles.word} 
                                    ${globalWordIndex === currentWordIndex ? styles['active-word'] : ''}
                                    ${styles[wordState]}`}
                            >
                                {word.split('').map((letter, letterIndex) => (
                                    <span
                                        key={letterIndex}
                                        className={`${styles.letter} 
                                            ${globalWordIndex === currentWordIndex && letterIndex === currentLetterIndex
                                                ? styles['active-letter'] : ''}
                                            ${styles[letterStates[globalWordIndex][letterIndex]]}`}
                                    >
                                        {letter}
                                    </span>
                                ))}
                                <span className={styles.space}>&nbsp;</span>
                            </span>
                        );
                    })}
                </div>
            );
        }
        return lines;
    }, [words, currentWordIndex, currentLetterIndex, letterStates, wordStates, wordsPerLine]);

    const handleRefresh = useCallback(() => {
        resetTimer();
        resetGame();
        setGameOver(false);

        if (typingScreenRef.current) {
            typingScreenRef.current.focus();
        }
    }, [resetTimer, resetGame]);
    
    const renderGameStats = () => (
        <div className={styles.gameStats}>
          <h2>Game Over! Here are your results:</h2>
          <ul>
            <li>WPM: {gameStats.wpm}</li>
            <li>Accuracy: {gameStats.accuracy}%</li>
            <li>Total Words: {gameStats.totalWords}</li>
            <li>Correct Words: {gameStats.correctWords}</li>
            <li>Incorrect Words: {gameStats.incorrectWords}</li>
          </ul>

        </div>
      );

    return (
    <div className={styles.typingScreen} 
         tabIndex="0"
         onFocus={handleFocus}
         onBlur={handleBlur}
         ref={typingScreenRef}>
      <div className={styles.header}>
        {!gameOver && <div className={styles.seconds}>{timeLeft}</div>}
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <RefreshCw size={24} />
        </button>
      </div>
      {!gameOver ? (
        <>
          <div className={styles.wordsContainer} ref={containerRef}>
            {renderWords().slice(currentLineIndex, currentLineIndex + 3)}
          </div>
          {isFocused && <div className={styles.cursor} ref={cursorRef}></div>}
          {!isFocused && <div className={styles.focusError}>Click Here to Type</div>}
        </>
      ) : renderGameStats()}
    </div>
  );
};

export default TypingScreen;