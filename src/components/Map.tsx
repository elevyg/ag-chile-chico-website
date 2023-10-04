import { Loader } from "@googlemaps/js-api-loader";
import { useCallback, useEffect, useRef } from "react";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
});

// https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0

function Map({ places }: { places: { placeId: string; name: string }[] }) {
  const mapRef = useRef(null);

  const loadMap = useCallback(async () => {
    await loader.importLibrary("maps");

    await loader.importLibrary("places");

    const infowindow = new google.maps.InfoWindow();

    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -46.5411, lng: -71.7278 },
      zoom: 15,
      fullscreenControl: false, // remove the top-right button
      mapTypeControl: false, // remove the top-left buttons
      streetViewControl: false, // remove the pegman
      zoomControl: false, // remove the bottom-right buttons
      styles: styles.silver,
    });

    const service = new google.maps.places.PlacesService(map);

    const markers = places.map((member) => {
      return () =>
        service.getDetails(
          {
            placeId: member.placeId,
            fields: [
              "name",
              "formatted_address",
              "place_id",
              "geometry",
              "photo",
              "url",
              "type",
            ],
          },
          (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place?.geometry?.location
            ) {
              const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP,
              });

              google.maps.event.addListener(marker, "click", () => {
                const link = document.createElement("a");
                link.href = place.url!;
                link.target = "_blank";

                const content = document.createElement("div");

                content.style.display = "flex";
                content.style.flexDirection = "column";
                content.style.alignItems = "center";
                content.style.justifyContent = "space-between";
                content.style.flex = "1";
                content.style.gap = "1rem";

                const nameElement = document.createElement("h2");

                nameElement.textContent = place.types?.includes(
                  "street_address",
                )
                  ? member.name
                  : place.name!;
                content.appendChild(nameElement);

                const photoElement = document.createElement("img");

                photoElement.src = place.photos?.at(0)
                  ? place.photos?.at(0)?.getUrl() ?? ""
                  : "";

                photoElement.style.width = "15rem";
                photoElement.style.height = "auto";

                content.appendChild(photoElement);

                const placeAddressElement = document.createElement("p");

                placeAddressElement.textContent = place.formatted_address!;
                content.appendChild(placeAddressElement);

                link.appendChild(content);

                infowindow.setContent(link);
                infowindow.open(map, marker);
              });
            }
          },
        );
    });

    markers.forEach((m, i) => {
      setTimeout(() => {
        m();
      }, i * 550);
    });

    for (const m of markers) {
    }
  }, [places]);

  useEffect(() => {
    loadMap().catch((err) => console.error(err));
  }, [loadMap]);

  return <div style={{ height: "100vh", width: "100vw" }} ref={mapRef} />;
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
