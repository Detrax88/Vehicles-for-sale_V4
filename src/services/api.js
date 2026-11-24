export const API_BASE = "http://127.0.0.1:8000";
//export const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  register: `${API_BASE}/auth/register/`,
  login: `${API_BASE}/auth/login/`,
};

export async function loginUser({ username, password }) {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    // a válasz nem JSON
  }

  return { ok: response.ok, status: response.status, data };
}



export const URL_HOME = `${API_BASE}/home/`;
export const URL_DES = (id) => `${API_BASE}/des/${id}/`;

export const imgUrl = (path) =>
  !path ? null : path.startsWith("http") ? path : `${API_BASE}${path}`;

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

export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
