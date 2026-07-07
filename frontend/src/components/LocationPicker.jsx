import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (required for Leaflet to work with Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to recenter the map when position changes
const RecenterMap = ({ position }) => {
    const map = useMap();
    // FIX: flyTo now runs inside an effect keyed on `position`, so it only
    // fires when the pin actually moves — not on every re-render of the page
    // (e.g. every keystroke in the checkout form above).
    useEffect(() => {
        map.flyTo(position, 16);
    }, [map, position]);
    return null;
};

// Component to handle map clicks
const MapClickHandler = ({ setPosition, onLocationFetched }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            fetchLocationData(lat, lng, onLocationFetched);
        },
    });
    return null;
};

// FIX: Switched from BigDataCloud to OpenStreetMap's Nominatim reverse-geocoder.
// BigDataCloud's free endpoint only has reliable postcode data for US/UK/Australia,
// which is why pincode was always coming back empty for Indian locations.
// Nominatim has solid OSM-based postcode coverage for India and needs no API key.
const fetchLocationData = async (lat, lng, callback) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en&zoom=18`
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const address = data.address || {};

        const city =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            address.county ||
            '';
        const state = address.state || '';
        const pincode = address.postcode || '';
        const country = address.country || '';

        // FIX: display_name concatenates Nominatim's whole admin hierarchy
        // (suburb + municipality + district + state...), and in India those
        // levels often share near-identical names — which is why the address
        // box was showing the same place repeated. Build the string from
        // specific fields instead, most-specific first, and drop consecutive
        // duplicates.
        const road = address.road || address.pedestrian || address.neighbourhood || '';
        const houseNumber = address.house_number || '';
        const locality = address.suburb || address.city_district || '';

        const rawParts = [
            [houseNumber, road].filter(Boolean).join(' '),
            locality,
            city,
            state,
            pincode,
            country,
        ]
            .map((p) => p.trim())
            .filter(Boolean);

        const parts = rawParts.filter(
            (part, i) => i === 0 || part.toLowerCase() !== rawParts[i - 1].toLowerCase()
        );

        const fullAddress = parts.length
            ? parts.join(', ')
            : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        if (callback) {
            callback({ city, state, pincode, fullAddress, lat, lng });
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        if (callback) {
            callback({
                city: '',
                state: '',
                pincode: '',
                fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                lat,
                lng
            });
        }
    }
};

const LocationPicker = ({ onLocationSelected }) => {
    const [position, setPosition] = useState([21.485926, 86.942847]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported by your browser');
            return;
        }
        setIsFetching(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                fetchLocationData(latitude, longitude, (data) => {
                    if (onLocationSelected) onLocationSelected(data);
                    setIsFetching(false);
                });
            },
            (err) => {
                console.error('Geolocation error:', err);
                let msg = 'Unable to get location. ';
                if (err.code === 1) msg += 'Please allow location access.';
                else if (err.code === 2) msg += 'Location unavailable.';
                else msg += 'Try again or enter manually.';
                setError(msg);
                setIsFetching(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }, [onLocationSelected]);

    const handleDragEnd = (e) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        setPosition([pos.lat, pos.lng]);
        fetchLocationData(pos.lat, pos.lng, (data) => {
            if (onLocationSelected) onLocationSelected(data);
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2 items-center flex-wrap">
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isFetching}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isFetching ? '📍 Fetching...' : '📍 Use My Current Location'}
                </button>
                {isFetching && <span className="text-xs text-gray-500">Please allow location access...</span>}
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>

            <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <MapContainer
                    center={position}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap position={position} />
                    <Marker
                        position={position}
                        draggable={true}
                        eventHandlers={{
                            dragend: handleDragEnd,
                        }}
                    />
                    <MapClickHandler
                        setPosition={setPosition}
                        onLocationFetched={(data) => {
                            if (onLocationSelected) onLocationSelected(data);
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationPicker;