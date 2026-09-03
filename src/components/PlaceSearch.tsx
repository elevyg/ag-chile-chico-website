import { useEffect, useRef } from "react";
import { googleMapsLoader } from "~/utils/googleMaps";

export type SelectedPlace = {
  placeId: string;
  name: string;
  address?: string;
  mapsUrl?: string;
};

function PlaceSearch({
  onSelect,
  defaultQuery,
}: {
  onSelect: (place: SelectedPlace) => void;
  defaultQuery?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let listener: google.maps.MapsEventListener | undefined;
    let cancelled = false;

    const init = async () => {
      await googleMapsLoader.importLibrary("places");
      if (cancelled || !inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["place_id", "name", "formatted_address", "url"],
          types: ["establishment"],
          componentRestrictions: { country: "cl" },
          bounds: new google.maps.LatLngBounds(
            { lat: -46.72, lng: -71.95 },
            { lat: -46.36, lng: -71.5 },
          ),
          strictBounds: false,
        },
      );

      listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.place_id) return;

        onSelectRef.current({
          placeId: place.place_id,
          name: place.name ?? "",
          address: place.formatted_address,
          mapsUrl: place.url,
        });
      });
    };

    void init();

    return () => {
      cancelled = true;
      if (listener) google.maps.event.removeListener(listener);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-slate-800" htmlFor="place-search">
        Busca el negocio en Google Maps
      </label>
      <p className="text-sm text-slate-500">
        Escribe el nombre como aparece en Google (por ejemplo, “Cabañas Frau
        Schuster, Chile Chico”) y elige el resultado. El Place ID se completa
        solo; no tienes que copiarlo de ningún lado.
      </p>
      <input
        id="place-search"
        ref={inputRef}
        defaultValue={defaultQuery}
        placeholder="Nombre del negocio en Chile Chico"
        className="w-full rounded-md border border-slate-300 p-3"
        autoComplete="off"
      />
    </div>
  );
}

export default PlaceSearch;
