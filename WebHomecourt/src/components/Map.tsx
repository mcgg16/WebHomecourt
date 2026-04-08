import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { LatLng } from "leaflet";

function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string>("");

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    },
    locationerror() {
      setError("No se pudo obtener tu ubicacion.");
    },
  });

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: true,
    });
  }, [map]);

  return position === null ? (
    error ? <Popup position={map.getCenter()}>{error}</Popup> : null
  ) : (
    <Marker position={position}>
      <Popup>Tu ubicacion actual</Popup>
    </Marker>
  );
}

export default function Map() {
  const fallbackPosition: [number, number] = [34.048408, -118.252957];

  return (
    <MapContainer center={fallbackPosition} zoom={13} style={{ height: "500px", width: "80%" }}>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}