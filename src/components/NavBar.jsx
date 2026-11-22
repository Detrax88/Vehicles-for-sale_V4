import {NavLink} from "react-router-dom";
import '../css/NavBar.css';



function NavBar() {
    return (
        <>
        <nav className="navBar">
            <div className="navbar-logo">
                <h1>Vehicles for Sale</h1>
            </div>
            <div className="navbar-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/favorites" className="nav-link">Favorites</NavLink>
                <NavLink to="/about" className="nav-link">About</NavLink>
            </div>
        </nav>
        </>

        )
        }
    export default NavBar;