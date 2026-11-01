const API_BASE = "http://127.0.0.1:8000";

export const URL_HOME = `${API_BASE}/home/`;
export const URL_DES = (id) => `${API_BASE}/des/${id}/`;

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${res.status} – ${url}`);
  return res.json();
}

// Autólista (SerHome)
export async function fetchCars(signal) {
  const data = await getJson(URL_HOME, signal);
  return Array.isArray(data) ? data : data.results ?? []; // lapozott válasznál is működik
}

// Egy autó részletei (SerDes)
export function fetchCar(id, signal) {
  return getJson(URL_DES(id), signal);
}