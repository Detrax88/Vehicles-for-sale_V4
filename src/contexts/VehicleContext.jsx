import {createContext, useState, useContext, useEffect} from 'react';

const VehicleContext = createContext()

export const useVehicleContext = () => 
    useContext(VehicleContext);

export const VehicleProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addtoFavorites = (vehicle) => {
        setFavorites(prev => [...prev, vehicle]);
    };

    const removeFromFavorites = (vehicleId) => {
        setFavorites(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
    };

    const isFavorite = (vehicleId) => {
        return favorites.some(vehicle => vehicle.id === vehicleId);
    }
    const value = {
        favorites,
        addtoFavorites,
        removeFromFavorites,
        isFavorite
    }
    return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
};