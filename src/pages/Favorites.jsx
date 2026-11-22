import { useState } from 'react';
import { useVehicleContext } from '../contexts/VehicleContext';
import VehicleDetails from '../components/VehicleDetails';
import '../css/Favorites.css';

function Favorites() {
    const { favorites } = useVehicleContext();
    const [selectedId, setSelectedId] = useState(null);

    if (favorites.length === 0) {
        return (
            <div className="favorites-empty">
                <h2>Nincsenek kedvencek</h2>
            </div>
        );
    }

    return (
        <div className="favorites">
            <h2>Favorite Vehicles</h2>

            <div className="vehicle-list">
                {favorites.map((vehicle) => (
                    <button
                        key={vehicle.id}
                        type="button"
                        className="fav-card"
                        onClick={() => setSelectedId(vehicle.id)}
                    >
                        <span className="fav-title">{vehicle.gyarto} {vehicle.model}</span>
                        <span className="card-sub">{vehicle.type}</span>
                        <span className="price">{vehicle.price_eur} €</span>
                    </button>
                ))}
            </div>

            {selectedId && (
                <VehicleDetails id={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </div>
    );
}

export default Favorites;