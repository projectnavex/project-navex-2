import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import TileDropdown from "./tile-dropdown";

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

const TILE_PROVIDERS = [
  {
    id: "topomap",
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
  {
    id: "cartoDark",
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    id: "cartoVoyager",
    name: "CartoDB Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    id: "esriTopo",
    name: "ESRI Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];

function MapSetup({ mapRef }) {
  let map = useMap();
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
  let markerRef = useRef(null);
  let eventHandlers = useMemo(
    () => ({
      dragend() {
        let m = markerRef.current;
        if (m != null) {
          let latlng = m.getLatLng();
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
  openDropdown,
  setOpenDropdown,
}) {
  let [tile, setTile] = useState(TILE_PROVIDERS[0]);

  return (
    <div className="mt-3">
      <TileDropdown
        providers={TILE_PROVIDERS}
        tile={tile}
        setTile={setTile}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      <MapContainer
        className="z-0 my-5 h-[450px] w-full md:h-[75vh]"
        center={[defaultLocation.lat, defaultLocation.lng]}
        zoom={defaultLocation.zoom || 15}
        maxBounds={SINGAPORE_BOUNDS}
        maxBoundsViscosity={0.5}
        zoomControl={true}
      >
        <TileLayer key={tile.id} url={tile.url} attribution={tile.attribution} />
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
    </div>
  );
}
