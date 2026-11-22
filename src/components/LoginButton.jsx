import "../css/LoginButton.css";
import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
    <Link to="/login" className="login-button">
      Bejelentkezés
    </Link>
  );
}