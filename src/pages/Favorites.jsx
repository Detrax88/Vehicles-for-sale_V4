// import "../css/Favorites.css";
import {useVehicleContext} from '../contexts/VehicleContext';
import VehicleDetails from '../components/VehicleDetails';

function Favorites() {
    const { favorites } = useVehicleContext();
    if (favorites.length > 0) {
        return (
            <div className="favorites">
                <h2>Favorites</h2>

            <div className="vehicle-list">
                {favorites.map((vehicle) => (
                    <VehicleDetails key={vehicle.id} vehicle={vehicle} />
                ))}                
                
            </div>
            </div>
        );
    }

    return <div className="favorites-empty">
        <h2>No favorite vehicles added</h2>

                </div>

    
}

export default Favorites;