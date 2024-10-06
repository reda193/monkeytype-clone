import React from 'react'
import styles from './Header.module.css'
import { FaRegUser, FaCrown,FaInfo } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Header = () => {
  return (
    <div className={styles.header}>
    <div className={styles.headerLeft}>
        <h1>KusaTypes</h1>
        <IoMdSettings className={styles.icon} />
        <FaCrown className={styles.icon} />
        <FaInfo className={styles.icon} />
    </div>
    <div className={styles.headerRight}>
        <FaRegUser />
    </div>
</div>
  )
}

export default Header