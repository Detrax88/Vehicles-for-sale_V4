import { useEffect, useMemo, useState } from "react";
import { fetchCars } from "../services/api";
import { HAJTAS, VALTO, ft, datum, year } from "../services/utils";
import { VehicleDetails } from "../components/VehicleDetails";
import "../index.css";
import "../css/Home.css";

/* Autó kártya (SerHome adatai) */
function CarCard({ car, onOpen }) {
  return (
    <article className="card">
      <div className="card-top">
        <h3 className="card-title">{car.gyarto} {car.model}</h3>
        <span className="price">{ft(car.price_eur)} €</span>
      </div>
      <p className="card-sub">{car.type} · {car.eng_volume}</p>

      <dl className="specs">
        <div><dt>Évjárat</dt><dd>{year(car.registration_date) ?? "–"}</dd></div>
        <div><dt>Teljesítmény</dt><dd>{car.le} LE</dd></div>
        <div><dt>Váltó</dt><dd>{VALTO[car.gearbox] ?? car.gearbox}</dd></div>
        <div><dt>Hajtás</dt><dd>{HAJTAS[car.drive_method] ?? car.drive_method}</dd></div>
        <div><dt>Szín</dt><dd>{car.colour}</dd></div>
        <div><dt>Forgalomba helyezés</dt><dd>{datum(car.registration_date)}</dd></div>
      </dl>

      <button type="button" className="primary" onClick={() => onOpen(car.id)}>
        Részletek
      </button>
    </article>
  );
}

const EMPTY = { q: "", gyarto: "", model: "", maxPrice: "", minYear: "", gearbox: "", drive: "" };

export default function Home() {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [error, setError] = useState("");
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState("price_asc");
  const [openId, setOpenId] = useState(null);

  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCars(ctrl.signal)
      .then((list) => {
        setCars(list);
        setStatus("ok");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setStatus("error");
      });
    return () => ctrl.abort();
  }, []);

  // A szűrők opciói magukból az autókból jönnek
  const gyartok = useMemo(() => [...new Set(cars.map((c) => c.gyarto))].sort(), [cars]);
  const modellek = useMemo(
    () => [...new Set(cars.filter((c) => !f.gyarto || c.gyarto === f.gyarto).map((c) => c.model))].sort(),
    [cars, f.gyarto]
  );
  const valtok = useMemo(() => [...new Set(cars.map((c) => c.gearbox))].sort(), [cars]);
  const hajtasok = useMemo(() => [...new Set(cars.map((c) => c.drive_method))].sort(), [cars]);

  const shown = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = cars.filter((c) => {
      if (f.gyarto && c.gyarto !== f.gyarto) return false;
      if (f.model && c.model !== f.model) return false;
      if (f.maxPrice && c.price_eur > Number(f.maxPrice)) return false;
      if (f.minYear && (year(c.registration_date) ?? 0) < Number(f.minYear)) return false;
      if (f.gearbox !== "" && String(c.gearbox) !== f.gearbox) return false;
      if (f.drive !== "" && String(c.drive_method) !== f.drive) return false;
      if (q && ![c.gyarto, c.model, c.type, c.colour].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    const sorters = {
      price_asc: (a, b) => a.price_eur - b.price_eur,
      price_desc: (a, b) => b.price_eur - a.price_eur,
      date_desc: (a, b) => new Date(b.registration_date) - new Date(a.registration_date),
      le_desc: (a, b) => b.le - a.le,
    };
    return [...list].sort(sorters[sort]);
  }, [cars, f, sort]);

  return (
    <div className="home">
      <header className="top">
        <h1>Használt autók</h1>
        <p>{status === "ok" ? `${shown.length} találat ${cars.length} autóból` : "Autók betöltése…"}</p>
      </header>

      <div className="layout">
        <aside className="filters" aria-label="Szűrők">
          <label>
            Keresés
            <input type="search" placeholder="Gyártó, modell, szín…" value={f.q}
              onChange={(e) => set({ q: e.target.value })} />
          </label>

          <label>
            Gyártó
            <select value={f.gyarto} onChange={(e) => set({ gyarto: e.target.value, model: "" })}>
              <option value="">Összes gyártó</option>
              {gyartok.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          <label>
            Modell
            <select value={f.model} onChange={(e) => set({ model: e.target.value })}>
              <option value="">Összes modell</option>
              {modellek.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <div className="row">
            <label>
              Legfeljebb (€)
              <input type="number" min="0" step="500" value={f.maxPrice}
                onChange={(e) => set({ maxPrice: e.target.value })} />
            </label>
            <label>
              Évjárat-tól
              <input type="number" min="1950" max={new Date().getFullYear()} value={f.minYear}
                onChange={(e) => set({ minYear: e.target.value })} />
            </label>
          </div>

          <label>
            Váltó
            <select value={f.gearbox} onChange={(e) => set({ gearbox: e.target.value })}>
              <option value="">Mindegy</option>
              {valtok.map((v) => <option key={v} value={v}>{VALTO[v] ?? v}</option>)}
            </select>
          </label>

          <label>
            Hajtás
            <select value={f.drive} onChange={(e) => set({ drive: e.target.value })}>
              <option value="">Mindegy</option>
              {hajtasok.map((v) => <option key={v} value={v}>{HAJTAS[v] ?? v}</option>)}
            </select>
          </label>

          <button type="button" className="ghost" onClick={() => setF(EMPTY)}>Szűrők törlése</button>
        </aside>

        <main>
          <div className="toolbar">
            <label>
              Rendezés
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="price_asc">Ár: növekvő</option>
                <option value="price_desc">Ár: csökkenő</option>
                <option value="date_desc">Legújabb forgalomba helyezés</option>
                <option value="le_desc">Legerősebb</option>
              </select>
            </label>
          </div>

          {status === "loading" && <p className="state">Betöltés…</p>}

          {status === "error" && (
            <div className="state err" role="alert">
              <strong>Az adatok nem érhetők el.</strong>
              <span>Ellenőrizd, hogy fut-e a Django szerver, és be van-e állítva a CORS. ({error})</span>
            </div>
          )}

          {status === "ok" && shown.length === 0 && (
            <p className="state">Nincs a szűrőknek megfelelő autó. Próbálj kevesebb feltételt megadni.</p>
          )}

          <div className="grid">
            {shown.map((c) => <CarCard key={c.id} car={c} onOpen={setOpenId} />)}
          </div>
        </main>
      </div>

      {openId !== null && <VehicleDetails id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
