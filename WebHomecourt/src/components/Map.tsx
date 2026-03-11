import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const position: [number, number] = [34.048408,-118.252957];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "80%" }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          I hopped off my plane at LAX
        </Popup>
      </Marker>
    </MapContainer>
  );
}
