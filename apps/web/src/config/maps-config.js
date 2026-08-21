// Google Maps API Configuration
export const GOOGLE_MAPS_API_KEY = 'AIzaSyB8IDZfhnpsZNh-SENJYWXLQKlkrmifl_4';

// Default location coordinates (New York City)
export const DEFAULT_LOCATION = {
  lat: 23.2328,
  lng: 72.6460
};

// Map configuration
export const MAP_CONFIG = {
  zoom: 15,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9c9c9' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }]
    }
  ]
};

