import { Loader } from "@googlemaps/js-api-loader";
import { useCallback, useEffect, useRef } from "react";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
});

function Map({ address }: { address: string }) {
  const mapRef = useRef(null);

  const loadMap = useCallback(async () => {
    await loader.importLibrary("maps");
    const loadGeocoder = await loader.importLibrary("geocoding");

    const geocoder = new loadGeocoder.Geocoder();

    await geocoder.geocode({ address: address }, (results, status) => {
      if (!results) return console.error("No results found");
      if (!mapRef.current) return console.error("No map ref found");
      if (status === google.maps.GeocoderStatus.OK) {
        const map = new google.maps.Map(mapRef.current, {
          center: results.at(0)?.geometry.location,
          zoom: 13.5,
          fullscreenControl: false, // remove the top-right button
          mapTypeControl: false, // remove the top-left buttons
          streetViewControl: false, // remove the pegman
          zoomControl: false, // remove the bottom-right buttons
          styles: styles.silver,
        });

        new google.maps.Marker({
          map: map,
          position: results.at(0)?.geometry.location,
        });
      } else {
        console.error(
          `Geocode was not successful for the following reason: ${status}`,
        );
      }
    });
  }, [address]);

  useEffect(() => {
    loadMap().catch((err) => console.error(err));
  }, [loadMap]);

  return <div style={{ height: "50vh", width: "100vw" }} ref={mapRef} />;
}
export default Map;

const styles: Record<string, google.maps.MapTypeStyle[]> = {
  default: [],
  silver: [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
  ],
};
