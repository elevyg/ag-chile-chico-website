import Link from "next/link";

const index = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-5xl">No encontramos la página que buscabas</h1>
      <Link href="/" className="text-sky-400 underline">
        Volver al inicio
      </Link>
    </div>
  );
};

export default index;
