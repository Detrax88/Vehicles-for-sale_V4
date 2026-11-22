import "../css/RegisterButton.css";
import { Link } from "react-router-dom";

export default function RegisterButton() {
  return (
    <Link to="/register" className="register-button">
      Regisztráció
    </Link>
  );
}