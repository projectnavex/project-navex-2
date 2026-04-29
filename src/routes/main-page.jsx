import { useCallback, useRef, useState } from "react";

import MapControls from "../components/map-controls";
import NavexMap from "../components/navex-map";
import NDS from "../components/nds";
import TrainingAreaDropdown from "../components/training-area-dropdown";

const TRAINING_AREAS = {
  amaKeng: {
    name: "Ama Keng",
    location: { lat: 1.403703, lng: 103.702338, zoom: 15 },
  },
  jalanBahar: {
    name: "Jalan Bahar",
    location: { lat: 1.359666, lng: 103.674655, zoom: 14 },
  },
  jalanBathera: {
    name: "Jalan Bathera",
    location: { lat: 1.409809, lng: 103.683807, zoom: 14 },
  },
  lorongAsrama: {
    name: "Lorong Asrama",
    location: { lat: 1.412811, lng: 103.77478, zoom: 15 },
  },
  lowerMandai: {
    name: "Lower Mandai",
    location: { lat: 1.348384, lng: 103.812913, zoom: 15 },
  },
  marsling: {
    name: "Marsling",
    location: { lat: 1.400156, lng: 103.771155, zoom: 15 },
  },
  tekong: {
    name: "Tekong",
    location: { lat: 1.412587, lng: 104.038093, zoom: 14 },
  },
};

export default function MainPage() {
  let mapRef = useRef(null);
  let markerIdRef = useRef(0);
  let [markers, setMarkers] = useState([]);
  let [interval, setInterval] = useState(100);
  let [openDropdown, setOpenDropdown] = useState(null);

  let handleAddMarker = useCallback(position => {
    setMarkers(prev => [...prev, { id: markerIdRef.current++, position }]);
  }, []);
  let handleChangeMarker = useCallback((id, position) => {
    setMarkers(prev =>
      prev.map(marker => (marker.id === id ? { id, position } : marker)),
    );
  }, []);
  let handleDeleteMarker = useCallback(id => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);
  function handleDeleteAllMarkers() {
    setMarkers([]);
  }
  function handleChangeInterval(newInterval) {
    setInterval(newInterval);
  }

  return (
    <div>
      <TrainingAreaDropdown
        trainingAreas={TRAINING_AREAS}
        mapRef={mapRef}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      <NavexMap
        defaultLocation={TRAINING_AREAS.lorongAsrama.location}
        markers={markers}
        handleAddMarker={handleAddMarker}
        handleChangeMarker={handleChangeMarker}
        handleDeleteMarker={handleDeleteMarker}
        mapRef={mapRef}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      <MapControls
        handleAddMarker={handleAddMarker}
        handleDeleteAllMarkers={handleDeleteAllMarkers}
        handleChangeInterval={handleChangeInterval}
      />
      {markers.length > 1 && <NDS markers={markers} interval={interval} />}
    </div>
  );
}
