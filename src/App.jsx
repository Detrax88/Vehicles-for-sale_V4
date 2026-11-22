import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import useTheme from './contexts/useTheme.js'
import Favorites from './pages/Favorites.jsx'
import {Route, Routes} from 'react-router-dom'
import "./index.css";
import LoginButton from "./components/LoginButton";
import RegisterButton from "./components/RegisterButton";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";



export default function App() {
  
  const { theme, toggleTheme } = useTheme();
  const handleLogin = () => console.log("Bejelentkezés kattintás");
  const handleRegister = () => console.log("Regisztráció kattintás");

   

  return (
    <>
      <div style={{ display: "flex", gap: "0.75rem" }}>
      <LoginButton onClick={handleLogin} />
      <RegisterButton onClick={handleRegister} />
    </div>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        </Routes>
      </main>
       </>
  )
}

