export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}