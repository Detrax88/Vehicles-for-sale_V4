import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";
import { API_ENDPOINTS } from "../services/api";


const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  passwordAgain: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (form.username.trim().length < 3) {
      newErrors.username = "A felhasználónév legalább 3 karakter legyen.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Adj meg egy érvényes e-mail címet.";
    }

    if (form.password.length < 8) {
      newErrors.password = "A jelszó legalább 8 karakter legyen.";
    }

    if (form.passwordAgain !== form.password) {
      newErrors.passwordAgain = "A két jelszó nem egyezik.";
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
      const response = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setForm(EMPTY_FORM);
        // 1,5 másodperc után átirányítás a bejelentkezésre
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // A szerver hibaüzenetének kiolvasása
      let data = {};
      try {
        data = await response.json();
      } catch {
        // a válasz nem JSON
      }

      // Mezőnkénti hibák (pl. {"email": ["Ez az e-mail már foglalt."]})
      const fieldErrors = {};
      ["username", "email", "password"].forEach((field) => {
        if (data[field]) {
          fieldErrors[field] = Array.isArray(data[field])
            ? data[field].join(" ")
            : String(data[field]);
        }
      });

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setServerError(
          data.detail || data.message || "A regisztráció sikertelen. Próbáld újra."
        );
      }
    } catch {
      setServerError("Nem sikerült kapcsolódni a szerverhez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h1>Regisztráció</h1>

        <label htmlFor="username">Felhasználónév</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        <label htmlFor="email">E-mail cím</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label htmlFor="password">Jelszó</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <label htmlFor="passwordAgain">Jelszó újra</label>
        <input
          id="passwordAgain"
          name="passwordAgain"
          type="password"
          autoComplete="new-password"
          value={form.passwordAgain}
          onChange={handleChange}
          className={errors.passwordAgain ? "input-error" : ""}
        />
        {errors.passwordAgain && (
          <p className="error-text">{errors.passwordAgain}</p>
        )}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Küldés..." : "Regisztráció"}
        </button>

        {serverError && <p className="error-text">{serverError}</p>}
        {success && (
          <p className="success-text">
            Sikeres regisztráció! Átirányítás a bejelentkezéshez...
          </p>
        )}
      </form>
    </div>
  );
}