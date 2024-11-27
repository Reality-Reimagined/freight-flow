export interface RouteInfo {
  distance: number;
  duration: number;
  polyline?: string;
  route?: google.maps.DirectionsRoute;
}