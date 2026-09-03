import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import AdminNav from "~/components/AdminNav";
import AdminLayout from "~/pages/AdminLayout";
import { api } from "~/utils/api";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await translationServerProps(locale)),
  },
});

const qrPages = [
  {
    href: "/qr",
    label: "QR del sitio",
    description: "Descarga el código que apunta a chilechicoturismo.cl",
  },
  {
    href: "/entradas-parque/qr",
    label: "QR de entradas del parque",
    description: "Descarga el código que apunta a /entradas-parque",
  },
];

const AdminQr = () => {
  const settings = api.settings.getParkTicketsRedirect.useQuery();
  const [draft, setDraft] = useState<string | null>(null);
  const url = draft ?? settings.data?.url ?? "";

  const update = api.settings.updateParkTicketsRedirect.useMutation({
    onSuccess: () => {
      toast.success("Redirección guardada");
      setDraft(null);
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo guardar la URL");
    },
  });

  return (
    <AdminLayout>
      <Toaster />
      <AdminNav />
      <h1 className="mb-5 text-2xl">QR y entradas</h1>

      <form
        className="mb-8 flex flex-col gap-4 rounded-lg bg-slate-100 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          update.mutate({ url });
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="font-medium">URL de /entradas-parque</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setDraft(event.target.value)}
            disabled={settings.isLoading}
            className="rounded-md border border-slate-300 p-3"
            placeholder="https://tickets.pasesparques.cl/..."
            required
          />
        </label>
        <p className="text-sm text-slate-600">
          El QR de entradas apunta a /entradas-parque, no a esta URL. Si cambias
          el destino no hay que reimprimir los códigos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={update.isLoading || !url}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-950 disabled:opacity-60"
          >
            {update.isLoading ? "Guardando..." : "Guardar"}
          </button>
          <Link
            href="/entradas-parque"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-slate-700 hover:bg-slate-200"
          >
            Probar redirección
            <IoArrowForwardCircleSharp />
          </Link>
        </div>
      </form>

      <h2 className="mb-3 text-xl">Descargas de QR</h2>
      <div className="flex flex-col gap-2">
        {qrPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between gap-2 rounded-lg bg-slate-100 p-6 hover:bg-slate-200 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-lg font-medium text-slate-800">
                {page.label}
              </h3>
              <p className="text-sm text-slate-600">{page.description}</p>
            </div>
            <span className="flex items-center gap-2 font-medium text-slate-800">
              Abrir
              <IoArrowForwardCircleSharp />
            </span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminQr;
