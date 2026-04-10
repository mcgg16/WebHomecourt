import { MapContainer, TileLayer, Popup, useMapEvents, Circle, CircleMarker, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { useEffect, useState } from "react";
import type { LatLng, Map as LeafletMap } from "leaflet";
import type { Court } from "../services/apiMAP";
import { getCiudad, getCourts } from "../services/apiMAP";

function getCourtIcon(label: number | string, isSelected = false) {
  return divIcon({
    className: `hc-court-marker${isSelected ? " hc-court-marker--selected" : ""}`,
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




function CourtsMarkers({ courts, error, selectedCourtId, onSelectCourt }: {
  courts: Court[];
  error: string;
  selectedCourtId: number | null;
  onSelectCourt: (court: Court) => void;
}) {
  const fallbackPosition: [number, number] = [34.048408, -118.252957];

  return (
    <>
      {error ? (
        <Marker position={fallbackPosition}>
          <Popup>{error}</Popup>
        </Marker>
      ) : null}
      {courts.map((court, index) => (
        <Marker
          key={court.court_id}
          position={[court.latitude, court.longitude]}
          icon={getCourtIcon(index + 1, selectedCourtId === court.court_id)}
          eventHandlers={{
            click: () => onSelectCourt(court),
          }}
        >
          <Popup>
            <b>{court.name}</b><br/>
            {court.direction}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function LocationMarker({ locateRequest, onCityChange }: { locateRequest: number; onCityChange: (city: string) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string>("");

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    },
    locationerror() {
      setError("No se pudo obtener tu ubicacion.");
      onCityChange("Ubicacion no disponible");
    },
  });

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: false,
    });
  }, [map]);

  useEffect(() => {
    if (locateRequest === 0) {
      return;
    }

    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: false,
    });
  }, [map, locateRequest]);

  useEffect(() => {
    const currentPosition = position;

    if (currentPosition === null) {
      return;
    }

    const { lat, lng } = currentPosition;

    let isCancelled = false;

    async function loadCurrentCity() {
      try {
        const city = await getCiudad(lat, lng);
        if (!isCancelled) {
          onCityChange(city ?? "Ciudad no disponible");
        }
      } catch {
        if (!isCancelled) {
          onCityChange("Ciudad no disponible");
        }
      }
    }

    loadCurrentCity();

    return () => {
      isCancelled = true;
    };
  }, [position, onCityChange]);

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
  const [courts, setCourts] = useState<Court[]>([]);
  const [error, setError] = useState<string>("");
  const [locateRequest, setLocateRequest] = useState(0);
  const [currentCity, setCurrentCity] = useState("Detectando ciudad...");
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    async function loadCourts() {
      try {
        const data = await getCourts();
        console.log("Canchas obtenidas de la BD:", data);
        setCourts(data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar.");
      }
    }

    loadCourts();
  }, []);

  useEffect(() => {
    if (map === null || selectedCourtId === null) {
      return;
    }

    const selectedCourt = courts.find((court) => court.court_id === selectedCourtId);

    if (!selectedCourt) {
      return;
    }

    map.flyTo([selectedCourt.latitude, selectedCourt.longitude], Math.max(map.getZoom(), 15));
  }, [courts, map, selectedCourtId]);

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
        {/* Aqui lo de ref = setMap es para poder usarlo fuera de el mapa, por asi decirlo. Cuando se renderiza, lo guarda y ya lo pueda usar fuera para poder ir si se selecionanuna cancha desde fuera. Si no tuviera la referencia no podria acceder desde fuera al componente */}
        <MapContainer center={fallbackPosition} zoom={13} className="hc-map-canvas" ref={setMap}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker locateRequest={locateRequest} onCityChange={setCurrentCity} />
          <CourtsMarkers
            courts={courts}
            error={error}
            selectedCourtId={selectedCourtId}
            onSelectCourt={(court) => setSelectedCourtId(court.court_id)}
          />
        </MapContainer>

        <div className="hc-map-chip hc-map-chip--city">{currentCity}</div>
        <button onClick={() => setLocateRequest((prev) => prev + 1)} type="button" className="hc-map-chip hc-map-chip--location">My Location</button> {/* Creo que es medio diucktpae lol, pero esta con prev prev + porque asi, hago que se detecte un cambio y se use como trigger. Ya con esto, hace que se active el location marker, y hace map.locate entonces asi lo lleva a la ubi */}
      </div>

      <div className="hc-map-courts-strip">
        {courts.length > 0 ? (
          courts.map((court) => (
            <button
              key={court.court_id}
              type="button"
              className={`hc-map-court-card${selectedCourtId === court.court_id ? " hc-map-court-card--selected" : ""}`}
              onClick={() => setSelectedCourtId(court.court_id)}
            >
              {court.name}
            </button>
          ))
        ) : (
          <button type="button" className="hc-map-court-card" disabled>
            {error ? "No se pudieron cargar las canchas" : "Cargando canchas..."}
          </button>
        )}
      </div>
    </section>
  );
}