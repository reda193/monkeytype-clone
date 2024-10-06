import React, { useState } from 'react';
import styles from './Navigation.module.css';
import { FaRegUser, FaCrown,FaInfo } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Navigation = () => {
  const [selected, setSelected] = useState({
    words: false,
    punctuation: false,
    numbers: false,
    sentences: false
  });
  const [timeOption, setTimeOption] = useState('15');
  const [wordOption, setWordOption] = useState('10');

  const handleSelect = (option) => {
    if (option === 'sentences') {
      setSelected({
        words: false,
        punctuation: false,
        numbers: false,
        sentences: true
      });
    } else {
      setSelected(prev => ({
        ...prev,
        [option]: !prev[option],
        sentences: false
      }));
    }
  };

  const handleTimeOption = (time) => {
    setTimeOption(time);
  };

  const handleWordOption = (word) => {
    setWordOption(word);
  };
    return (
    <div>
      <div className={styles.navigation}>
        {['words', 'punctuation', 'numbers', 'sentences'].map((option) => (
          <button 
            key={option}
            className={`${styles.option} ${selected[option] ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
        
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>{`time: ${timeOption}`}</button>
          <div className={styles.dropdownContent}>
            {['15', '30', '60'].map((time) => (
              <button key={time} onClick={() => handleTimeOption(time)}>{time}</button>
            ))}
          </div>
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>{`words: ${wordOption}`}</button>
          <div className={styles.dropdownContent}>
            {['10', '25', '50'].map((word) => (
              <button key={word} onClick={() => handleWordOption(word)}>{word}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;