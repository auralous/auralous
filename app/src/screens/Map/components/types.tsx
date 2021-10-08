export interface MapMapProps {
  query: (lng: number, lat: number, zoom: number) => void;
  lngLat: [lng: number, lat: number] | null;
}
