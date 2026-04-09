import { MapContainer, TileLayer, Popup, useMapEvents, Circle, CircleMarker, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { useEffect, useState } from "react";
import type { LatLng } from "leaflet";
import type { Court } from "../services/apiMAP";
import { getCourts } from "../services/apiMAP";

function getCourtIcon(label: number | string) {
  return divIcon({
    className: "hc-court-marker",
    html: `
      <div class="hc-court-marker__pin">
        <span class="hc-court-marker__label">${label}</span>
        <span class="hc-court-marker__badge"></span>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -38],
  });
}

function CourtsMarkers() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [error, setError] = useState<string>("");
  const fallbackPosition: [number, number] = [34.048408, -118.252957];

  useEffect(() => {
    async function loadCourts() {
      try {
        const data = await getCourts();
        console.log("Canchas obtenidas de la BD:", data);
        setCourts(data ?? []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "No se pudo cargar.");
      }
    }

    loadCourts();
  }, []);

  return (
    <>
      {error ? (
        <Marker position={fallbackPosition}>
          <Popup>{error}</Popup>
        </Marker>
      ) : null}
      {courts.map((court, index) => (
        <Marker key={court.court_id} position={[court.latitude, court.longitude]} icon={getCourtIcon(index + 1)}>
          <Popup>
            <b>{court.name}</b><br/>
            {court.direction}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

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
    <>
      <Circle
        center={position}
        pathOptions={{
          color: "#2b7fff",
          fillColor: "#2b7fff",
          fillOpacity: 0.15,
          weight: 1,
        }}
      />
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          color: "#ffffff",
          weight: 2,
          fillColor: "#2b7fff",
          fillOpacity: 1,
        }}
      >
        <Popup>Tu ubicacion actual</Popup>
      </CircleMarker>
    </>
  );
}

export default function Map() {
  const fallbackPosition: [number, number] = [34.048408, -118.252957];
  const courtCards = ["Court A", "Court B", "Court C", "Court D", "Court E"]; // Creo que pondremos los nombres que ya tienen

  return (
    <section className="hc-map-shell">
      <header className="hc-map-topbar">
        <p className="hc-map-topbar-title">MAP VIEW</p>
        <div className="hc-map-topbar-actions">
          <button type="button" className="hc-map-pill hc-map-pill--active">Satellite</button>
          <button type="button" className="hc-map-pill">List</button>
        </div>
      </header>

      <div className="hc-map-stage">
        <MapContainer center={fallbackPosition} zoom={13} className="hc-map-canvas">
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <CourtsMarkers />
          <Marker position={fallbackPosition} icon={getCourtIcon("H")}>
            <Popup>
              Cancha bb
            </Popup>
          </Marker>
        </MapContainer>

        <div className="hc-map-chip hc-map-chip--city">Los Angeles, CA</div>
        <div className="hc-map-chip hc-map-chip--location">My Location</div>
      </div>

      <div className="hc-map-courts-strip">
        {courtCards.map((courtCard) => (
          <button key={courtCard} type="button" className="hc-map-court-card">
            {courtCard}
          </button>
        ))}
      </div>
    </section>
  );
}