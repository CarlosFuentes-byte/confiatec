import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function StaticLocationMap({ lat, lng }: { lat: number; lng: number }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <p className="location-error">
        Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para mostrar el mapa.
      </p>
    );
  }

  const position = { lat, lng };

  return (
    <div className="location-map">
      <APIProvider apiKey={apiKey}>
        <Map center={position} defaultZoom={15} disableDefaultUI gestureHandling="greedy">
          <Marker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
}
