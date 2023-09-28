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
