import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const SINGAPORE_BOUNDS = [
  [1.21186, 103.584676],
  [1.466878, 104.114079],
];

const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DARK_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

function MapSetup({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    map.doubleClickZoom.disable();
    map.keyboard.disable();
  }, [map, mapRef]);
  return null;
}

function MapClickHandler({ handleAddMarker }) {
  useMapEvents({
    click(e) {
      handleAddMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function DraggableMarker({ marker, handleChangeMarker, handleDeleteMarker }) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const m = markerRef.current;
        if (m != null) {
          const latlng = m.getLatLng();
          handleChangeMarker(marker.id, { lat: latlng.lat, lng: latlng.lng });
        }
      },
      click() {
        handleDeleteMarker(marker.id);
      },
    }),
    [marker.id, handleChangeMarker, handleDeleteMarker],
  );

  return (
    <Marker
      position={marker.position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

export default function NavexMap({
  defaultLocation,
  markers,
  handleAddMarker,
  handleChangeMarker,
  handleDeleteMarker,
  mapRef,
}) {
  return (
    <MapContainer
      className="z-0 my-5 h-[450px] w-full md:h-[75vh]"
      center={[defaultLocation.lat, defaultLocation.lng]}
      zoom={defaultLocation.zoom || 15}
      maxBounds={SINGAPORE_BOUNDS}
      maxBoundsViscosity={0.5}
      zoomControl={true}
    >
      <TileLayer url={DARK_TILE_URL} attribution={DARK_TILE_ATTRIBUTION} />
      <MapSetup mapRef={mapRef} />
      <MapClickHandler handleAddMarker={handleAddMarker} />
      {markers.length > 1 && (
        <Polyline
          positions={markers.map(m => [m.position.lat, m.position.lng])}
          pathOptions={{ color: "#000000", weight: 3, dashArray: "10, 10" }}
        />
      )}
      {markers.map(marker => (
        <DraggableMarker
          key={marker.id}
          marker={marker}
          handleChangeMarker={handleChangeMarker}
          handleDeleteMarker={handleDeleteMarker}
        />
      ))}
    </MapContainer>
  );
}
