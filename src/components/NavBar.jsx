import {Link} from "react-router-dom";
//import './NavBar.css';



function NavBar() {
    return (
        <>
        <nav className="navBar">
            <div className="navbar-logo">
                <h1>Vehicles for Sale</h1>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home </Link>
                <Link to="/favorites" className="nav-link">Favorites </Link>
                <Link to="/about" className="nav-link">About </Link>
            </div>
        </nav>
        </>

        )
        }
    export default NavBar;