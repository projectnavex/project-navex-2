import { Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

const SINGAPORE_BOUNDS = {
  north: 1.466878,
  south: 1.21186,
  west: 103.584676,
  east: 104.114079,
};
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function NavexMap({
  defaultLocation,
  markers,
  handleAddMarker,
  handleChangeMarker,
  handleDeleteMarker,
}) {
  let map = useMap();
  let mapsLib = useMapsLibrary("maps");
  let markerPathRef = useRef(null);

  useEffect(() => {
    if (!mapsLib || !map) {
      return;
    }
    if (markerPathRef.current) {
      markerPathRef.current.getPath().clear();
    }
    markerPathRef.current = new mapsLib.Polyline({
      path: markers.map(marker => marker.position),
      strokeColor: "#000000",
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: "M 0, -1 0, 1",
            strokeOpacity: 1,
            scale: 3,
          },
          offset: "0",
          repeat: "20px",
        },
      ],
    });
    markerPathRef.current.setMap(map);
  }, [markers]);

  return (
    <Map
      styles={MAP_STYLES}
      className="my-5 h-[450px] w-screen md:h-[75vh]"
      onClick={e => handleAddMarker(e.detail.latLng)}
      defaultZoom={15}
      defaultCenter={defaultLocation}
      restriction={{ latLngBounds: SINGAPORE_BOUNDS, strictBounds: false }}
      mapTypeControl={true}
      clickableIcons={false}
      disableDefaultUI={true}
      disableDoubleClickZoom={true}
      keyboardShortcuts={false}
    >
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          draggable={true}
          onDragEnd={e =>
            handleChangeMarker(marker.id, {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            })
          }
          onClick={() => handleDeleteMarker(marker.id)}
        />
      ))}
    </Map>
  );
}
