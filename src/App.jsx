import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import useTheme from './contexts/useTheme.js'
import Favorites from './pages/Favorites.jsx'
import {Route, Routes} from 'react-router-dom'


export default function App() {
  
  const { theme, toggleTheme } = useTheme();
   

  return (
    <>
    <div className="card">
      
      <button onClick={toggleTheme}>
        {theme === "dark" ? "☀️ Nappali mód" : "🌙 Éjszakai mód"}
      </button>
    </div>
   
      
    <div className="NavBarDiv">
      <NavBar />
    
      </div>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites />} />
          
        </Routes>
      </main>
       </>
  )
}

