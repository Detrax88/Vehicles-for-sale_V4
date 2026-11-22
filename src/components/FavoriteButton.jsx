import { useVehicleContext } from "../contexts/VehicleContext";
import "../css/FavoriteButton.css";

export default function FavoriteButton({ vehicle }) {
  const { isFavorite, addtoFavorites, removeFromFavorites } = useVehicleContext();
  const favorite = isFavorite(vehicle.id);

  const handleClick = () => {
    if (favorite) {
      removeFromFavorites(vehicle.id);
    } else {
      addtoFavorites(vehicle);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorite}
      aria-label={favorite ? "Eltávolítás a kedvencek közül" : "Hozzáadás a kedvencekhez"}
      className={`favorite-button ${favorite ? "is-favorite" : ""}`}
    >
      {favorite ? "♥" : "♡"}
    </button>
  );
}