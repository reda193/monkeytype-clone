import logo from './assets/images/logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TypingScreen from './screens/TypingScreen';
import Header from './screens/Header';
import Navigation from './screens/Navigation';
import Home from './screens/TypingScreen';
import Register from './screens/Register'
import React, { useState, useRef } from 'react';

const App = () => {
  const [selectedTime, setSelectedTime] = useState('30');
  const typingScreenRef = useRef(null);
  const [gameMode, setGameMode] = useState('time');
  const [targetWordCount, setTargetWordCount] = useState(10);
  const [selected, setSelected] = useState({
      words: false,
      punctuation: false,
      numbers: false,
      sentences: false
  });

  // Modified to ensure proper time setting
  const handleTimeChange = (time) => {
      setSelectedTime(time);
      setGameMode('time');
      // Force refresh when time changes
      if (typingScreenRef.current) {
          const refreshButton = typingScreenRef.current.querySelector('.refreshButton');
          if (refreshButton) {
              refreshButton.click();
          }
      }
  };

  const handleWordCountChange = (count) => {
      setTargetWordCount(parseInt(count));
      setGameMode('words');
      // Force refresh when word count changes
      if (typingScreenRef.current) {
          const refreshButton = typingScreenRef.current.querySelector('.refreshButton');
          if (refreshButton) {
              refreshButton.click();
          }
      }
  };

  const handleModeChange = (mode) => {
      setGameMode(mode);
  };

  const handleOptionsChange = (newOptions) => {
      setSelected(newOptions);
      // Force refresh when options change
      if (typingScreenRef.current) {
          const refreshButton = typingScreenRef.current.querySelector('.refreshButton');
          if (refreshButton) {
              refreshButton.click();
          }
      }
  };

  return (
    <Router>
      <div className="app-container">
          <div className="content-wrapper">
              <Header />
              <div className="navigation-wrapper">
                  <Navigation
                      onTimeChange={handleTimeChange}
                      onModeChange={handleModeChange}
                      onWordCountChange={handleWordCountChange}
                      onOptionsChange={handleOptionsChange}
                      selected={selected}
                      currentTime={selectedTime}
                      currentWordCount={targetWordCount}
                      gameMode={gameMode}
                  />
              </div>
              <TypingScreen
                  ref={typingScreenRef}
                  initialTime={parseInt(selectedTime)}
                  gameMode={gameMode}
                  targetWordCount={targetWordCount}
                  selected={selected}
              />
              <Routes>
                <Route path="/" elemenbt={<Home />} />
                <Route path="/register" element={<Register />} />
              </Routes>
          </div>
      </div>
    </Router>
  );
};

export default App;