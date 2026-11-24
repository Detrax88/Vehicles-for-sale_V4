import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../css/Login.css";
import { useAuth } from "../contexts/AuthContext";



const EMPTY_FORM = {
  username: "",
  password: "",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (form.username.trim().length === 0) {
      newErrors.username = "Add meg a felhasználóneved.";
    }

    if (form.password.length === 0) {
      newErrors.password = "Add meg a jelszavadat.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { ok, status, data } = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });

      if (ok) {
        // SimpleJWT: access + refresh token
        login(data.access, data.refresh, form.username.trim());
        navigate("/");
        return;
      }

      if (status === 401) {
        setServerError("Hibás felhasználónév vagy jelszó.");
        return;
      }

      // Egyéb hibák: a szerver tényleges üzenetének megjelenítése
      const messages = Object.entries(data).map(([key, value]) => {
        const text = Array.isArray(value) ? value.join(" ") : String(value);
        return key === "detail" ? text : `${key}: ${text}`;
      });

      setServerError(
        messages.length > 0
          ? messages.join(" ")
          : `A bejelentkezés sikertelen (${status}).`
      );
    } catch {
      setServerError("Nem sikerült kapcsolódni a szerverhez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h1>Bejelentkezés</h1>

        <label htmlFor="login-username">Felhasználónév</label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        <label htmlFor="login-password">Jelszó</label>
        <input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Jelszó megjelenítése
        </label>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Belépés..." : "Bejelentkezés"}
        </button>

        {serverError && <p className="error-text">{serverError}</p>}

        <p className="form-footer">
          Még nincs fiókod? <Link to="/register">Regisztrálj</Link>
        </p>
      </form>
    </div>
  );
}