import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import useTheme from './contexts/useTheme.js'
import Favorites from './pages/Favorites.jsx'
import {Route, Routes, useNavigate} from 'react-router-dom'
import "./index.css";
import LoginButton from "./components/LoginButton";
import RegisterButton from "./components/RegisterButton";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from './contexts/AuthContext.jsx'



export default function App() {
  
  const { theme, toggleTheme } = useTheme();
  //const handleLogin = () => console.log("Bejelentkezés kattintás");
  //const handleRegister = () => console.log("Regisztráció kattintás");
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

   

  return (
    <>
      <header style={{ 
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem",}}
        >
        {isLoggedIn ? (
          <> 
          <span>
        Bejelentkezve: <strong>{username}</strong>
      </span>
      <button type="button" className="login-button" onClick={handleLogout}>
        Kijelentkezés
      </button>
        </>
        ) : (
        <>
      <LoginButton />
      <RegisterButton />
    </>
            )}
            </header>
    <div className="card-day-night">
      
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
  );
}
