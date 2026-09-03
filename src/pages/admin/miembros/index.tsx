import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IoAddCircleSharp,
  IoCloseCircleSharp,
  IoPencilSharp,
} from "react-icons/io5";
import AdminNav from "~/components/AdminNav";
import PlaceSearch, { type SelectedPlace } from "~/components/PlaceSearch";
import AdminLayout from "~/pages/AdminLayout";
import { api } from "~/utils/api";
import { slugify } from "~/utils/slugify";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

type MemberFormState = {
  id?: string;
  name: string;
  slug: string;
  placeId: string;
  address: string;
  mapsUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

const emptyForm = (): MemberFormState => ({
  name: "",
  slug: "",
  placeId: "",
  address: "",
  mapsUrl: "",
  sortOrder: 0,
  isPublished: true,
});

const AdminMembers = () => {
  const members = api.member.listAll.useQuery();
  const utils = api.useContext();
  const [form, setForm] = useState<MemberFormState | null>(null);

  const upsert = api.member.upsert.useMutation({
    onSuccess: async () => {
      toast.success("Miembro guardado");
      setForm(null);
      await utils.member.listAll.invalidate();
      await utils.member.listPublished.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo guardar el miembro");
    },
  });

  const remove = api.member.delete.useMutation({
    onSuccess: async () => {
      toast.success("Miembro eliminado");
      await utils.member.listAll.invalidate();
      await utils.member.listPublished.invalidate();
    },
    onError: () => {
      toast.error("No se pudo eliminar el miembro");
    },
  });

  const onPlaceSelect = (place: SelectedPlace) => {
    setForm((current) => ({
      ...(current ?? emptyForm()),
      placeId: place.placeId,
      name: current?.name ? current.name : place.name,
      slug: current?.slug ? current.slug : slugify(place.name),
      address: place.address ?? current?.address ?? "",
      mapsUrl: place.mapsUrl ?? current?.mapsUrl ?? "",
    }));
  };

  return (
    <AdminLayout>
      <Toaster />
      <AdminNav />
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl">Miembros</h1>
        <button
          type="button"
          onClick={() => setForm(emptyForm())}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-950"
        >
          <p>Miembro nuevo</p>
          <IoAddCircleSharp />
        </button>
      </div>

      {form && (
        <form
          className="mb-8 flex flex-col gap-4 rounded-lg bg-slate-100 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!form.placeId) {
              toast.error("Elige un lugar en Google Maps para asociarlo al mapa");
              return;
            }
            upsert.mutate({
              id: form.id,
              name: form.name,
              slug: form.slug || slugify(form.name),
              placeId: form.placeId,
              address: form.address || undefined,
              mapsUrl: form.mapsUrl || undefined,
              sortOrder: form.sortOrder,
              isPublished: form.isPublished,
            });
          }}
        >
          <PlaceSearch
            key={form.id ?? "new"}
            onSelect={onPlaceSelect}
            defaultQuery={form.name}
          />

          {form.placeId && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-medium">Lugar asociado al mapa</p>
              <p>{form.address || "Dirección pendiente"}</p>
              <p className="mt-1 font-mono text-xs">{form.placeId}</p>
            </div>
          )}

          <label className="flex flex-col gap-1">
            <span className="font-medium">Nombre</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                  slug: form.id ? form.slug : slugify(event.target.value),
                })
              }
              className="rounded-md border border-slate-300 p-3"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium">Dirección</span>
            <input
              value={form.address}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              className="rounded-md border border-slate-300 p-3"
            />
          </label>

          <div className="flex flex-wrap gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-medium">Orden</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm({
                    ...form,
                    sortOrder: Number(event.target.value),
                  })
                }
                className="w-28 rounded-md border border-slate-300 p-3"
              />
            </label>
            <label className="flex items-center gap-2 self-end pb-3">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  setForm({ ...form, isPublished: event.target.checked })
                }
              />
              <span>Visible en el sitio</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={upsert.isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-950 disabled:opacity-60"
            >
              {upsert.isLoading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-md bg-white px-4 py-2 text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {members.data?.map((member) => (
          <div
            key={member.id}
            className={`flex flex-col justify-between gap-5 rounded-lg p-6 md:flex-row md:items-center ${
              member.isPublished
                ? "bg-slate-100 hover:bg-slate-200"
                : "bg-red-100 hover:bg-red-200"
            }`}
          >
            <div>
              <h2 className="text-lg font-medium text-slate-800">
                {member.name}
              </h2>
              <p className="text-sm text-slate-600">
                {member.address ?? "Sin dirección"}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: member.id,
                    name: member.name,
                    slug: member.slug,
                    placeId: member.placeId,
                    address: member.address ?? "",
                    mapsUrl: member.mapsUrl ?? "",
                    sortOrder: member.sortOrder,
                    isPublished: member.isPublished,
                  })
                }
                className="flex items-center justify-center gap-2 hover:font-bold"
              >
                <p>Editar</p>
                <IoPencilSharp />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Eliminar a ${member.name} del sitio y del mapa?`,
                    )
                  ) {
                    remove.mutate({ id: member.id });
                  }
                }}
                className="flex items-center justify-center gap-2 hover:font-bold"
              >
                <p>Eliminar</p>
                <IoCloseCircleSharp />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminMembers;
