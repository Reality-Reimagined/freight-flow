import { Loader } from '@googlemaps/js-api-loader';
import { Location, RouteInfo } from '../types';

export const initializeGoogleMaps = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  return loader.load();
};

export const calculateRoute = async (
  origin: Location,
  destination: Location
): Promise<RouteInfo> => {
  if (!origin.coordinates || !destination.coordinates) {
    throw new Error('Invalid coordinates');
  }

  const directionsService = new google.maps.DirectionsService();
  const distanceService = new google.maps.DistanceMatrixService();

  const [routeResponse, distanceResponse] = await Promise.all([
    directionsService.route({
      origin: origin.coordinates,
      destination: destination.coordinates,
      travelMode: google.maps.TravelMode.DRIVING,
    }),
    distanceService.getDistanceMatrix({
      origins: [origin.coordinates],
      destinations: [destination.coordinates],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }),
  ]);

  if (!routeResponse.routes[0] || !distanceResponse.rows[0]?.elements[0]) {
    throw new Error('Could not calculate route');
  }

  const route = routeResponse.routes[0];
  const distance = distanceResponse.rows[0].elements[0].distance;
  const duration = distanceResponse.rows[0].elements[0].duration;

  return {
    route,
    distance: distance.value / 1609.34, // Convert to miles
    duration: duration.value / 60, // Convert to minutes
    polyline: route.overview_polyline,
  };
};