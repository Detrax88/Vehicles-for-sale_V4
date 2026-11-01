import { useEffect, useState } from "react";
import { fetchCar } from "../services/api";
import { HAJTAS, VALTO, ft, datum } from "../services/utils";
import "../index.css";
import "../css/VehicleDetails.css";

function Plate({ value }) {
  return (
    <span className="plate" aria-label={`Rendszám: ${value}`}>
      <span className="plate-eu">H</span>
      <span className="plate-text">{value}</span>
    </span>
  );
}

// Egy autó részletes adatai felugró ablakban (/des/<id>/ – SerDes)
 export function VehicleDetails({ id, onClose }) {
  const [car, setCar] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setCar(null);
    setErr("");
    fetchCar(id, ctrl.signal)
      .then(setCar)
      .catch((e) => e.name !== "AbortError" && setErr(e.message));
    return () => ctrl.abort();
  }, [id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Autó részletei"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close" onClick={onClose} aria-label="Bezárás">×</button>

        {err && <p className="state err" role="alert">Nem sikerült betölteni: {err}</p>}
        {!car && !err && <p className="state">Betöltés…</p>}

        {car && (
          <>
            <Plate value={car.template_plate} />
            <h2>{car.gyarto} {car.model}</h2>
            <p className="card-sub">{car.type} · {car.eng_volume}</p>
            <p className="price big">{ft(car.price_eur)} €</p>

            <dl className="specs">
              <div><dt>Alvázszám</dt><dd className="vin">{car.vin_code}</dd></div>
              <div><dt>Szín</dt><dd>{car.colour}</dd></div>
              <div><dt>Teljesítmény</dt><dd>{car.le} LE</dd></div>
              <div><dt>Váltó</dt><dd>{VALTO[car.gearbox] ?? car.gearbox}</dd></div>
              <div><dt>Hajtás</dt><dd>{HAJTAS[car.drive_method] ?? car.drive_method}</dd></div>
              <div><dt>Forgalomba helyezés</dt><dd>{datum(car.registration_date)}</dd></div>
            </dl>

            <h3 className="sub">Felszereltség</h3>
            {car.extras?.length ? (
              <ul className="chips">
                {car.extras.map((x) => <li key={x.id}>{x.extra}</li>)}
              </ul>
            ) : (
              <p className="card-sub">Ehhez az autóhoz nincs felszereltség rögzítve.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default VehicleDetails;