import { useEffect, useState } from "react";
import { googleMapsLoader } from "~/utils/googleMaps";

type MemberCardProps = {
  name: string;
  placeId: string;
  address?: string | null;
  mapsUrl?: string | null;
  mapsLabel: string;
};

function MemberCard({
  name,
  placeId,
  address,
  mapsUrl,
  mapsLabel,
}: MemberCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPhoto = async () => {
      await googleMapsLoader.importLibrary("places");
      const attribution = document.createElement("div");
      const service = new google.maps.places.PlacesService(attribution);

      service.getDetails(
        {
          placeId,
          fields: ["photo", "url"],
        },
        (place, status) => {
          if (cancelled) return;
          if (status !== google.maps.places.PlacesServiceStatus.OK) return;
          const url = place?.photos?.at(0)?.getUrl({ maxWidth: 800 });
          if (url) setPhotoUrl(url);
        },
      );
    };

    void loadPhoto();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md bg-white shadow-lg">
      <div className="relative h-48 w-full bg-slate-200">
        {photoUrl ? (
          // Google Places photo URLs expire; keep a plain img.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-l from-lightYellow to-darkYellow text-4xl font-bold text-white">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-slate-800">{name}</h3>
        {address && <p className="text-sm text-slate-600">{address}</p>}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-2 text-sm font-semibold text-darkYellow hover:underline"
          >
            {mapsLabel}
          </a>
        )}
      </div>
    </article>
  );
}

export default MemberCard;
