import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../css/Login.css";

const EMPTY_FORM = {
  email: "",
  password: "",
};

export default function Login() {
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

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Adj meg egy érvényes e-mail címet.";
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
        email: form.email,
        password: form.password,
      });

      if (ok) {
        // A backend válaszától függően: DRF token ("token") vagy JWT ("access")
        const token = data.token || data.access;
        if (token) {
          localStorage.setItem("token", token);
        }
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }
        navigate("/");
        return;
      }

      if (status === 400 || status === 401) {
        const message =
          data.detail ||
          (Array.isArray(data.non_field_errors) && data.non_field_errors.join(" ")) ||
          "Hibás e-mail cím vagy jelszó.";
        setServerError(message);
      } else {
        setServerError(data.detail || "A bejelentkezés sikertelen. Próbáld újra.");
      }
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

        <label htmlFor="login-email">E-mail cím</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

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